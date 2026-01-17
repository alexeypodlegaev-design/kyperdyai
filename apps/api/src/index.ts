import Fastify from "fastify";
import cors from "@fastify/cors";
import sensible from "@fastify/sensible";
import jwt from "@fastify/jwt";
import rateLimit from "@fastify/rate-limit";
import { z } from "zod";
import fetch from "node-fetch";
import crypto from "crypto";
import PQueue from "p-queue";
import { mkdir, writeFile } from "fs/promises";
import { createReadStream } from "fs";
import path from "path";
import { randomUUID } from "crypto";
import {
  countStoriesSince,
  createStory,
  getActiveStory,
  getStoryById,
  getUserById,
  initDb,
  listStories,
  setPremiumByTgId,
  updateStoryById,
  upsertUserByTgId
} from "./db.js";

const queue = new PQueue({ concurrency: 1 });

initDb();

const envSchema = z.object({
  BOT_TOKEN: z.string().min(1),
  WEBAPP_URL: z.string().min(1),
  API_BASE_URL: z.string().min(1),
  ADMIN_SECRET: z.string().min(1),
  ADMIN_TELEGRAM_IDS: z.string().min(1),
  LLM_BASE_URL: z.string().min(1),
  LLM_API_KEY: z.string().min(1),
  LLM_MODEL: z.string().min(1),
  JWT_SECRET: z.string().min(1),
  STORAGE_DIR: z.string().min(1),
  SQLITE_PATH: z.string().min(1),
  TTS_BASE_URL: z.string().min(1),
  OUTPUT_AUDIO_FORMAT: z.string().min(1)
});

const env = envSchema.parse(process.env);

const server = Fastify({ logger: true });

await server.register(cors, {
  origin: [env.WEBAPP_URL],
  credentials: true
});
await server.register(sensible);
await server.register(jwt, { secret: env.JWT_SECRET });
await server.register(rateLimit, { max: 100, timeWindow: "1 minute" });

server.decorate("authenticate", async (request: any) => {
  await request.jwtVerify();
});

const authHeaderSchema = z.object({ authorization: z.string() });

function parseInitData(initData: string) {
  const parsed = new URLSearchParams(initData);
  const data = Object.fromEntries(parsed.entries());
  const hash = data.hash;
  delete data.hash;
  const dataCheckString = Object.keys(data)
    .sort()
    .map((key) => `${key}=${data[key]}`)
    .join("\n");
  const secret = crypto.createHmac("sha256", "WebAppData").update(env.BOT_TOKEN).digest();
  const computedHash = crypto.createHmac("sha256", secret).update(dataCheckString).digest("hex");
  return { data, hash, computedHash };
}

function isPremium(user: { is_premium: number }) {
  return user.is_premium === 1;
}

function storyToResponse(story: any) {
  let params: Record<string, any> = {};
  if (story.params_json) {
    try {
      params = JSON.parse(story.params_json);
    } catch {
      params = {};
    }
  }
  return {
    id: story.id,
    theme: params.theme ?? story.title,
    ageGroup: params.ageGroup,
    style: params.style,
    duration: params.duration,
    narrator: params.narrator,
    moral: params.moral,
    ending: params.ending,
    status: story.status,
    text: story.text,
    audioPath: story.audio_path,
    errorMessage: story.error,
    createdAt: story.created_at
  };
}

server.post("/api/auth/telegram", async (request, reply) => {
  const bodySchema = z.object({ initData: z.string().min(1) });
  const { initData } = bodySchema.parse(request.body);
  const { data, hash, computedHash } = parseInitData(initData);
  if (!hash || computedHash !== hash) {
    return reply.unauthorized("Invalid Telegram auth");
  }
  const userData = data.user ? JSON.parse(data.user) : null;
  if (!userData?.id) {
    return reply.badRequest("Missing user data");
  }
  const user = upsertUserByTgId(String(userData.id));
  const token = server.jwt.sign({ sub: String(user.id), telegramId: user.tg_id });
  return { token };
});

server.post("/api/admin/premium", async (request, reply) => {
  const bodySchema = z.object({ telegramId: z.string().min(1), days: z.number().int().positive() });
  const header = authHeaderSchema.parse(request.headers);
  const adminSecret = header.authorization.replace("Bearer ", "");
  if (adminSecret !== env.ADMIN_SECRET) {
    return reply.unauthorized("Invalid admin secret");
  }
  const { telegramId, days } = bodySchema.parse(request.body);
  const user = setPremiumByTgId(telegramId, true);
  return { telegramId: user?.tg_id ?? telegramId, premiumUntil: days };
});

server.post("/api/stories", { preHandler: server.authenticate }, async (request: any, reply) => {
  const bodySchema = z.object({
    theme: z.string().min(1),
    ageGroup: z.string().min(1),
    style: z.string().min(1),
    duration: z.enum(["5", "20"]),
    narrator: z.enum(["klaus", "cooper"]),
    moral: z.string().optional(),
    ending: z.string().min(1)
  });
  const payload = bodySchema.parse(request.body);

  const user = getUserById(Number(request.user.sub));
  if (!user) {
    return reply.unauthorized("Unknown user");
  }

  const activeStory = getActiveStory(user.id);
  if (activeStory) {
    return reply.conflict("Generation already in progress");
  }

  const premium = isPremium(user);
  if (!premium) {
    const hourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const count = countStoriesSince(user.id, hourAgo);
    if (count >= 5) {
      return reply.tooManyRequests("Free limit reached");
    }
  } else {
    const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const count = countStoriesSince(user.id, dayAgo);
    if (count >= 30) {
      return reply.tooManyRequests("Premium limit reached");
    }
  }

  const storyId = randomUUID();
  const story = createStory({
    id: storyId,
    user_id: user.id,
    title: payload.theme,
    text: null,
    params_json: JSON.stringify(payload),
    status: "generating_text",
    error: null,
    audio_path: null,
    duration_sec: payload.duration === "5" ? 300 : 1200
  });

  queue.add(() => processStory(story.id, user.tg_id, payload));

  reply.code(202).send(storyToResponse(story));
});

server.get("/api/stories", { preHandler: server.authenticate }, async (request: any) => {
  const stories = listStories(Number(request.user.sub), 20);
  return stories.map(storyToResponse);
});

server.get("/api/stories/:id", { preHandler: server.authenticate }, async (request: any, reply) => {
  const story = getStoryById(request.params.id, Number(request.user.sub));
  if (!story) {
    return reply.notFound("Story not found");
  }
  return storyToResponse(story);
});

server.get("/api/stories/:id/audio", { preHandler: server.authenticate }, async (request: any, reply) => {
  const story = getStoryById(request.params.id, Number(request.user.sub));
  if (!story?.audio_path) {
    return reply.notFound("Audio not ready");
  }
  const audioPath = path.join(env.STORAGE_DIR, story.audio_path);
  reply.header("Content-Type", `audio/${env.OUTPUT_AUDIO_FORMAT}`);
  return reply.send(createReadStream(audioPath));
});

server.get("/health", async () => ({ status: "ok" }));

server.addHook("onSend", async (_request, reply, payload) => {
  if (reply.getHeader("content-type")?.toString().includes("application/json")) {
    return payload;
  }
  return payload;
});

async function processStory(storyId: string, telegramId: string, payload: any) {
  try {
    updateStoryById(storyId, { status: "generating_text" });
    const wordLimit = payload.duration === "5" ? 900 : 3600;
    const storyText = await generateStoryText({ ...payload, wordLimit });

    updateStoryById(storyId, { text: storyText, status: "generating_audio" });

    const audioBuffer = await generateAudio(storyText, payload.narrator);
    await mkdir(env.STORAGE_DIR, { recursive: true });
    const filename = `${telegramId}-${storyId}.${env.OUTPUT_AUDIO_FORMAT}`;
    const outputPath = path.join(env.STORAGE_DIR, filename);
    await writeFile(outputPath, audioBuffer);

    updateStoryById(storyId, { status: "ready", audio_path: filename });
  } catch (error: any) {
    updateStoryById(storyId, { status: "error", error: error?.message ?? "Unknown error" });
  }
}

async function generateStoryText({ theme, ageGroup, style, duration, narrator, moral, ending, wordLimit }: any) {
  const systemPrompt = `You are a storyteller creating an engaging kids story in Russian.`;
  const userPrompt = `Create a story with the following parameters:\nTheme: ${theme}\nAge group: ${ageGroup}\nStyle: ${style}\nDuration: ${duration} minutes\nNarrator: ${narrator}\nMoral: ${moral || "none"}\nEnding: ${ending}\nLimit: ${wordLimit} words maximum. Provide plain text without markdown.`;

  const response = await fetch(`${env.LLM_BASE_URL}/v1/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${env.LLM_API_KEY}`
    },
    body: JSON.stringify({
      model: env.LLM_MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.8
    })
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`LLM error: ${response.status} ${text}`);
  }
  const json = await response.json();
  const content = json.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error("LLM returned empty story");
  }
  return content.trim();
}

async function generateAudio(text: string, narrator: string) {
  const response = await fetch(`${env.TTS_BASE_URL}/tts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      text,
      quality: "hq",
      format: env.OUTPUT_AUDIO_FORMAT,
      narrator
    })
  });
  if (!response.ok) {
    const textError = await response.text();
    throw new Error(`TTS error: ${response.status} ${textError}`);
  }
  const buffer = await response.arrayBuffer();
  return Buffer.from(buffer);
}

server.listen({ port: 8080, host: "0.0.0.0" }).catch((error) => {
  server.log.error(error);
  process.exit(1);
});

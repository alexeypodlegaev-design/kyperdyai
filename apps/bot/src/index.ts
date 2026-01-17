import { Telegraf, Markup } from "telegraf";
import axios from "axios";

const BOT_TOKEN = process.env.BOT_TOKEN;
const WEBAPP_URL = process.env.WEBAPP_URL;
const ADMIN_TELEGRAM_IDS = process.env.ADMIN_TELEGRAM_IDS ?? "";
const API_BASE_URL = process.env.API_BASE_URL ?? "";

if (!BOT_TOKEN || !WEBAPP_URL) {
  throw new Error("BOT_TOKEN and WEBAPP_URL are required");
}

const adminIds = new Set(
  ADMIN_TELEGRAM_IDS.split(",")
    .map((id) => id.trim())
    .filter(Boolean)
);

const bot = new Telegraf(BOT_TOKEN);

bot.start(async (ctx) => {
  await ctx.reply(
    "Привет! Я помогу создать сказку. Нажмите кнопку ниже, чтобы открыть мини-приложение.",
    Markup.inlineKeyboard([
      Markup.button.webApp("Открыть мини-приложение", WEBAPP_URL)
    ])
  );
});

bot.command("admin_premium", async (ctx) => {
  const senderId = String(ctx.from?.id ?? "");
  if (!adminIds.has(senderId)) {
    return ctx.reply("Нет доступа к админ-командам.");
  }
  const parts = ctx.message.text.split(" ");
  if (parts.length < 3) {
    return ctx.reply("Использование: /admin_premium <telegramId> <days>");
  }
  const telegramId = parts[1];
  const days = Number(parts[2]);
  if (!telegramId || Number.isNaN(days) || days <= 0) {
    return ctx.reply("Укажите корректный telegramId и число дней.");
  }

  try {
    const adminSecret = process.env.ADMIN_SECRET;
    if (!adminSecret) {
      return ctx.reply("ADMIN_SECRET не задан.");
    }
    const response = await axios.post(
      `${API_BASE_URL}/api/admin/premium`,
      { telegramId, days },
      { headers: { Authorization: `Bearer ${adminSecret}` } }
    );
    return ctx.reply(`Premium включен до ${response.data.premiumUntil}.`);
  } catch (error: any) {
    return ctx.reply(`Ошибка: ${error?.response?.data ?? error.message}`);
  }
});

bot.launch().then(() => {
  console.log("Bot started");
});

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));

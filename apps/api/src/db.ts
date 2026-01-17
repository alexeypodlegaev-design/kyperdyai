import Database from "better-sqlite3";
import { mkdirSync } from "fs";
import { dirname } from "path";

export type UserRecord = {
  id: number;
  tg_id: string;
  is_premium: number;
  created_at: string;
};

export type StoryRecord = {
  id: string;
  user_id: number;
  title: string;
  text: string | null;
  params_json: string;
  status: string;
  error: string | null;
  audio_path: string | null;
  duration_sec: number | null;
  created_at: string;
};

const sqlitePath = process.env.SQLITE_PATH ?? "/data/db.sqlite";
mkdirSync(dirname(sqlitePath), { recursive: true });

const db = new Database(sqlitePath);

export function initDb() {
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");

  db.prepare(
    `CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tg_id TEXT UNIQUE NOT NULL,
      is_premium INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL
    );`
  ).run();

  db.prepare(
    `CREATE TABLE IF NOT EXISTS stories (
      id TEXT PRIMARY KEY,
      user_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      text TEXT,
      params_json TEXT NOT NULL,
      status TEXT NOT NULL,
      error TEXT,
      audio_path TEXT,
      duration_sec INTEGER,
      created_at TEXT NOT NULL,
      FOREIGN KEY(user_id) REFERENCES users(id)
    );`
  ).run();
}

export function getUserByTgId(tgId: string): UserRecord | undefined {
  return db.prepare("SELECT * FROM users WHERE tg_id = ?").get(tgId) as UserRecord | undefined;
}

export function getUserById(id: number): UserRecord | undefined {
  return db.prepare("SELECT * FROM users WHERE id = ?").get(id) as UserRecord | undefined;
}

export function upsertUserByTgId(tgId: string): UserRecord {
  const now = new Date().toISOString();
  db.prepare(
    "INSERT INTO users (tg_id, is_premium, created_at) VALUES (?, 0, ?) ON CONFLICT(tg_id) DO NOTHING"
  ).run(tgId, now);
  const user = getUserByTgId(tgId);
  if (!user) {
    throw new Error("Failed to create user");
  }
  return user;
}

export function setPremiumByTgId(tgId: string, enabled: boolean) {
  db.prepare("UPDATE users SET is_premium = ? WHERE tg_id = ?").run(enabled ? 1 : 0, tgId);
  return getUserByTgId(tgId);
}

export function createStory(record: Omit<StoryRecord, "created_at">): StoryRecord {
  const createdAt = new Date().toISOString();
  db.prepare(
    `INSERT INTO stories (id, user_id, title, text, params_json, status, error, audio_path, duration_sec, created_at)
     VALUES (@id, @user_id, @title, @text, @params_json, @status, @error, @audio_path, @duration_sec, @created_at)`
  ).run({ ...record, created_at: createdAt });
  const story = getStoryById(record.id, record.user_id);
  if (!story) {
    throw new Error("Failed to create story");
  }
  return story;
}

export function getStoryById(id: string, userId: number): StoryRecord | undefined {
  return db.prepare("SELECT * FROM stories WHERE id = ? AND user_id = ?").get(id, userId) as
    | StoryRecord
    | undefined;
}

export function listStories(userId: number, limit = 20): StoryRecord[] {
  return db
    .prepare("SELECT * FROM stories WHERE user_id = ? ORDER BY created_at DESC LIMIT ?")
    .all(userId, limit) as StoryRecord[];
}

export function getActiveStory(userId: number): StoryRecord | undefined {
  return db
    .prepare(
      "SELECT * FROM stories WHERE user_id = ? AND status IN ('generating_text','generating_audio') LIMIT 1"
    )
    .get(userId) as StoryRecord | undefined;
}

export function countStoriesSince(userId: number, sinceIso: string): number {
  const row = db
    .prepare("SELECT COUNT(*) as count FROM stories WHERE user_id = ? AND created_at >= ?")
    .get(userId, sinceIso) as { count: number };
  return row?.count ?? 0;
}

export function updateStory(
  id: string,
  userId: number,
  data: Partial<Pick<StoryRecord, "text" | "status" | "error" | "audio_path" | "duration_sec">>
) {
  const fields = Object.keys(data);
  if (fields.length === 0) return;
  const sets = fields.map((field) => `${field} = @${field}`).join(", ");
  db.prepare(`UPDATE stories SET ${sets} WHERE id = @id AND user_id = @user_id`).run({
    id,
    user_id: userId,
    ...data
  });
}

export function updateStoryById(id: string, data: Partial<StoryRecord>) {
  const fields = Object.keys(data);
  if (fields.length === 0) return;
  const sets = fields.map((field) => `${field} = @${field}`).join(", ");
  db.prepare(`UPDATE stories SET ${sets} WHERE id = @id`).run({
    id,
    ...data
  });
}

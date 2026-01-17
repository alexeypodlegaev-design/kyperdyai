export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

export type StoryStatus = "generating_text" | "generating_audio" | "ready" | "error";

export interface Story {
  id: string;
  theme: string;
  ageGroup: string;
  style: string;
  duration: string;
  narrator: string;
  moral?: string | null;
  ending: string;
  status: StoryStatus;
  text?: string | null;
  audioPath?: string | null;
  errorMessage?: string | null;
  createdAt: string;
}

export async function apiFetch<T>(path: string, options: RequestInit = {}) {
  const token = localStorage.getItem("kyperdy_token");
  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers
  });
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || "Ошибка запроса");
  }
  return response.json() as Promise<T>;
}

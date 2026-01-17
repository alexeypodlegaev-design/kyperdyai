import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { apiFetch, API_BASE_URL, Story } from "../api";
import Card from "../components/Card";
import Button from "../components/Button";
import ProgressBar from "../components/ProgressBar";
import ErrorBanner from "../components/ErrorBanner";
import PlayerCard from "../components/PlayerCard";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiFetch, API_BASE_URL, Story } from "../api";

export default function StoryDetail() {
  const { id } = useParams();
  const [story, setStory] = useState<Story | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hqAudio, setHqAudio] = useState(false);

  useEffect(() => {
    if (!id) return;

    let interval: number | null = null;

    async function load() {
      try {
        const data = await apiFetch<Story>(`/api/stories/${id}`);
        setStory(data);
        if (data.status === "ready" || data.status === "error") {
          if (interval) window.clearInterval(interval);
        }
      } catch (err: any) {
        setError(err.message);
        if (interval) window.clearInterval(interval);
      }
    }

    load();
    interval = window.setInterval(load, 2000);

    return () => {
      if (interval) window.clearInterval(interval);
    };
  }, [id]);

  const progress = useMemo(() => {
    if (!story) return 0;
    if (story.status === "generating_text") return 35;
    if (story.status === "generating_audio") return 75;
    if (story.status === "ready") return 100;
    return 100;
  }, [story]);

  if (!story) {
    return (
      <Card>
        <p className="text-sm text-slate-600">Загрузка...</p>
      </Card>
  if (!story) {
    return (
      <div className="space-y-4">
        <p className="text-slate-300">Загрузка...</p>
      </div>
    );
  }

  const audioUrl = `${API_BASE_URL}/api/stories/${story.id}/audio`;

  return (
    <div className="space-y-5">
      <PlayerCard
        title={story.theme}
        meta={`${story.ageGroup} • ${story.style} • ${story.duration} минут • Рассказчик ${story.narrator}`}
      >
        <p className="text-xs text-slate-500">ID: {story.id.slice(0, 4)}</p>
      </PlayerCard>

      {story.status !== "ready" && (
        <Card>
          <p className="text-sm text-slate-600">Статус генерации</p>
          <div className="mt-3">
            <ProgressBar value={progress} />
          </div>
          <div className="mt-3 flex items-center gap-3 text-sm text-slate-500">
            <span className="text-2xl">🎧</span>
            <span>
              {story.status === "generating_text" && "Придумываем сюжет..."}
              {story.status === "generating_audio" && "Создаём аудио... (~30 сек)"}
              {story.status === "error" && `Ошибка: ${story.errorMessage}`}
            </span>
          </div>
          <div className="mt-4 h-2 w-full rounded-full bg-white/70">
            <div className="h-2 w-1/2 animate-pulse rounded-full bg-gradient-to-r from-pink-300 to-purple-300" />
          </div>
        </Card>
      )}

      {story.status === "ready" && (
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Аудио</p>
              <p className="text-base font-semibold text-slate-800">{story.theme}</p>
            </div>
            <label className="flex items-center gap-2 text-xs text-slate-500 opacity-70">
              <input
                type="checkbox"
                checked={hqAudio}
                onChange={(event) => setHqAudio(event.target.checked)}
                className="h-4 w-4 rounded border-white/80 bg-white"
                disabled
              />
              HQ audio
            </label>
          </div>
          <div className="mt-4">
            <audio className="w-full" controls src={audioUrl} />
          </div>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <Button variant="primary" fullWidth>
              ▶ Слушать
            </Button>
            <a href={audioUrl} download className="w-full">
              <Button variant="secondary" fullWidth>
                ⬇ Скачать MP3
              </Button>
            </a>
          </div>
          {hqAudio && (
            <p className="mt-3 text-xs text-slate-500">
              HQ режим пока доступен как визуальная настройка в MVP.
            </p>
          )}
        </Card>
      )}

      {story.status === "ready" && (
        <Card>
          <h3 className="text-base font-semibold text-slate-800">Текст сказки</h3>
          <p className="mt-3 whitespace-pre-line text-sm text-slate-600">{story.text}</p>
        </Card>
      )}

      {error && <ErrorBanner message={error} />}
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-700 bg-slate-900 p-4">
        <h2 className="text-xl font-semibold">{story.theme}</h2>
        <p className="text-slate-400 text-sm">
          {story.ageGroup} • {story.style} • {story.duration} минут • Рассказчик {story.narrator}
        </p>
      </div>

      {story.status !== "ready" && (
        <div className="rounded-2xl border border-slate-700 bg-slate-900 p-4">
          <p className="text-lg font-semibold">Генерация...</p>
          <p className="text-slate-400 text-sm mt-2">
            {story.status === "generating_text" && "Генерируем текст..."}
            {story.status === "generating_audio" && "Создаём аудио... (~30 сек)"}
            {story.status === "error" && `Ошибка: ${story.errorMessage}`}
          </p>
        </div>
      )}

      {story.status === "ready" && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-700 bg-slate-900 p-4">
            <p className="text-sm text-slate-400">Аудио</p>
            <audio className="w-full mt-2" controls src={audioUrl} />
            <a
              href={audioUrl}
              download
              className="inline-block mt-3 text-sm text-brand-500"
            >
              Скачать MP3
            </a>
          </div>
          <div className="rounded-2xl border border-slate-700 bg-slate-900 p-4 whitespace-pre-line">
            {story.text}
          </div>
        </div>
      )}

      {error && <p className="text-red-400 text-sm">{error}</p>}
    </div>
  );
}

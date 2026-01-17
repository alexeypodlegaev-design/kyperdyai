import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiFetch, API_BASE_URL, Story } from "../api";

export default function StoryDetail() {
  const { id } = useParams();
  const [story, setStory] = useState<Story | null>(null);
  const [error, setError] = useState<string | null>(null);

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

  if (!story) {
    return (
      <div className="space-y-4">
        <p className="text-slate-300">Загрузка...</p>
      </div>
    );
  }

  const audioUrl = `${API_BASE_URL}/api/stories/${story.id}/audio`;

  return (
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

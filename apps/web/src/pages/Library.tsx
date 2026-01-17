import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiFetch, Story } from "../api";

export default function Library() {
  const [stories, setStories] = useState<Story[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadStories() {
      try {
        const data = await apiFetch<Story[]>("/api/stories");
        setStories(data);
      } catch (err: any) {
        setError(err.message);
      }
    }
    loadStories();
  }, []);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Библиотека</h2>
      {error && <p className="text-red-400 text-sm">{error}</p>}
      <div className="space-y-3">
        {stories.map((story) => (
          <Link
            key={story.id}
            to={`/story/${story.id}`}
            className="block rounded-2xl border border-slate-700 bg-slate-900 p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">{story.theme}</h3>
                <p className="text-sm text-slate-400">
                  {story.ageGroup} • {story.style} • {story.duration} мин
                </p>
              </div>
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  story.status === "ready"
                    ? "bg-green-500/20 text-green-300"
                    : story.status === "error"
                      ? "bg-red-500/20 text-red-300"
                      : "bg-yellow-500/20 text-yellow-200"
                }`}
              >
                {story.status}
              </span>
            </div>
          </Link>
        ))}
        {stories.length === 0 && <p className="text-slate-400">Сказок пока нет.</p>}
      </div>
    </div>
  );
}

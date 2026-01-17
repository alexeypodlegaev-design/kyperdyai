import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { apiFetch, Story } from "../api";
import Card from "../components/Card";
import Chip from "../components/Chip";
import StoryPreviewCard from "../components/StoryPreviewCard";
import ErrorBanner from "../components/ErrorBanner";
import { seedStories } from "../data/seedStories";
import SectionTitle from "../components/SectionTitle";
import SkeletonLoader from "../components/SkeletonLoader";

const narratorFilters = ["Все", "Клаус", "Купер"] as const;

type NarratorFilter = (typeof narratorFilters)[number];
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiFetch, Story } from "../api";

export default function Library() {
  const [stories, setStories] = useState<Story[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<NarratorFilter>("Все");

  useEffect(() => {
    async function loadStories() {
      try {
        const data = await apiFetch<Story[]>("/api/stories");
        setStories(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadStories();
  }, []);

  const allStories = useMemo(() => {
    if (stories.length > 0) return stories;
    return seedStories.map((story) => ({
      id: story.id,
      theme: story.theme,
      ageGroup: "6-8",
      style: story.style,
      duration: story.duration,
      narrator: story.narrator.toLowerCase(),
      moral: null,
      ending: "Счастливый финал",
      status: story.status === "ready" ? "ready" : "generating_text",
      text: null,
      audioPath: null,
      errorMessage: null,
      createdAt: new Date().toISOString()
    }));
  }, [stories]);

  const filteredStories = allStories.filter((story) => {
    if (filter === "Все") return true;
    const target = filter === "Клаус" ? "klaus" : "cooper";
    return story.narrator === target;
  });

  return (
    <div className="space-y-4">
      <SectionTitle
        rightSlot={
          <Link to="/create" className="text-sm text-slate-500">
            Новая сказка →
          </Link>
        }
      >
        Библиотека
      </SectionTitle>

      <Card>
        <p className="text-sm text-slate-600">Фильтр по рассказчику</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {narratorFilters.map((item) => (
            <Chip key={item} selected={filter === item} onClick={() => setFilter(item)}>
              {item}
            </Chip>
          ))}
        </div>
      </Card>

      {error && <ErrorBanner message={error} />}

      {loading ? (
        <div className="space-y-3">
          <SkeletonLoader className="h-24" />
          <SkeletonLoader className="h-24" />
          <SkeletonLoader className="h-24" />
        </div>
      ) : (
        <div className="space-y-3">
          {filteredStories.map((story) => (
            <Link key={story.id} to={`/story/${story.id}`}>
              <StoryPreviewCard
                story={{
                  id: story.id,
                  title: story.theme,
                  narrator: story.narrator === "klaus" ? "Клаус" : "Купер",
                  minutes: story.duration,
                  status: story.status,
                  timeAgo: "10 мин. назад"
                }}
              />
            </Link>
          ))}
          {filteredStories.length === 0 && (
            <Card>
              <p className="text-sm text-slate-600">Сказок пока нет. Создайте первую историю.</p>
            </Card>
          )}
        </div>
      )}
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

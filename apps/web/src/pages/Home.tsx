import { Link } from "react-router-dom";
import Button from "../components/Button";
import Card from "../components/Card";
import StoryPreviewCard from "../components/StoryPreviewCard";
import NarratorSelectCard from "../components/NarratorSelectCard";
import { seedStories } from "../data/seedStories";
import Hero from "../components/Hero";
import PrimaryCTA from "../components/PrimaryCTA";
import PremiumBanner from "../components/PremiumBanner";
import CharacterCards from "../components/CharacterCards";
import RecentStories from "../components/RecentStories";
import PillButton from "../components/PillButton";
import SectionTitle from "../components/SectionTitle";
import SoftDivider from "../components/SoftDivider";

const narrators = [
  {
    id: "klaus",
    name: "Клаус",
    description: "Тёплый, спокойный тембр. Подходит для вечерних историй."
  },
  {
    id: "cooper",
    name: "Купер",
    description: "Более энергичный рассказчик. Идеален для приключений."
  }
];

export default function Home() {
  return (
    <div className="space-y-8">
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Hero
          title="Привет, Малыш!"
          subtitle="Готов к новой сказке? Создай историю и послушай её вместе с Купером и Клаусом!"
          badge="🌟 Сказка за 3 шага"
        >
          <PrimaryCTA>
            <Link to="/create" className="flex-1">
              <PillButton className="w-full">🌈 Создать сказку</PillButton>
            </Link>
            <Link to="/library" className="flex-1">
              <PillButton variant="secondary" className="w-full">
                📚 Моя библиотека
              </PillButton>
            </Link>
          </PrimaryCTA>
        </Hero>
        <Card className="flex flex-col items-center justify-center gap-4 bg-gradient-to-br from-sunny-100 to-candy-50">
          <div className="relative flex h-44 w-44 items-center justify-center rounded-full bg-gradient-to-br from-orange-300 to-yellow-200 text-5xl shadow-card">
            🐱
            <div className="absolute -bottom-4 right-2 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-sky-300 to-purple-300 text-3xl shadow-float">
              🐶
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-600">Клаус</span>
            <span className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-600">Купер</span>
          </div>
          <div className="rounded-full bg-gradient-to-r from-yellow-300 to-orange-300 px-4 py-2 text-xs font-semibold text-slate-700 shadow-float">
            👑 Premium
          </div>
        </Card>
      </div>

      <PremiumBanner
        title="Премиум сказки"
        description="Длинные истории на 20 минут, больше лимитов и HQ-озвучка."
        badges={["20 минут", "HQ аудио", "Premium"]}
        action={
          <Link to="/premium">
            <Button>💖 Улучшить</Button>
          </Link>
        }
      />

      <div className="space-y-4">
        <SectionTitle>Выберите рассказчика</SectionTitle>
        <CharacterCards>
          {narrators.map((narrator, index) => (
            <NarratorSelectCard key={narrator.id} narrator={narrator} selected={index === 0} />
          ))}
        </CharacterCards>
      </div>

      <div className="space-y-4">
        <SectionTitle
          rightSlot={
            <Link to="/library" className="text-sm text-slate-500">
              Смотреть все →
            </Link>
          }
        >
          Последние сказки
        </SectionTitle>
        <RecentStories>
          {seedStories.map((story) => (
            <StoryPreviewCard
              key={story.id}
              story={{
                id: story.id,
                title: story.theme,
                narrator: story.narrator === "klaus" ? "Клаус" : "Купер",
                minutes: story.duration,
                status: story.status,
                timeAgo: "10 мин. назад"
              }}
            />
          ))}
        </RecentStories>
      </div>

      <SoftDivider />

export default function Home() {
  return (
    <div className="space-y-6">
      <section className="rounded-3xl bg-slate-800/60 p-6 border border-slate-700">
        <h2 className="text-2xl font-semibold mb-2">Создайте персональную сказку</h2>
        <p className="text-slate-300">
          Пошаговый мастер поможет подобрать тему, стиль и рассказчика. После генерации вы получите текст и
          озвучку.
        </p>
        <div className="mt-4 flex gap-3">
          <Link
            to="/create"
            className="px-4 py-2 rounded-full bg-brand-500 hover:bg-brand-700 transition"
          >
            Начать создание
          </Link>
          <Link
            to="/library"
            className="px-4 py-2 rounded-full border border-slate-600 text-slate-200"
          >
            Моя библиотека
          </Link>
        </div>
      </section>

      <section className="grid gap-4">
        {[
          {
            title: "Шаг 1. Тема",
            text: "Опишите сюжет или выберите подсказку: космос, драконы, приключения."
          },
          {
            title: "Шаг 2. Возраст и стиль",
            text: "Выберите возраст, настроение и длительность (5 или 20 минут)."
          },
          {
            title: "Шаг 3. Рассказчик",
            text: "Клаус или Купер, мораль и тип концовки."
          }
        ].map((card) => (
          <div key={card.title} className="rounded-2xl border border-slate-700 p-4 bg-slate-900">
            <h3 className="font-semibold mb-1">{card.title}</h3>
            <p className="text-slate-400 text-sm">{card.text}</p>
          </div>
        ))}
      </section>
    </div>
  );
}

import { Link } from "react-router-dom";

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

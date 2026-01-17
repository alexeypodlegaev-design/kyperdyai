import { Link } from "react-router-dom";

export default function PremiumSoon() {
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-700 bg-slate-900 p-6">
        <h2 className="text-xl font-semibold">Premium скоро</h2>
        <p className="text-slate-400 mt-2">
          Для MVP Premium можно включить через админ-команду бота. Свяжитесь с администратором и укажите
          ваш Telegram ID.
        </p>
        <div className="mt-4">
          <Link to="/create" className="text-brand-500 text-sm">
            Вернуться к созданию
          </Link>
        </div>
      </div>
    </div>
  );
}

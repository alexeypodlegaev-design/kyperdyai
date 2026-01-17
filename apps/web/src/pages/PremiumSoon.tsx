import { Link } from "react-router-dom";
import Card from "../components/Card";
import Button from "../components/Button";
import SectionTitle from "../components/SectionTitle";

export default function PremiumSoon() {
  return (
    <div className="space-y-4">
      <SectionTitle>Premium скоро ✨</SectionTitle>
      <Card className="bg-gradient-to-br from-yellow-100 via-pink-100 to-purple-100">
        <p className="mt-3 text-sm text-slate-600">
          Для MVP Premium можно включить через админ-команду бота. Свяжитесь с администратором и укажите
          ваш Telegram ID.
        </p>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <Link to="/create" className="flex-1">
            <Button fullWidth>✨ Создать сказку</Button>
          </Link>
          <Link to="/" className="flex-1">
            <Button variant="secondary" fullWidth>
              🏠 На главную
            </Button>
          </Link>
        </div>
      </Card>

      <Card>
        <h3 className="text-base font-semibold text-slate-800">Как получить Premium</h3>
        <ul className="mt-3 space-y-2 text-sm text-slate-600">
          <li>1. Узнайте свой Telegram ID.</li>
          <li>2. Напишите администратору проекта.</li>
          <li>3. Команда бота активирует доступ на нужное количество дней.</li>
        </ul>
      </Card>
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

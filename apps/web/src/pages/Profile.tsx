import Card from "../components/Card";
import Button from "../components/Button";
import SectionTitle from "../components/SectionTitle";

export default function Profile() {
  return (
    <div className="space-y-4">
      <SectionTitle>Профиль</SectionTitle>
      <Card>
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-sky-200 to-purple-200 text-3xl">
            🧸
          </div>
          <div>
            <p className="text-sm text-slate-500">Скоро здесь появятся настройки аккаунта.</p>
          </div>
        </div>
      </Card>

      <Card>
        <h3 className="text-base font-semibold">Premium статус</h3>
        <p className="mt-2 text-sm text-slate-500">Включите Premium через админ-команду бота.</p>
        <div className="mt-4">
          <Button>Узнать больше</Button>
        </div>
      </Card>
    </div>
  );
}

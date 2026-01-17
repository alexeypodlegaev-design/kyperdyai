import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch, Story } from "../api";
import Button from "../components/Button";
import Card from "../components/Card";
import Chip from "../components/Chip";
import SegmentedControl from "../components/SegmentedControl";
import NarratorSelectCard from "../components/NarratorSelectCard";
import WizardHeader from "../components/WizardHeader";
import ErrorBanner from "../components/ErrorBanner";
import WizardLayout from "../components/WizardLayout";

const themes = [
  "Приключение в лесу",
  "Космический полёт",
  "Дракон и принцесса",
  "Морское путешествие",
  "Секретный остров"
];
const ageGroups = [
  { value: "3-5", label: "3-5 лет", helper: "Короткие фразы" },
  { value: "6-8", label: "6-8 лет", helper: "Больше диалогов" },
  { value: "9-12", label: "9-12 лет", helper: "Глубже смысл" }
];
const styles = ["Смешная", "Приключение", "Спокойная", "Загадка", "Сказка"];
const endings = ["Счастливый финал", "Открытый финал", "Урок в конце"];
const narrators = [
  {
    id: "klaus",
    name: "Клаус",
    description: "Тёплый, медитативный, подходит для спокойного вечера."
  },
  {
    id: "cooper",
    name: "Купер",
    description: "Энергичный, вдохновляющий, для приключений и смеха."
  }
];

export default function CreateWizard() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [theme, setTheme] = useState("");
  const [ageGroup, setAgeGroup] = useState(ageGroups[0].value);
  const [style, setStyle] = useState(styles[0]);
  const [duration, setDuration] = useState("5");
  const [narrator, setNarrator] = useState("klaus");
  const [moral, setMoral] = useState("");
  const [ending, setEnding] = useState(endings[0]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const canContinue = useMemo(() => {
    if (step === 1) return theme.trim().length > 0;
    if (step === 2) return Boolean(ageGroup && style && duration);
    if (step === 3) return Boolean(narrator && ending);
    return false;
  }, [step, theme, ageGroup, style, duration, narrator, ending]);

  async function handleSubmit() {
    setLoading(true);
    setError(null);
    try {
      const story = await apiFetch<Story>("/api/stories", {
        method: "POST",
        body: JSON.stringify({
          theme,
          ageGroup,
          style,
          duration,
          narrator,
          moral: moral || undefined,
          ending
        })
      });
      navigate(`/story/${story.id}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <WizardLayout title="Создание сказки" badge="✨ Мастер">
      <WizardHeader step={step} />

      {step === 1 && (
        <div className="space-y-4">
          <Card>
            <label className="text-sm text-slate-600">Тема сказки</label>
            <input
              className="mt-3 w-full rounded-3xl border border-white/80 bg-white px-4 py-3 text-sm text-slate-700 placeholder:text-slate-400 shadow-float"
              placeholder="Например: приключения котёнка в космосе"
              value={theme}
              onChange={(event) => setTheme(event.target.value)}
            />
            <p className="mt-3 text-xs text-slate-500">Опишите героя, место действия и цель приключения.</p>
          </Card>
          <div className="flex flex-wrap gap-2">
            {themes.map((item) => (
              <Chip key={item} onClick={() => setTheme(item)} selected={theme === item}>
                {item}
              </Chip>
            ))}
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <Card>
            <h3 className="text-base font-semibold text-slate-800">Возраст</h3>
            <div className="mt-3">
              <SegmentedControl
                value={ageGroup}
                onChange={(value) => setAgeGroup(value)}
                options={ageGroups}
                columns={3}
              />
            </div>
          </Card>

          <Card>
            <h3 className="text-base font-semibold text-slate-800">Стиль</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {styles.map((item) => (
                <Chip key={item} selected={style === item} onClick={() => setStyle(item)}>
                  {item}
                </Chip>
              ))}
            </div>
          </Card>

          <Card>
            <h3 className="text-base font-semibold text-slate-800">Длительность</h3>
            <div className="mt-3">
              <SegmentedControl
                value={duration}
                onChange={(value) => setDuration(value)}
                options={[
                  { value: "5", label: "5 минут", helper: "Free" },
                  { value: "20", label: "20 минут", helper: "Premium" }
                ]}
              />
            </div>
          </Card>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <div className="space-y-3">
            <h3 className="text-base font-semibold text-slate-800">Рассказчик</h3>
            <div className="grid gap-3">
              {narrators.map((item) => (
                <NarratorSelectCard
                  key={item.id}
                  narrator={item}
                  selected={narrator === item.id}
                  onSelect={() => setNarrator(item.id)}
                />
              ))}
            </div>
          </div>

          <Card>
            <label className="text-sm text-slate-600">Мораль (опционально)</label>
            <input
              className="mt-3 w-full rounded-3xl border border-white/80 bg-white px-4 py-3 text-sm text-slate-700 placeholder:text-slate-400 shadow-float"
              placeholder="Например: дружба помогает преодолеть страх"
              value={moral}
              onChange={(event) => setMoral(event.target.value)}
            />
          </Card>

          <Card>
            <label className="text-sm text-slate-600">Концовка</label>
            <div className="mt-3 flex flex-wrap gap-2">
              {endings.map((item) => (
                <Chip key={item} selected={ending === item} onClick={() => setEnding(item)}>
                  {item}
                </Chip>
              ))}
            </div>
          </Card>
        </div>
      )}

      {error && <ErrorBanner message={error} />}

      <div className="flex items-center justify-between gap-3">
        <Button
          variant="outline"
          onClick={() => setStep((prev) => Math.max(1, prev - 1))}
          disabled={step === 1}
        >
          Назад
        </Button>
        {step < 3 ? (
          <Button onClick={() => setStep((prev) => Math.min(3, prev + 1))} disabled={!canContinue}>
            Далее
          </Button>
        ) : (
          <Button onClick={handleSubmit} disabled={!canContinue || loading}>
            {loading ? "Создаем..." : "Создать сказку"}
          </Button>
        )}
      </div>
    </WizardLayout>
  );
}

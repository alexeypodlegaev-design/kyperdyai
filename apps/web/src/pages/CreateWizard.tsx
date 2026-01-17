import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch, Story } from "../api";

const themes = ["Приключение в лесу", "Космический полёт", "Дракон и принцесса", "Морское путешествие"];
const ageGroups = [
  { value: "3-5", label: "3-5 лет" },
  { value: "6-8", label: "6-8 лет" },
  { value: "9-12", label: "9-12 лет" }
];
const styles = ["Смешная", "Приключение", "Спокойная", "Загадка", "Сказка"];
const endings = ["Счастливый финал", "Открытый финал", "Урок в конце"];

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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Создание сказки</h2>
        <span className="text-sm text-slate-400">Шаг {step} из 3</span>
      </div>

      {step === 1 && (
        <div className="space-y-4">
          <div>
            <label className="text-sm text-slate-300">Тема сказки</label>
            <input
              className="mt-2 w-full rounded-2xl bg-slate-900 border border-slate-700 px-4 py-3"
              placeholder="Например: приключения котёнка в космосе"
              value={theme}
              onChange={(event) => setTheme(event.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {themes.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setTheme(item)}
                className="px-3 py-2 rounded-full bg-slate-800 border border-slate-700 text-sm"
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <div>
            <label className="text-sm text-slate-300">Возраст</label>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {ageGroups.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setAgeGroup(item.value)}
                  className={`rounded-2xl px-3 py-2 border ${
                    ageGroup === item.value
                      ? "bg-brand-500 border-brand-500"
                      : "bg-slate-900 border-slate-700"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm text-slate-300">Стиль</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {styles.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setStyle(item)}
                  className={`px-3 py-2 rounded-full border text-sm ${
                    style === item
                      ? "bg-brand-500 border-brand-500"
                      : "bg-slate-900 border-slate-700"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm text-slate-300">Длительность</label>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {[
                { value: "5", label: "5 минут (Free)" },
                { value: "20", label: "20 минут (Premium)" }
              ].map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setDuration(item.value)}
                  className={`rounded-2xl px-3 py-2 border ${
                    duration === item.value
                      ? "bg-brand-500 border-brand-500"
                      : "bg-slate-900 border-slate-700"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <div>
            <label className="text-sm text-slate-300">Рассказчик</label>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {["klaus", "cooper"].map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setNarrator(item)}
                  className={`rounded-2xl px-3 py-2 border ${
                    narrator === item
                      ? "bg-brand-500 border-brand-500"
                      : "bg-slate-900 border-slate-700"
                  }`}
                >
                  {item === "klaus" ? "Клаус" : "Купер"}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm text-slate-300">Мораль (опционально)</label>
            <input
              className="mt-2 w-full rounded-2xl bg-slate-900 border border-slate-700 px-4 py-3"
              placeholder="Например: дружба помогает преодолеть страх"
              value={moral}
              onChange={(event) => setMoral(event.target.value)}
            />
          </div>

          <div>
            <label className="text-sm text-slate-300">Концовка</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {endings.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setEnding(item)}
                  className={`px-3 py-2 rounded-full border text-sm ${
                    ending === item
                      ? "bg-brand-500 border-brand-500"
                      : "bg-slate-900 border-slate-700"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <div className="flex justify-between">
        <button
          type="button"
          onClick={() => setStep((prev) => Math.max(1, prev - 1))}
          disabled={step === 1}
          className="px-4 py-2 rounded-full border border-slate-700 disabled:opacity-40"
        >
          Назад
        </button>
        {step < 3 ? (
          <button
            type="button"
            onClick={() => setStep((prev) => Math.min(3, prev + 1))}
            disabled={!canContinue}
            className="px-4 py-2 rounded-full bg-brand-500 disabled:opacity-40"
          >
            Далее
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canContinue || loading}
            className="px-4 py-2 rounded-full bg-brand-500 disabled:opacity-40"
          >
            {loading ? "Создаем..." : "Создать сказку"}
          </button>
        )}
      </div>
    </div>
  );
}

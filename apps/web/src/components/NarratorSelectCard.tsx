import Card from "./Card";

export type NarratorProfile = {
  id: string;
  name: string;
  description: string;
};

type NarratorSelectCardProps = {
  narrator: NarratorProfile;
  selected?: boolean;
  onSelect?: () => void;
};

export default function NarratorSelectCard({ narrator, selected = false, onSelect }: NarratorSelectCardProps) {
  return (
    <button type="button" onClick={onSelect} className="text-left">
      <Card
        className={`transition ${
          selected ? "border-orange-300 bg-orange-100/60" : "border-white/80"
        }`}
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-yellow-200 to-orange-300 text-3xl shadow-float">
              {narrator.id === "klaus" ? "🐱" : "🐶"}
            </div>
            <div>
              <p className="text-base font-semibold text-slate-800">{narrator.name}</p>
              <p className="mt-2 text-sm text-slate-500">{narrator.description}</p>
            </div>
          </div>
          <div
            className={`flex h-6 w-6 items-center justify-center rounded-full border ${
              selected ? "border-orange-400 bg-orange-400 text-white" : "border-slate-300 bg-white text-slate-400"
            }`}
          >
            {selected ? "✓" : ""}
          </div>
        </div>
      </Card>
    </button>
  );
}

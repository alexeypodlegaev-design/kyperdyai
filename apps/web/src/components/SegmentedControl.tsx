import { ReactNode } from "react";

export type SegmentedOption<T extends string> = {
  value: T;
  label: ReactNode;
  helper?: string;
};

type SegmentedControlProps<T extends string> = {
  value: T;
  options: SegmentedOption<T>[];
  onChange: (value: T) => void;
  columns?: number;
};

export default function SegmentedControl<T extends string>({
  value,
  options,
  onChange,
  columns = 2
}: SegmentedControlProps<T>) {
  return (
    <div className={`grid gap-2`} style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={`rounded-3xl border px-4 py-3 text-left text-sm transition active:scale-[0.98] ${
            value === option.value
              ? "border-orange-200 bg-gradient-to-r from-yellow-200 to-orange-200 text-slate-700 shadow-float"
              : "border-white/70 bg-white/70 text-slate-600 hover:bg-white"
          }`}
        >
          <div className="font-semibold">{option.label}</div>
          {option.helper && <p className="mt-1 text-xs text-slate-400">{option.helper}</p>}
        </button>
      ))}
    </div>
  );
}

import { ReactNode } from "react";

type ChipProps = {
  children: ReactNode;
  selected?: boolean;
  className?: string;
  onClick?: () => void;
};

export default function Chip({ children, selected = false, className = "", onClick }: ChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-4 py-2 text-xs font-semibold transition active:scale-95 ${
        selected
          ? "bg-gradient-to-r from-yellow-300 to-orange-300 text-slate-900 shadow-float"
          : "border border-white/70 bg-white/70 text-slate-600 hover:bg-white"
      } ${className}`}
    >
      {children}
    </button>
  );
}

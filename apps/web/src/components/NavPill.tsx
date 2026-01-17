import { ReactNode } from "react";

export type NavPillProps = {
  active?: boolean;
  children: ReactNode;
};

export default function NavPill({ active = false, children }: NavPillProps) {
  return (
    <span
      className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
        active
          ? "bg-gradient-to-r from-pink-400 via-purple-400 to-sky-400 text-white shadow-float"
          : "bg-[var(--pill)] text-slate-600 hover:bg-white"
      }`}
    >
      {children}
    </span>
  );
}

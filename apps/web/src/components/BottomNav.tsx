import { NavLink } from "react-router-dom";

export type NavTab = {
  to: string;
  label: string;
};

type BottomNavProps = {
  tabs: NavTab[];
};

export default function BottomNav({ tabs }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-20 border-t border-white/5 bg-slate-950/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-xl items-center justify-around px-6 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3">
        {tabs.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            className={({ isActive }) =>
              `rounded-full px-4 py-2 text-xs font-semibold transition ${
                isActive ? "bg-orange-500 text-slate-900" : "text-slate-400"
              }`
            }
          >
            {tab.label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

import { NavLink } from "react-router-dom";
import NavPill from "./NavPill";

const tabs = [
  { to: "/", label: "Главная", emoji: "🏠" },
  { to: "/create", label: "Создать", emoji: "✨" },
  { to: "/library", label: "Библиотека", emoji: "📚" },
  { to: "/profile", label: "Профиль", emoji: "🧸" }
];

export default function HeaderNav() {
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-full bg-white/70 p-2 shadow-float">
      {tabs.map((tab) => (
        <NavLink key={tab.to} to={tab.to}>
          {({ isActive }) => (
            <NavPill active={isActive}>
              <span>{tab.emoji}</span>
              {tab.label}
            </NavPill>
          )}
        </NavLink>
      ))}
    </div>
  );
}

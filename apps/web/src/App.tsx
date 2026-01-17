import { Route, Routes, NavLink, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import CreateWizard from "./pages/CreateWizard";
import Library from "./pages/Library";
import StoryDetail from "./pages/StoryDetail";
import PremiumSoon from "./pages/PremiumSoon";
import { useEffect, useState } from "react";
import { apiFetch } from "./api";

const tabs = [
  { to: "/", label: "Главная" },
  { to: "/create", label: "Создать" },
  { to: "/library", label: "Библиотека" }
];

export default function App() {
  const [authReady, setAuthReady] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function authenticate() {
      const telegram = (window as any).Telegram?.WebApp;
      const initData = telegram?.initData || "";
      if (!initData) {
        setAuthReady(true);
        return;
      }
      try {
        const response = await apiFetch<{ token: string }>("/api/auth/telegram", {
          method: "POST",
          body: JSON.stringify({ initData })
        });
        localStorage.setItem("kyperdy_token", response.token);
      } catch (error) {
        console.error(error);
      } finally {
        setAuthReady(true);
      }
    }
    authenticate();
  }, []);

  useEffect(() => {
    if (authReady) {
      navigate("/");
    }
  }, [authReady, navigate]);

  if (!authReady) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg">Подключаемся к Telegram...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      <header className="sticky top-0 z-10 bg-slate-900/90 backdrop-blur border-b border-slate-800">
        <div className="px-6 py-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-400">KyperdyAI</p>
            <h1 className="text-xl font-semibold">Сказочный генератор</h1>
          </div>
          <NavLink
            to="/premium"
            className="px-3 py-2 rounded-full bg-brand-500 hover:bg-brand-700 transition text-sm"
          >
            Premium
          </NavLink>
        </div>
      </header>

      <main className="px-6 pt-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<CreateWizard />} />
          <Route path="/library" element={<Library />} />
          <Route path="/story/:id" element={<StoryDetail />} />
          <Route path="/premium" element={<PremiumSoon />} />
        </Routes>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800">
        <div className="flex justify-around py-3 text-sm">
          {tabs.map((tab) => (
            <NavLink
              key={tab.to}
              to={tab.to}
              className={({ isActive }) =>
                `px-3 py-2 rounded-full ${
                  isActive ? "bg-brand-500" : "text-slate-400"
                }`
              }
            >
              {tab.label}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}

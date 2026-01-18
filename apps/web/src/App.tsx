import { Route, Routes, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import CreateWizard from "./pages/CreateWizard";
import Library from "./pages/Library";
import StoryDetail from "./pages/StoryDetail";
import PremiumSoon from "./pages/PremiumSoon";
import Profile from "./pages/Profile";
import { useEffect, useState } from "react";
import { apiFetch } from "./api";
import AppShell from "./components/AppShell";

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
    <AppShell>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<CreateWizard />} />
        <Route path="/library" element={<Library />} />
        <Route path="/story/:id" element={<StoryDetail />} />
        <Route path="/premium" element={<PremiumSoon />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </AppShell>
  );
}

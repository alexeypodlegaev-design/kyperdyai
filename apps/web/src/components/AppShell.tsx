import { ReactNode } from "react";
import CloudBackground from "./CloudBackground";
import HeaderNav from "./HeaderNav";

type AppShellProps = {
  children: ReactNode;
};

export default function AppShell({ children }: AppShellProps) {
  return (
    <div className="relative min-h-screen overflow-hidden text-slate-800">
      <CloudBackground />
      <header className="relative z-10 px-6 pt-6">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-400 to-pink-400 text-2xl text-white shadow-float">
              🎧
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-700">Купердай</p>
              <p className="text-xs text-slate-500">Сказки + озвучка</p>
            </div>
          </div>
          <HeaderNav />
        </div>
      </header>

      <main className="relative z-10 mx-auto w-full max-w-6xl px-6 pb-20 pt-8">{children}</main>
    </div>
  );
}

import { ReactNode } from "react";
import Card from "./Card";

type HeroProps = {
  title: string;
  subtitle: string;
  badge?: string;
  children?: ReactNode;
};

export default function Hero({ title, subtitle, badge, children }: HeroProps) {
  return (
    <Card className="bg-gradient-to-br from-white/90 to-sky-50">
      <div className="space-y-4">
        {badge && (
          <div className="inline-flex items-center gap-2 rounded-full bg-candy-50 px-4 py-2 text-xs font-semibold text-candy-500">
            {badge}
          </div>
        )}
        <h2 className="text-4xl font-bold text-slate-800 text-shadow-soft">{title}</h2>
        <p className="text-lg text-slate-600">{subtitle}</p>
        {children}
      </div>
    </Card>
  );
}

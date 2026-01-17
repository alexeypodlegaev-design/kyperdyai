import { ReactNode } from "react";
import Card from "./Card";

type PremiumBannerProps = {
  title: string;
  description: string;
  action?: ReactNode;
  badges?: string[];
};

export default function PremiumBanner({ title, description, action, badges = [] }: PremiumBannerProps) {
  return (
    <Card className="bg-gradient-to-r from-purple-200 via-pink-200 to-yellow-200">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-2xl font-semibold text-slate-800">{title}</h3>
          <p className="mt-2 text-sm text-slate-600">{description}</p>
          {badges.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {badges.map((badge) => (
                <span
                  key={badge}
                  className="rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-slate-600"
                >
                  {badge}
                </span>
              ))}
            </div>
          )}
        </div>
        {action}
      </div>
    </Card>
  );
}

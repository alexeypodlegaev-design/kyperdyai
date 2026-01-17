import { ReactNode } from "react";

type WizardLayoutProps = {
  title: string;
  children: ReactNode;
  badge?: string;
};

export default function WizardLayout({ title, badge, children }: WizardLayoutProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-3xl font-bold text-slate-800">{title}</h2>
        {badge && (
          <div className="rounded-full bg-white/80 px-4 py-2 text-sm font-semibold text-slate-600">
            {badge}
          </div>
        )}
      </div>
      {children}
    </div>
  );
}

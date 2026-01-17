import { ReactNode } from "react";
import Card from "./Card";

type PlayerCardProps = {
  title: string;
  meta: string;
  children: ReactNode;
};

export default function PlayerCard({ title, meta, children }: PlayerCardProps) {
  return (
    <Card>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">{title}</h2>
          <p className="mt-1 text-xs text-slate-500">{meta}</p>
        </div>
        <span className="rounded-full bg-sunny-100 px-3 py-1 text-xs text-slate-600">🎵</span>
      </div>
      <div className="mt-4">{children}</div>
    </Card>
  );
}

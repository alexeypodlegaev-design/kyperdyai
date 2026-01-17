import { ReactNode } from "react";

type SectionTitleProps = {
  children: ReactNode;
  rightSlot?: ReactNode;
};

export default function SectionTitle({ children, rightSlot }: SectionTitleProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <h3 className="text-2xl font-bold text-slate-800 text-shadow-soft">{children}</h3>
      {rightSlot}
    </div>
  );
}

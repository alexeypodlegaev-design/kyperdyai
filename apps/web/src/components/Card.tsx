import { ReactNode } from "react";

type CardProps = {
  children: ReactNode;
  className?: string;
};

export default function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={`rounded-4xl border border-white/80 bg-white/80 p-6 shadow-card backdrop-blur ${className}`}
    >
      {children}
    </div>
  );
}

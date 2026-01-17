import { ReactNode } from "react";

type PillButtonProps = {
  children: ReactNode;
  variant?: "primary" | "secondary";
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const variants = {
  primary:
    "bg-gradient-to-r from-pink-400 via-purple-400 to-sky-400 text-white shadow-float",
  secondary: "bg-white text-slate-700 shadow-float"
};

export default function PillButton({
  children,
  variant = "primary",
  className = "",
  ...props
}: PillButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition active:scale-95 ${
        variants[variant]
      } ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

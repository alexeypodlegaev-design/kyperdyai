import { ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "outline";

type ButtonProps = {
  children: ReactNode;
  variant?: ButtonVariant;
  fullWidth?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-gradient-to-r from-orange-400 via-pink-400 to-purple-400 text-white shadow-float hover:brightness-105",
  secondary: "bg-white text-slate-700 shadow-float hover:bg-white/90",
  ghost: "bg-transparent text-slate-600 hover:bg-white/60",
  outline: "border-2 border-white text-slate-700 bg-white/60 hover:bg-white/90"
};

export default function Button({
  children,
  variant = "primary",
  fullWidth = false,
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition active:scale-95 disabled:opacity-40 disabled:pointer-events-none ${
        fullWidth ? "w-full" : ""
      } ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

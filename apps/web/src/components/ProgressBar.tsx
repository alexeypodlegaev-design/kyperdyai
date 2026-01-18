type ProgressBarProps = {
  value: number;
};

export default function ProgressBar({ value }: ProgressBarProps) {
  return (
    <div className="h-3 w-full rounded-full bg-white/70">
      <div
        className="h-3 rounded-full bg-gradient-to-r from-orange-300 via-pink-300 to-purple-300 transition-all"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}

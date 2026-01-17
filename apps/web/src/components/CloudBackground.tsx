export default function CloudBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="cloud-float absolute -top-8 left-6 h-24 w-40 rounded-full bg-white/80 blur-sm" />
      <div className="cloud-float-slow absolute top-8 right-12 h-20 w-32 rounded-full bg-white/70" />
      <div className="cloud-float absolute top-24 left-1/2 h-28 w-44 -translate-x-1/2 rounded-full bg-white/60" />
      <div className="cloud-float-slow absolute top-44 left-20 h-16 w-28 rounded-full bg-white/60" />
      <div className="cloud-float absolute bottom-24 left-8 h-16 w-28 rounded-full bg-white/50" />
      <div className="cloud-float-slow absolute bottom-8 right-12 h-20 w-36 rounded-full bg-white/60" />
      <div className="sparkle absolute top-20 left-14 text-yellow-400 text-xl">⭐</div>
      <div className="sparkle absolute top-16 right-32 text-pink-400 text-lg">✨</div>
      <div className="sparkle absolute top-52 right-16 text-yellow-300 text-2xl">☀️</div>
      <div className="sparkle absolute top-60 left-1/3 text-yellow-300 text-lg">✨</div>
    </div>
  );
}

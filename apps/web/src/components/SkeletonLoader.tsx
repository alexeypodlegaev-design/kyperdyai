type SkeletonLoaderProps = {
  className?: string;
};

export default function SkeletonLoader({ className = "" }: SkeletonLoaderProps) {
  return <div className={`animate-pulse rounded-4xl bg-white/70 ${className}`} />;
}

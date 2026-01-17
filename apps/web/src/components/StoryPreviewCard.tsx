import Card from "./Card";
import Button from "./Button";

export type StoryPreview = {
  id: string;
  title: string;
  narrator: string;
  minutes: string;
  status: string;
  timeAgo?: string;
};

type StoryPreviewCardProps = {
  story: StoryPreview;
  onPlay?: () => void;
};

export default function StoryPreviewCard({ story, onPlay }: StoryPreviewCardProps) {
  return (
    <Card className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-sunny-300 to-candy-200 text-2xl shadow-float">
          {story.narrator === "Клаус" ? "🐱" : "🐶"}
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-800">{story.title}</p>
          <p className="mt-1 text-xs text-slate-500">
            {story.narrator} • {story.minutes} мин{story.timeAgo ? ` • ${story.timeAgo}` : ""}
          </p>
          <span className="mt-2 inline-flex rounded-full bg-sunny-100 px-2 py-1 text-[10px] uppercase tracking-wide text-slate-600">
            {story.status}
          </span>
        </div>
      </div>
      <Button variant="secondary" onClick={onPlay}>
        ▶
      </Button>
    </Card>
  );
}

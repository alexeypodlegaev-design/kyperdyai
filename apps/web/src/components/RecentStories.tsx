import { ReactNode } from "react";

type RecentStoriesProps = {
  children: ReactNode;
};

export default function RecentStories({ children }: RecentStoriesProps) {
  return <div className="space-y-3">{children}</div>;
}

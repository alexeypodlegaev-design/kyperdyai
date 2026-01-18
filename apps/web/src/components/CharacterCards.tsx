import { ReactNode } from "react";

type CharacterCardsProps = {
  children: ReactNode;
};

export default function CharacterCards({ children }: CharacterCardsProps) {
  return <div className="grid gap-4 md:grid-cols-2">{children}</div>;
}

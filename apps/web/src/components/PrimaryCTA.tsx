import { ReactNode } from "react";

type PrimaryCTAProps = {
  children: ReactNode;
};

export default function PrimaryCTA({ children }: PrimaryCTAProps) {
  return <div className="flex flex-col gap-3 sm:flex-row">{children}</div>;
}

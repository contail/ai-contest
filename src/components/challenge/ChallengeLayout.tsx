import type { ReactNode } from "react";

type ChallengeLayoutProps = {
  left: ReactNode;
  right: ReactNode;
};

export default function ChallengeLayout({
  left,
  right,
}: ChallengeLayoutProps) {
  return (
    <div className="flex flex-col gap-6 md:h-full md:flex-row">
      <div className="md:h-full md:w-1/2">{left}</div>
      <div className="md:h-full md:w-1/2">{right}</div>
    </div>
  );
}

import { notFound } from "next/navigation";
import ChallengeIntroPanel from "@/components/challenge/ChallengeIntroPanel";
import ChallengeLayout from "@/components/challenge/ChallengeLayout";
import ContestResponsePanel from "@/components/challenge/ContestResponsePanel";
import Header from "@/components/site/Header";
import { getChallengeDetailOrMock } from "@/lib/challengeQueries";

type ChallengePageProps = {
  params: Promise<{ challengeId?: string }>;
};

export default async function ChallengePage({ params }: ChallengePageProps) {
  const resolvedParams = await params;
  const challengeId = resolvedParams?.challengeId;
  if (!challengeId) {
    notFound();
  }

  const challenge = await getChallengeDetailOrMock(challengeId);
  if (!challenge) {
    notFound();
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 pb-16 pt-8 md:h-[calc(100vh-64px)] md:overflow-hidden">
        <ChallengeLayout
          left={
            <div className="md:h-full md:overflow-y-auto md:pr-2">
              <ChallengeIntroPanel challenge={challenge} />
            </div>
          }
          right={
            <div className="md:h-full md:overflow-y-auto md:pl-2">
              <ContestResponsePanel challenge={challenge} />
            </div>
          }
        />
      </main>
    </div>
  );
}

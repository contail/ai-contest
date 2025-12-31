import { notFound } from "next/navigation";
import ChallengePageContent from "@/components/challenge/ChallengePageContent";
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
        <ChallengePageContent challenge={challenge} />
      </main>
    </div>
  );
}

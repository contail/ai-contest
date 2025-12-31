import ChallengeCard from "@/components/challenge/ChallengeCard";
import Header from "@/components/site/Header";
import { getChallenges } from "@/lib/challengeQueries";

// DB에서 실시간으로 가져오도록 동적 렌더링 강제
export const dynamic = "force-dynamic";

export default async function Home() {
  const challenges = await getChallenges();

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Header />
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-12 px-6 pb-16 pt-10">
        {/* 헤더 섹션 */}
        <section className="relative overflow-hidden rounded-[var(--radius-lg)] bg-[var(--gray-900)] px-8 py-12">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(132,204,22,0.2),transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(132,204,22,0.1),transparent_50%)]" />
          <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-[var(--lime-400)] via-[var(--lime-500)] to-transparent" />

          <div className="relative space-y-4">
            <div className="inline-flex items-center gap-3 rounded-full bg-[var(--gray-800)] px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-[var(--lime-400)]">
              PFCT AI Contest Lab
            </div>
            <h1 className="text-2xl font-bold text-white md:text-3xl">
              AI 챌린지에 도전하세요
            </h1>
            <p className="max-w-md text-sm leading-relaxed text-[var(--gray-400)]">
              데이터 분석, 로그 검증 등 다양한 AI 설계형 콘테스트에
              참여하고 실력을 증명하세요.
            </p>
          </div>
        </section>

        {/* 챌린지 목록 */}
        <section className="space-y-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--lime-600)]">
              Active Challenges
            </p>
            <h2 className="mt-2 text-2xl font-bold text-[var(--gray-900)]">
              진행 중인 챌린지
            </h2>
            <p className="mt-1 text-sm text-[var(--gray-500)]">
              각 챌린지의 맥락과 참고 데이터를 확인한 뒤 응시를 진행하세요.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {challenges.map((challenge) => (
              <ChallengeCard key={challenge.id} challenge={challenge} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

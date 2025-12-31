import ChallengeList from "@/components/challenge/ChallengeList";
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
        <section className="relative overflow-hidden rounded-[var(--radius-lg)] border border-[var(--lime-200)] bg-gradient-to-r from-[var(--lime-50)] to-[var(--card)] p-8">
          {/* 왼쪽 악센트 바 */}
          <div className="absolute left-0 top-0 h-full w-1.5 bg-[var(--lime-500)]" />
          
          <div className="space-y-3 pl-4">
            <span className="inline-block rounded-md bg-[var(--lime-500)] px-3 py-1 text-xs font-semibold text-white">
              AI Challenge Hub
            </span>
            <h1 className="text-2xl font-bold text-[var(--gray-900)] md:text-3xl">
              AI 챌린지에 도전하세요
            </h1>
            <p className="max-w-lg text-sm leading-relaxed text-[var(--gray-600)]">
              데이터 분석, 로그 검증 등 다양한 AI 설계형 콘테스트에 참여하고 실력을 증명하세요.
            </p>
          </div>
        </section>

        {/* 챌린지 목록 */}
        <section className="space-y-6">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-xl font-bold text-[var(--gray-900)]">
                진행 중인 챌린지
              </h2>
              <p className="mt-1 text-sm text-[var(--gray-500)]">
                총 {challenges.length}개의 챌린지가 준비되어 있습니다
              </p>
            </div>
          </div>
          <ChallengeList challenges={challenges} />
        </section>
      </main>
    </div>
  );
}

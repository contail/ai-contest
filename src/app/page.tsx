import ChallengeCard from "@/components/challenge/ChallengeCard";
import Header from "@/components/site/Header";
import { getChallenges } from "@/lib/challengeQueries";

export default async function Home() {
  const challenges = await getChallenges();

  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 pb-16 pt-10">
        <section className="relative overflow-hidden border border-black/5 bg-[var(--card)] px-8 py-10 shadow-[var(--surface-shadow)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_30%,rgba(31,122,74,0.16),transparent_55%),radial-gradient(circle_at_85%_0%,rgba(15,23,42,0.1),transparent_45%)]" />
          <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-3 border border-slate-200 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
                PFCT AI Contest Lab
                <span className="h-[2px] w-10 bg-[var(--brand)]" />
              </div>
              <div className="max-w-sm text-xs text-slate-500">
                AI 설계형 콘테스트를 위한 내부 전용 평가 환경
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
              Contest Index
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900">
              진행 중인 콘테스트
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              각 콘테스트의 맥락과 참고 데이터를 확인한 뒤 응시를
              진행하세요.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {challenges.map((challenge) => (
              <ChallengeCard key={challenge.id} challenge={challenge} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

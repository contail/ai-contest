import Leaderboard from "@/components/leaderboard/Leaderboard";
import Header from "@/components/site/Header";

export const dynamic = "force-dynamic";

export default function LeaderboardPage() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Header />
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-12 px-6 pb-16 pt-10">
        {/* 헤더 섹션 */}
        <section className="relative overflow-hidden rounded-[var(--radius-lg)] border border-[var(--lime-200)] bg-gradient-to-r from-[var(--lime-50)] to-[var(--card)] p-8">
          <div className="absolute left-0 top-0 h-full w-1.5 bg-[var(--lime-500)]" />
          <div className="space-y-3 pl-4">
            <span className="inline-block rounded-md bg-[var(--lime-500)] px-3 py-1 text-xs font-semibold text-white">
              Leaderboard
            </span>
            <h1 className="text-2xl font-bold text-[var(--gray-900)] md:text-3xl">
              리더보드
            </h1>
            <p className="max-w-lg text-sm leading-relaxed text-[var(--gray-600)]">
              AI Challenge Hub의 최고 점수 기록을 확인하세요.
            </p>
          </div>
        </section>

        {/* 전체 리더보드 */}
        <section>
          <Leaderboard limit={100} />
        </section>
      </main>
    </div>
  );
}


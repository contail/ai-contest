import Link from "next/link";
import type { ChallengeCardData } from "@/lib/challengeQueries";

type CompletedInfo = {
  score: number;
  totalQuestions: number;
};

type ChallengeCardProps = {
  challenge: ChallengeCardData;
  completed?: CompletedInfo;
};

export default function ChallengeCard({ challenge, completed }: ChallengeCardProps) {
  const isCompleted = !!completed;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[var(--radius-lg)] bg-[var(--card)] shadow-[var(--shadow-sm)] transition-all duration-300 hover:shadow-[var(--shadow-xl)] hover:-translate-y-1">
      {/* 카드 상단 - 다크 영역 */}
      <div className="relative h-44 overflow-hidden bg-[var(--gray-900)]">
        {/* 그라데이션 오버레이 */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(132,204,22,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(132,204,22,0.1),transparent_50%)]" />

        {/* 좌상단 카테고리 배지 */}
        <div className="absolute left-3 top-3">
          <span className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-bold ${
            isCompleted 
              ? "bg-[var(--gray-600)] text-white" 
              : "bg-[var(--lime-500)] text-[var(--gray-900)]"
          }`}>
            {isCompleted ? "완료" : (challenge.subtitle.length > 15
              ? challenge.subtitle.slice(0, 15)
              : challenge.subtitle)}
          </span>
        </div>

        {/* 우상단 배지 */}
        <div className="absolute right-3 top-3">
          {isCompleted ? (
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--lime-500)] text-[10px] font-bold text-[var(--gray-900)]">
              ✓
            </span>
          ) : challenge.badge ? (
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--red-700)] text-[10px] font-bold text-white">
              {challenge.badge}
            </span>
          ) : null}
        </div>

        {/* 중앙 - 완료 시 트로피와 점수, 미완료 시 아이콘 */}
        <div className="absolute inset-0 flex items-center justify-center">
          {isCompleted ? (
            <div className="text-center">
              <svg
                className="mx-auto h-12 w-12 text-[var(--gray-500)]"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M5 3h14c.55 0 1 .45 1 1v2c0 2.21-1.79 4-4 4h-.37c-.67 1.65-2.13 2.87-3.88 3.24V16H14c1.1 0 2 .9 2 2v2H8v-2c0-1.1.9-2 2-2h2.25v-2.76C10.54 12.87 9.08 11.65 8.41 10H8c-2.21 0-4-1.79-4-4V4c0-.55.45-1 1-1z" />
              </svg>
              <p className="mt-2 text-2xl font-black text-white">
                {completed.score}/{completed.totalQuestions}
              </p>
              <p className="text-xs text-[var(--gray-400)]">
                {Math.round((completed.score / completed.totalQuestions) * 100)}% 정답
              </p>
            </div>
          ) : (
            <div className="relative">
              <div className="h-16 w-16 rounded-2xl bg-[var(--gray-800)] shadow-lg" />
              <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-[var(--lime-400)]" />
            </div>
          )}
        </div>

        {/* 하단 악센트 라인 */}
        <div className={`absolute bottom-0 left-0 h-1 w-full ${
          isCompleted 
            ? "bg-[var(--gray-600)]" 
            : "bg-gradient-to-r from-[var(--lime-400)] via-[var(--lime-500)] to-transparent"
        }`} />
      </div>

      {/* 카드 하단 - 콘텐츠 영역 */}
      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="text-lg font-bold text-[var(--gray-900)] group-hover:text-[var(--brand-strong)] transition-colors">
          {challenge.title}
        </h3>

        {/* 태그 */}
        <div className="flex flex-wrap gap-1.5">
          {challenge.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-[var(--border)] bg-[var(--gray-50)] px-2.5 py-0.5 text-[11px] font-medium text-[var(--gray-500)]"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* CTA 버튼 */}
        <div className="mt-auto pt-3">
          {isCompleted ? (
            <div className="flex w-full items-center justify-center gap-2 rounded-[var(--radius-sm)] border-2 border-[var(--gray-200)] bg-[var(--gray-100)] py-3 text-sm font-semibold text-[var(--gray-500)]">
              챌린지 완료
            </div>
          ) : (
            <Link
              href={`/challenge/${challenge.id}`}
              className="flex w-full items-center justify-center gap-2 rounded-[var(--radius-sm)] border-2 border-[var(--gray-200)] bg-white py-3 text-sm font-semibold text-[var(--gray-700)] transition-all hover:border-[var(--brand)] hover:text-[var(--brand)]"
            >
              챌린지 시작
              <svg
                className="h-4 w-4 transition-transform group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}

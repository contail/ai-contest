import Link from "next/link";
import type { ChallengeCardData } from "@/lib/challengeQueries";

type ChallengeCardProps = {
  challenge: ChallengeCardData;
};

export default function ChallengeCard({ challenge }: ChallengeCardProps) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[var(--radius-lg)] bg-[var(--card)] shadow-[var(--shadow-sm)] transition-all duration-300 hover:shadow-[var(--shadow-xl)] hover:-translate-y-1">
      {/* 카드 상단 - 다크 영역 */}
      <div className="relative h-44 overflow-hidden bg-[var(--gray-900)]">
        {/* 그라데이션 오버레이 */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(132,204,22,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(132,204,22,0.1),transparent_50%)]" />

        {/* 좌상단 카테고리 배지 */}
        <div className="absolute left-3 top-3">
          <span className="inline-flex items-center rounded-full bg-[var(--lime-500)] px-3 py-1 text-[11px] font-bold text-[var(--gray-900)]">
            {challenge.subtitle.length > 15
              ? challenge.subtitle.slice(0, 15)
              : challenge.subtitle}
          </span>
        </div>

        {/* 우상단 NEW 배지 */}
        {challenge.badge ? (
          <div className="absolute right-3 top-3">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--red-700)] text-[10px] font-bold text-white">
              {challenge.badge}
            </span>
          </div>
        ) : null}

        {/* 중앙 아이콘/심볼 영역 */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            <div className="h-16 w-16 rounded-2xl bg-[var(--gray-800)] shadow-lg" />
            <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-[var(--lime-400)]" />
          </div>
        </div>

        {/* 하단 악센트 라인 */}
        <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-[var(--lime-400)] via-[var(--lime-500)] to-transparent" />
      </div>

      {/* 카드 하단 - 콘텐츠 영역 */}
      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="text-lg font-bold text-[var(--gray-900)] group-hover:text-[var(--brand-strong)] transition-colors">
          {challenge.title}
        </h3>
        <p className="text-sm leading-relaxed text-[var(--gray-600)] line-clamp-2">
          {challenge.summary}
        </p>

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
        </div>
      </div>
    </article>
  );
}

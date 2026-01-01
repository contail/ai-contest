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

const getDifficultyInfo = (difficulty: number) => {
  switch (difficulty) {
    case 1:
      return { label: "Lv.1 입문", color: "bg-green-500", textColor: "text-green-500" };
    case 2:
      return { label: "Lv.2 중급", color: "bg-yellow-500", textColor: "text-yellow-500" };
    case 3:
      return { label: "Lv.3 고급", color: "bg-orange-500", textColor: "text-orange-500" };
    case 4:
      return { label: "Lv.4 전문가", color: "bg-red-500", textColor: "text-red-500" };
    case 5:
      return { label: "Lv.5 하드코어", color: "bg-purple-600", textColor: "text-purple-600" };
    case 6:
      return { label: "Lv.6 심연", color: "bg-black", textColor: "text-black" };
    default:
      return { label: "Lv.1 입문", color: "bg-green-500", textColor: "text-green-500" };
  }
};

export default function ChallengeCard({ challenge, completed }: ChallengeCardProps) {
  const isCompleted = !!completed;
  const difficultyInfo = getDifficultyInfo(challenge.difficulty);

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

        {/* 우상단 배지 - 난이도 또는 완료 표시 */}
        <div className="absolute right-3 top-3">
          {isCompleted ? (
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--lime-500)] text-[10px] font-bold text-[var(--gray-900)]">
              ✓
            </span>
          ) : (
            <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-bold text-white ${difficultyInfo.color}`}>
              {difficultyInfo.label}
            </span>
          )}
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
                {completed.score}점
              </p>
              <p className="text-xs text-[var(--gray-400)]">
                총 {completed.totalQuestions}점 중
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
        {/* 태그를 제목 위로 이동 */}
        <div className="flex flex-wrap gap-1.5">
          {challenge.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-[11px] font-medium text-[var(--gray-400)]"
            >
              #{tag}
            </span>
          ))}
        </div>

        <h3 className="text-lg font-bold text-[var(--gray-900)] group-hover:text-[var(--brand-strong)] transition-colors">
          {challenge.title}
        </h3>

        {/* CTA 버튼 - 워딩 변경 */}
        <div className="mt-auto pt-3">
          {isCompleted ? (
            <div className="flex w-full items-center justify-center gap-2 rounded-[var(--radius-sm)] border-2 border-[var(--gray-200)] bg-[var(--gray-100)] py-3 text-sm font-semibold text-[var(--gray-500)]">
              응시 완료
            </div>
          ) : (
            <Link
              href={`/challenge/${challenge.id}`}
              className="flex w-full items-center justify-center gap-2 rounded-[var(--radius-sm)] border-2 border-[var(--gray-200)] bg-white py-3 text-sm font-semibold text-[var(--gray-700)] transition-all hover:border-[var(--brand)] hover:text-[var(--brand)]"
            >
              응시하기
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}

"use client";

type ResultScreenProps = {
  score: number;
  totalQuestions: number;
  challengeTitle: string;
};

export default function ResultScreen({
  score,
  totalQuestions,
  challengeTitle,
}: ResultScreenProps) {
  const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;

  // 등급 결정
  const getGrade = () => {
    if (percentage >= 100) return { label: "PERFECT", color: "text-yellow-400" };
    if (percentage >= 80) return { label: "EXCELLENT", color: "text-[var(--lime-400)]" };
    if (percentage >= 60) return { label: "GOOD", color: "text-blue-400" };
    if (percentage >= 40) return { label: "FAIR", color: "text-orange-400" };
    return { label: "TRY AGAIN", color: "text-gray-400" };
  };

  const grade = getGrade();

  return (
    <div className="flex flex-col items-center gap-6 rounded-[var(--radius-lg)] bg-[var(--gray-900)] p-8 text-center">
      {/* 트로피 영역 */}
      <div className="relative">
        <svg
          className="h-32 w-32 text-[var(--gray-600)]"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M5 3h14c.55 0 1 .45 1 1v2c0 2.21-1.79 4-4 4h-.37c-.67 1.65-2.13 2.87-3.88 3.24V16H14c1.1 0 2 .9 2 2v2H8v-2c0-1.1.9-2 2-2h2.25v-2.76C10.54 12.87 9.08 11.65 8.41 10H8c-2.21 0-4-1.79-4-4V4c0-.55.45-1 1-1zm0 2v1c0 1.1.9 2 2 2h.54c.09-.33.2-.65.34-.96.31-.67.72-1.29 1.22-1.84L9.06 5H5zm14 0h-4.06c.04.06.08.12.12.18.5.55.91 1.17 1.22 1.84.14.31.25.63.34.96H17c1.1 0 2-.9 2-2V5z" />
        </svg>
        {/* 점수 오버레이 */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-black text-white">{score}점</span>
        </div>
      </div>

      {/* AI TOP 100 배지 */}
      <div className="rounded-md bg-[var(--gray-800)] px-4 py-2">
        <span className="text-sm font-bold tracking-wider text-[var(--lime-400)]">
          AI CHALLENGE
        </span>
      </div>

      {/* 등급 */}
      <div className={`text-2xl font-black ${grade.color}`}>
        {grade.label}
      </div>

      {/* 상세 정보 */}
      <div className="space-y-2 text-sm text-[var(--gray-400)]">
        <p>{challengeTitle}</p>
        <p>
          {totalQuestions}문제 중 <span className="text-white font-bold">{score}개</span> 정답
        </p>
        <p className="text-xs">정답률 {percentage}%</p>
      </div>

      {/* 완료 표시 */}
      <div className="mt-4 w-full rounded-[var(--radius-sm)] bg-[var(--gray-800)] py-4 text-center">
        <span className="text-sm font-semibold text-[var(--gray-500)]">
          챌린지 완료
        </span>
      </div>
    </div>
  );
}


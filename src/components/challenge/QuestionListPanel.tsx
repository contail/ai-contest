import type { ChallengeDetailData } from "@/lib/challengeQueries";
import QuestionCard from "@/components/challenge/QuestionCard";
import SubmitBar from "@/components/challenge/SubmitBar";

type QuestionListPanelProps = {
  challenge: ChallengeDetailData;
  answers: Record<string, string | string[] | null>;
  onAnswerChange: (questionId: string, value: string | string[] | null) => void;
  errors?: Record<string, string>;
  statusText?: string;
  onSubmit?: () => void;
  inputsDisabled?: boolean;
  submitDisabled?: boolean;
};

export default function QuestionListPanel({
  challenge,
  answers,
  onAnswerChange,
  errors,
  statusText,
  onSubmit,
  inputsDisabled,
  submitDisabled,
}: QuestionListPanelProps) {
  return (
    <section className="flex h-full flex-col gap-4">
      <div className="border border-black/5 bg-[var(--card)] px-4 py-4 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          질문 항목
        </p>
        <p className="mt-2 text-sm text-slate-600">
          각 질문 항목에 대해 근거 중심으로 응답을 작성하세요.
        </p>
      </div>
      <div className="flex-1 space-y-4">
        {challenge.questions.map((question) => (
          <QuestionCard
            key={question.id}
            question={question}
            value={answers[question.id] ?? null}
            onChange={(value) => onAnswerChange(question.id, value)}
            errorText={errors?.[question.id]}
            disabled={inputsDisabled}
          />
        ))}
      </div>
      <SubmitBar
        disabled={submitDisabled}
        statusText={statusText}
        onSubmit={onSubmit}
      />
    </section>
  );
}

import type { ChallengeDetailData } from "@/lib/challengeQueries";
import QuestionCard from "@/components/challenge/QuestionCard";
import SubmitBar from "@/components/challenge/SubmitBar";

type QuestionListPanelProps = {
  challenge: ChallengeDetailData;
  answers: Record<string, string | string[] | null>;
  onAnswerChange: (questionId: string, value: string | string[] | null) => void;
  errors?: Record<string, string>;
  onSubmit?: () => void;
  inputsDisabled?: boolean;
  submitDisabled?: boolean;
};

export default function QuestionListPanel({
  challenge,
  answers,
  onAnswerChange,
  errors,
  onSubmit,
  inputsDisabled,
  submitDisabled,
}: QuestionListPanelProps) {
  return (
    <section className="flex h-full flex-col gap-4">
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
        onSubmit={onSubmit}
      />
    </section>
  );
}

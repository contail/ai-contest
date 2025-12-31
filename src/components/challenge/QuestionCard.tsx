import type { ChallengeDetailData } from "@/lib/challengeQueries";
import AnswerInput from "@/components/challenge/AnswerInput";

type QuestionCardProps = {
  question: ChallengeDetailData["questions"][number];
  value: string | string[] | null;
  onChange: (value: string | string[] | null) => void;
  errorText?: string;
  disabled?: boolean;
};

export default function QuestionCard({
  question,
  value,
  onChange,
  errorText,
  disabled,
}: QuestionCardProps) {
  return (
    <article className="rounded-[var(--radius-lg)] bg-[var(--card)] p-6 shadow-[var(--shadow-sm)]">
      <div className="flex items-start gap-4">
        <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-[var(--lime-100)] text-sm font-bold text-[var(--lime-600)]">
          {question.order}
        </div>
        <div className="flex-1">
          <h3 className="text-[15px] font-medium leading-[1.7] text-[var(--gray-900)]">
            {question.prompt}
          </h3>
          <AnswerInput
            question={question}
            value={value}
            onChange={onChange}
            disabled={disabled}
          />
          {errorText ? (
            <p className="mt-3 text-sm font-medium text-red-500">{errorText}</p>
          ) : null}
        </div>
      </div>
    </article>
  );
}

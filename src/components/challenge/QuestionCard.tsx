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
    <article className="border border-black/5 bg-[var(--card)] p-5 shadow-sm transition hover:shadow-[0_18px_36px_rgba(15,23,42,0.08)]">
      <div className="flex items-start gap-4">
        <div className="text-sm font-semibold text-[var(--brand)]">
          Q{question.order}.
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-slate-900">
            {question.prompt}
          </h3>
          {question.required ? (
            <p className="mt-1 text-xs font-semibold text-rose-500">
              필수 응답
            </p>
          ) : null}
          <AnswerInput
            question={question}
            value={value}
            onChange={onChange}
            disabled={disabled}
          />
          {errorText ? (
            <p className="mt-2 text-xs text-rose-500">{errorText}</p>
          ) : null}
        </div>
      </div>
    </article>
  );
}

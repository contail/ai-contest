import type { ChallengeDetailData } from "@/lib/challengeQueries";

type AnswerValue = string | string[] | null;

type AnswerInputProps = {
  question: ChallengeDetailData["questions"][number];
  value: AnswerValue;
  onChange: (value: AnswerValue) => void;
  disabled?: boolean;
};

const normalizeArrayValue = (value: AnswerValue) =>
  Array.isArray(value) ? value : [];

const normalizeStringValue = (value: AnswerValue) =>
  typeof value === "string" ? value : "";

export default function AnswerInput({
  question,
  value,
  onChange,
  disabled,
}: AnswerInputProps) {
  const baseInputClass =
    "mt-3 w-full rounded-[var(--radius-sm)] border border-[var(--border-strong)] bg-white px-4 py-3 text-sm text-[var(--gray-900)] placeholder:text-[var(--gray-400)] focus:border-[var(--brand)] focus:outline-none focus:ring-2 focus:ring-[var(--lime-100)] transition-colors";

  const optionClass = (isSelected: boolean) =>
    `flex cursor-pointer items-center gap-3 rounded-[var(--radius-sm)] border px-4 py-3 text-sm transition-all ${
      isSelected
        ? "border-[var(--brand)] bg-[var(--lime-50)] text-[var(--gray-900)]"
        : "border-[var(--border)] bg-[var(--gray-25)] text-[var(--gray-700)] hover:border-[var(--gray-300)]"
    }`;

  switch (question.type) {
    case "single":
    case "SINGLE":
      return (
        <div className="mt-3 space-y-2">
          {question.options?.map((option) => (
            <label key={option} className={optionClass(value === option)}>
              <input
                type="radio"
                name={question.id}
                disabled={disabled}
                checked={value === option}
                onChange={() => onChange(option)}
                className="h-4 w-4 accent-[var(--brand)]"
              />
              {option}
            </label>
          ))}
        </div>
      );
    case "multi":
    case "MULTI":
      return (
        <div className="mt-3 space-y-2">
          {question.options?.map((option) => {
            const selected = normalizeArrayValue(value);
            const isChecked = selected.includes(option);
            return (
              <label key={option} className={optionClass(isChecked)}>
                <input
                  type="checkbox"
                  name={`${question.id}-${option}`}
                  disabled={disabled}
                  checked={isChecked}
                  onChange={() => {
                    if (isChecked) {
                      onChange(selected.filter((item) => item !== option));
                    } else {
                      onChange([...selected, option]);
                    }
                  }}
                  className="h-4 w-4 accent-[var(--brand)]"
                />
                {option}
              </label>
            );
          })}
        </div>
      );
    case "url":
    case "URL":
      return (
        <div className="mt-3">
          <input
            type="url"
            placeholder={question.helperText ?? "https://"}
            className={baseInputClass}
            disabled={disabled}
            value={normalizeStringValue(value)}
            onChange={(event) => onChange(event.target.value)}
          />
        </div>
      );
    case "multi-url":
    case "MULTI_URL":
      return (
        <div className="mt-3">
          <textarea
            rows={4}
            placeholder={question.helperText ?? "URL을 입력하세요."}
            className={baseInputClass}
            disabled={disabled}
            value={normalizeStringValue(value)}
            onChange={(event) => onChange(event.target.value)}
          />
        </div>
      );
    case "short":
    case "SHORT":
    default:
      return (
        <div className="mt-3">
          <input
            type="text"
            placeholder="응답을 입력하세요."
            className={baseInputClass}
            disabled={disabled}
            value={normalizeStringValue(value)}
            onChange={(event) => onChange(event.target.value)}
          />
        </div>
      );
  }
}

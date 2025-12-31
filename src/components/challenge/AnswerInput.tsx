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
  const baseClass =
    "mt-3 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm focus:border-[var(--brand)] focus:outline-none focus:ring-1 focus:ring-[var(--brand)]/30";

  switch (question.type) {
    case "single":
    case "SINGLE":
      return (
        <div className="mt-3 space-y-2">
          {question.options?.map((option) => (
            <label
              key={option}
              className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm text-slate-700"
            >
              <input
                type="radio"
                name={question.id}
                disabled={disabled}
                checked={value === option}
                onChange={() => onChange(option)}
                className="h-4 w-4 accent-slate-900"
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
              <label
                key={option}
                className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm text-slate-700"
              >
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
                  className="h-4 w-4 accent-slate-900"
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
            className={baseClass}
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
            className={baseClass}
            disabled={disabled}
            value={normalizeStringValue(value)}
            onChange={(event) => onChange(event.target.value)}
          />
          <button
            type="button"
            className="mt-2 inline-flex items-center justify-center rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600"
            onClick={() =>
              onChange(
                normalizeStringValue(value)
                  ? `${normalizeStringValue(value)}\n`
                  : ""
              )
            }
          >
            URL 추가
          </button>
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
            className={baseClass}
            disabled={disabled}
            value={normalizeStringValue(value)}
            onChange={(event) => onChange(event.target.value)}
          />
        </div>
      );
  }
}

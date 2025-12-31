type SubmitBarProps = {
  disabled?: boolean;
  statusText?: string;
  onSubmit?: () => void;
};

export default function SubmitBar({
  disabled,
  statusText,
  onSubmit,
}: SubmitBarProps) {
  return (
    <div className="sticky bottom-0 mt-6 border border-slate-200 bg-white px-4 py-4 shadow-[0_-12px_28px_rgba(15,23,42,0.12)]">
      <div className="flex items-center justify-between gap-3">
        <p className="flex items-center gap-2 text-xs text-slate-500">
          <span className="h-2 w-2 rounded-full bg-[var(--brand)]" />
          {statusText ?? "자동 저장됨 · 최종 제출 후 수정 불가"}
        </p>
        <button
          type="button"
          disabled={disabled}
          onClick={onSubmit}
          className="inline-flex items-center justify-center gap-2 bg-[var(--brand)] px-6 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          최종 제출
        </button>
      </div>
    </div>
  );
}

type SubmitBarProps = {
  disabled?: boolean;
  onSubmit?: () => void;
};

export default function SubmitBar({
  disabled,
  onSubmit,
}: SubmitBarProps) {
  return (
    <div className="sticky bottom-0 mt-4 pb-2">
      <button
        type="button"
        disabled={disabled}
        onClick={onSubmit}
        className={`flex w-full items-center justify-center gap-2 rounded-[var(--radius-md)] px-6 py-4 text-base font-semibold transition-all duration-200 ${
          disabled
            ? "cursor-not-allowed bg-[var(--gray-100)] text-[var(--gray-400)]"
            : "bg-[var(--brand)] text-white shadow-[var(--shadow-md)] hover:bg-[var(--brand-dark)] active:scale-[0.98]"
        }`}
      >
        제출하기
      </button>
    </div>
  );
}

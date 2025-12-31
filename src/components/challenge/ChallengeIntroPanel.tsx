import type { ChallengeDetailData } from "@/lib/challengeQueries";

type ChallengeIntroPanelProps = {
  challenge: ChallengeDetailData;
};

export default function ChallengeIntroPanel({
  challenge,
}: ChallengeIntroPanelProps) {
  const hasInternalDataset = challenge.datasetCount > 0;
  const datasetHref =
    challenge.datasetDownloadUrl ??
    (hasInternalDataset ? `/api/challenges/${challenge.id}/dataset` : null);
  const isInternalDownload = !challenge.datasetDownloadUrl && hasInternalDataset;

  return (
    <section className="flex flex-col gap-6 border border-black/5 bg-[var(--card)] p-6 shadow-[var(--surface-shadow)]">
      <header className="space-y-2 border-b border-slate-200 pb-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-400">
          {challenge.subtitle}
        </p>
        <h1 className="text-2xl font-semibold text-slate-900">
          {challenge.title}
        </h1>
      </header>

      <div className="space-y-3 border-b border-slate-200 pb-5">
        <h2 className="border-l-2 border-[var(--brand)] pl-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          콘테스트 개요
        </h2>
        <p className="text-sm leading-relaxed text-slate-700">
          {challenge.description}
        </p>
      </div>

      <div className="space-y-2 border-b border-slate-200 pb-5">
        <h2 className="border-l-2 border-[var(--brand)] pl-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          분석 시 참고 사항
        </h2>
        <p className="text-sm leading-relaxed text-slate-600">
          {challenge.cautionText}
        </p>
      </div>
      {challenge.scoringSummary || challenge.scoringItems?.length ? (
        <div className="space-y-2 border-b border-slate-200 pb-5">
          <h2 className="border-l-2 border-[var(--brand)] pl-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            배점 및 채점 기준
          </h2>
          {challenge.scoringSummary ? (
            <p className="text-sm font-semibold text-slate-700">
              {challenge.scoringSummary}
            </p>
          ) : null}
          {challenge.scoringItems?.length ? (
            <ul className="list-disc space-y-1 pl-5 text-sm leading-relaxed text-slate-600">
              {challenge.scoringItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}

      <div className="space-y-3">
        <h2 className="border-l-2 border-[var(--brand)] pl-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          참고 데이터
        </h2>
        {datasetHref ? (
          <a
            className="inline-flex items-center gap-2 border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-[var(--brand)]"
            href={datasetHref}
            download={isInternalDownload ? challenge.datasetFileName : undefined}
          >
            {challenge.datasetLabel}
            <span aria-hidden>↓</span>
          </a>
        ) : (
          <div className="inline-flex items-center gap-2 border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-400">
            {challenge.datasetLabel}
          </div>
        )}
        <div className="border border-dashed border-slate-200 bg-slate-50 px-4 py-3">
          <p className="text-xs font-semibold text-slate-700">
            {challenge.datasetFileName}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            {challenge.datasetDescription}
          </p>
          <p className="mt-2 text-xs text-slate-500">
            총 {challenge.datasetCount}건
          </p>
        </div>
      </div>
    </section>
  );
}

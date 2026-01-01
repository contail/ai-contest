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
    <section className="flex flex-col gap-8 rounded-[var(--radius-lg)] bg-[var(--card)] p-7 shadow-[var(--shadow-sm)]">
      {/* 문제 설명 */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-[var(--gray-900)]">문제 설명</h2>
        <p className="text-[15px] leading-[1.8] text-[var(--gray-700)]">
          {challenge.description}
        </p>
      </div>

      {/* 유의사항 - 강조 박스 */}
      {challenge.cautionText && (
        <div className="space-y-3">
          <h2 className="text-base font-bold text-[var(--gray-900)]">유의사항</h2>
          <div className="rounded-[var(--radius-md)] bg-[var(--lime-50)] px-5 py-4">
            <p className="flex items-start gap-2 text-[15px] leading-relaxed text-[var(--lime-700)]">
              <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[var(--lime-500)]" />
              {challenge.cautionText}
            </p>
          </div>
        </div>
      )}

      {/* 문제 자료 */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-[var(--gray-900)]">문제 자료</h2>
        <div className="flex flex-wrap gap-3">
          {datasetHref ? (
            <a
              className="inline-flex items-center gap-3 rounded-[var(--radius-md)] bg-[var(--gray-800)] px-5 py-3.5 text-sm font-medium text-white transition hover:bg-[var(--gray-700)]"
              href={datasetHref}
              download={isInternalDownload ? challenge.datasetFileName : undefined}
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              {challenge.datasetFileName}
            </a>
          ) : (
            <div className="inline-flex items-center gap-3 rounded-[var(--radius-md)] bg-[var(--gray-100)] px-5 py-3.5 text-sm font-medium text-[var(--gray-400)]">
              {challenge.datasetLabel}
            </div>
          )}
          {challenge.id === "voice-from-abyss" && (
            <a
              className="inline-flex items-center gap-3 rounded-[var(--radius-md)] bg-[var(--gray-600)] px-5 py-3.5 text-sm font-medium text-white transition hover:bg-[var(--gray-500)]"
              href="/datasets/protocol_v2_draft.png"
              download="protocol_v2_draft.png"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              protocol_v2_draft.png
            </a>
          )}
        </div>
        {challenge.datasetDescription && (
          <div className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--gray-25)] px-5 py-4">
            <p className="font-mono text-sm font-medium text-[var(--gray-800)]">
              {challenge.datasetFileName}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-[var(--gray-600)]">
              {challenge.datasetDescription}
            </p>
          </div>
        )}
      </div>

      {/* 배점 및 채점 기준 */}
      {(challenge.scoringSummary || challenge.scoringItems?.length) && (
        <div className="space-y-4">
          <h2 className="text-base font-bold text-[var(--gray-900)]">배점 및 채점 기준</h2>
          {challenge.scoringSummary && (
            <p className="text-[15px] font-semibold text-[var(--gray-800)]">
              {challenge.scoringSummary}
            </p>
          )}
          {challenge.scoringItems?.length ? (
            <ul className="space-y-2">
              {challenge.scoringItems.map((item) => (
                <li key={item} className="flex items-start gap-3 text-[15px] text-[var(--gray-600)]">
                  <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[var(--gray-400)]" />
                  {item}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      )}
    </section>
  );
}

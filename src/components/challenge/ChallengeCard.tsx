import Link from "next/link";
import type { ChallengeCardData } from "@/lib/challengeQueries";

type ChallengeCardProps = {
  challenge: ChallengeCardData;
};

export default function ChallengeCard({ challenge }: ChallengeCardProps) {
  return (
    <article className="flex h-full flex-col border border-black/5 bg-[var(--card)] p-5 shadow-sm transition hover:shadow-[0_24px_48px_rgba(15,23,42,0.12)]">
      <div className="relative overflow-hidden border border-slate-200/70 bg-white">
        <div className="absolute left-4 top-4 flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-slate-400">
          <span>{challenge.subtitle}</span>
          {challenge.badge ? <span>{challenge.badge}</span> : null}
        </div>
        <div className="h-36 bg-[linear-gradient(135deg,rgba(15,23,42,0.88),rgba(15,23,42,0.55))]" />
        <div className="absolute bottom-4 left-4 h-2 w-16 bg-[var(--brand)]" />
      </div>
      <div className="mt-4 flex flex-1 flex-col gap-3">
        <h3 className="text-lg font-semibold text-slate-900">
          {challenge.title}
        </h3>
        <p className="text-sm leading-relaxed text-slate-600">
          {challenge.summary}
        </p>
        <div className="flex flex-wrap gap-2 text-[11px] text-slate-500">
          {challenge.tags.map((tag) => (
            <span key={tag} className="border border-slate-200 px-2 py-1">
              {tag}
            </span>
          ))}
        </div>
        <div className="mt-auto">
          <Link
            href={`/challenge/${challenge.id}`}
            className="inline-flex w-full items-center justify-center gap-2 border border-[var(--brand)] px-4 py-2 text-sm font-semibold text-[var(--brand)] transition hover:bg-emerald-50"
          >
            콘테스트 보기
            <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </article>
  );
}

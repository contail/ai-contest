"use client";

import { useEffect, useState } from "react";

type LeaderboardEntry = {
  rank: number;
  nickname: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  submittedAt: string;
  challengeId: string;
  challengeTitle: string;
};

type Props = {
  challengeId?: string;
  limit?: number;
  showChallengeTitle?: boolean;
};

const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1:
      return "🥇";
    case 2:
      return "🥈";
    case 3:
      return "🥉";
    default:
      return null;
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("ko-KR", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function Leaderboard({
  challengeId,
  limit = 10,
  showChallengeTitle = true,
}: Props) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const params = new URLSearchParams();
        if (challengeId) params.set("challengeId", challengeId);
        params.set("limit", limit.toString());

        const res = await fetch(`/api/leaderboard?${params.toString()}`);
        const data = await res.json();
        setLeaderboard(data.leaderboard || []);
      } catch {
        setLeaderboard([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [challengeId, limit]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-[var(--lime-500)] border-t-transparent" />
      </div>
    );
  }

  if (leaderboard.length === 0) {
    return (
      <div className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--card)] px-6 py-8 text-center text-sm text-[var(--gray-500)]">
        아직 제출된 결과가 없습니다.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--card)]">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--border)] bg-[var(--gray-50)]">
              <th className="px-4 py-3 text-left font-semibold text-[var(--gray-700)]">
                순위
              </th>
              <th className="px-4 py-3 text-left font-semibold text-[var(--gray-700)]">
                닉네임
              </th>
              {showChallengeTitle && (
                <th className="hidden px-4 py-3 text-left font-semibold text-[var(--gray-700)] md:table-cell">
                  챌린지
                </th>
              )}
              <th className="px-4 py-3 text-right font-semibold text-[var(--gray-700)]">
                점수
              </th>
              <th className="hidden px-4 py-3 text-right font-semibold text-[var(--gray-700)] sm:table-cell">
                정답률
              </th>
              <th className="hidden px-4 py-3 text-right font-semibold text-[var(--gray-700)] lg:table-cell">
                제출 시간
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {leaderboard.map((entry) => {
              const rankIcon = getRankIcon(entry.rank);
              const isTopThree = entry.rank <= 3;

              return (
                <tr
                  key={`${entry.challengeId}-${entry.nickname}`}
                  className={`transition-colors hover:bg-[var(--gray-50)] ${
                    isTopThree ? "bg-[var(--lime-50)]/30" : ""
                  }`}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {rankIcon ? (
                        <span className="text-lg">{rankIcon}</span>
                      ) : (
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--gray-100)] text-xs font-medium text-[var(--gray-600)]">
                          {entry.rank}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`font-medium ${
                        isTopThree
                          ? "text-[var(--gray-900)]"
                          : "text-[var(--gray-700)]"
                      }`}
                    >
                      {entry.nickname}
                    </span>
                  </td>
                  {showChallengeTitle && (
                    <td className="hidden px-4 py-3 text-[var(--gray-600)] md:table-cell">
                      {entry.challengeTitle}
                    </td>
                  )}
                  <td className="px-4 py-3 text-right">
                    <span className="font-semibold text-[var(--lime-600)]">
                      {entry.score}
                    </span>
                    <span className="text-[var(--gray-400)]">
                      /{entry.totalQuestions}
                    </span>
                  </td>
                  <td className="hidden px-4 py-3 text-right sm:table-cell">
                    <div className="flex items-center justify-end gap-2">
                      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-[var(--gray-200)]">
                        <div
                          className="h-full rounded-full bg-[var(--lime-500)] transition-all"
                          style={{ width: `${entry.percentage}%` }}
                        />
                      </div>
                      <span className="min-w-[3rem] text-[var(--gray-600)]">
                        {entry.percentage}%
                      </span>
                    </div>
                  </td>
                  <td className="hidden px-4 py-3 text-right text-[var(--gray-500)] lg:table-cell">
                    {formatDate(entry.submittedAt)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}


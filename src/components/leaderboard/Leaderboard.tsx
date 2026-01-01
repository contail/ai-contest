"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type LeaderboardEntry = {
  rank: number;
  nickname: string;
  totalScore: number;
  totalQuestions: number;
  challengesCompleted: number;
  averagePercentage: number;
};

type Props = {
  limit?: number;
};


export default function Leaderboard({ limit = 50 }: Props) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const params = new URLSearchParams();
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
  }, [limit]);

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
              <th className="px-4 py-3 text-right font-semibold text-[var(--gray-700)]">
                총점
              </th>
              <th className="hidden px-4 py-3 text-center font-semibold text-[var(--gray-700)] sm:table-cell">
                참여
              </th>
              <th className="hidden px-4 py-3 text-right font-semibold text-[var(--gray-700)] md:table-cell">
                평균 정답률
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {leaderboard.map((entry) => (
                <tr
                  key={entry.nickname}
                  className="transition-colors hover:bg-[var(--gray-50)]"
                >
                  <td className="px-4 py-3">
                    <span className="text-sm font-semibold text-[var(--gray-700)]">
                      {entry.rank}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/profile/${encodeURIComponent(entry.nickname)}`}
                      className="font-medium text-[var(--gray-900)] underline decoration-[var(--gray-300)] underline-offset-2 hover:decoration-[var(--gray-500)]"
                    >
                      {entry.nickname}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="font-semibold text-[var(--lime-600)]">
                      {entry.totalScore}
                    </span>
                    <span className="text-[var(--gray-400)]">점</span>
                  </td>
                  <td className="hidden px-4 py-3 text-center text-[var(--gray-600)] sm:table-cell">
                    {entry.challengesCompleted}개
                  </td>
                  <td className="hidden px-4 py-3 text-right text-[var(--gray-600)] md:table-cell">
                    {entry.averagePercentage}%
                  </td>
                </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseServer";

export const dynamic = "force-dynamic";

type LeaderboardEntry = {
  rank: number;
  nickname: string;
  totalScore: number;
  totalQuestions: number;
  challengesCompleted: number;
  averagePercentage: number;
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get("limit") || "50", 10);

  const { data: sessions, error } = await supabase
    .from("submission_sessions")
    .select("nickname,score,total_questions")
    .eq("status", "SUBMITTED")
    .not("score", "is", null);

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  // 닉네임별로 집계
  const userStats = new Map<string, {
    totalScore: number;
    totalQuestions: number;
    challengesCompleted: number;
  }>();

  for (const session of sessions || []) {
    const existing = userStats.get(session.nickname) || {
      totalScore: 0,
      totalQuestions: 0,
      challengesCompleted: 0,
    };

    userStats.set(session.nickname, {
      totalScore: existing.totalScore + (session.score || 0),
      totalQuestions: existing.totalQuestions + (session.total_questions || 0),
      challengesCompleted: existing.challengesCompleted + 1,
    });
  }

  // 총점 기준 정렬
  const sorted = Array.from(userStats.entries())
    .map(([nickname, stats]) => ({
      nickname,
      ...stats,
      averagePercentage: stats.totalQuestions > 0
        ? Math.round((stats.totalScore / stats.totalQuestions) * 100)
        : 0,
    }))
    .sort((a, b) => b.totalScore - a.totalScore)
    .slice(0, limit);

  const leaderboard: LeaderboardEntry[] = sorted.map((entry, index) => ({
    rank: index + 1,
    nickname: entry.nickname,
    totalScore: entry.totalScore,
    totalQuestions: entry.totalQuestions,
    challengesCompleted: entry.challengesCompleted,
    averagePercentage: entry.averagePercentage,
  }));

  return NextResponse.json({ leaderboard });
}


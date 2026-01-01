import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseServer";

export const dynamic = "force-dynamic";

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

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const challengeId = searchParams.get("challengeId");
  const limit = parseInt(searchParams.get("limit") || "10", 10);

  let query = supabase
    .from("submission_sessions")
    .select("id,nickname,score,total_questions,submitted_at,challenge_id")
    .eq("status", "SUBMITTED")
    .not("score", "is", null)
    .order("score", { ascending: false })
    .order("submitted_at", { ascending: true });

  if (challengeId) {
    query = query.eq("challenge_id", challengeId);
  }

  const { data: sessions, error } = await query.limit(limit);

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  const challengeIds = [...new Set((sessions || []).map((s) => s.challenge_id))];
  const { data: challenges } = challengeIds.length
    ? await supabase.from("challenges").select("id,title").in("id", challengeIds)
    : { data: [] };

  const challengeMap = new Map((challenges || []).map((c) => [c.id, c.title]));

  const leaderboard: LeaderboardEntry[] = (sessions || []).map((session, index) => ({
    rank: index + 1,
    nickname: session.nickname,
    score: session.score || 0,
    totalQuestions: session.total_questions || 0,
    percentage:
      session.total_questions > 0
        ? Math.round((session.score / session.total_questions) * 100)
        : 0,
    submittedAt: session.submitted_at,
    challengeId: session.challenge_id,
    challengeTitle: challengeMap.get(session.challenge_id) || "Unknown",
  }));

  return NextResponse.json({ leaderboard });
}


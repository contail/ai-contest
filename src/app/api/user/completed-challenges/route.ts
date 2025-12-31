import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseServer";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ completedChallenges: {} });
  }

  const { data: sessions } = await supabase
    .from("submission_sessions")
    .select("challenge_id,score,total_questions")
    .eq("user_id", userId)
    .eq("status", "SUBMITTED");

  const completedChallenges: Record<string, { score: number; totalQuestions: number }> = {};

  (sessions || []).forEach((s) => {
    completedChallenges[s.challenge_id] = {
      score: s.score ?? 0,
      totalQuestions: s.total_questions ?? 0,
    };
  });

  return NextResponse.json({ completedChallenges });
}


import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseServer";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ nickname: string }>;
};

export async function GET(_: Request, context: RouteContext) {
  const { nickname } = await context.params;

  const { data: sessions, error } = await supabase
    .from("submission_sessions")
    .select("id,score,total_questions,submitted_at,challenge_id")
    .eq("nickname", nickname)
    .eq("status", "SUBMITTED")
    .not("score", "is", null)
    .order("submitted_at", { ascending: false });

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  if (!sessions || sessions.length === 0) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  const challengeIds = [...new Set(sessions.map((s) => s.challenge_id))];
  const { data: challenges } = await supabase
    .from("challenges")
    .select("id,title,difficulty")
    .in("id", challengeIds);

  const challengeMap = new Map(
    (challenges || []).map((c) => [c.id, { title: c.title, difficulty: c.difficulty }])
  );

  const submissions = sessions.map((session) => {
    const challenge = challengeMap.get(session.challenge_id);
    return {
      challengeId: session.challenge_id,
      challengeTitle: challenge?.title || "Unknown",
      difficulty: challenge?.difficulty || 1,
      score: session.score || 0,
      totalQuestions: session.total_questions || 0,
      percentage: session.total_questions > 0
        ? Math.round((session.score / session.total_questions) * 100)
        : 0,
      submittedAt: session.submitted_at,
    };
  });

  const totalScore = submissions.reduce((sum, s) => sum + s.score, 0);
  const totalQuestions = submissions.reduce((sum, s) => sum + s.totalQuestions, 0);

  return NextResponse.json({
    nickname,
    totalScore,
    challengesCompleted: submissions.length,
    averagePercentage: totalQuestions > 0
      ? Math.round((totalScore / totalQuestions) * 100)
      : 0,
    submissions,
  });
}


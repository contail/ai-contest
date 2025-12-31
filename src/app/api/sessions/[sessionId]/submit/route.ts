import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseServer";

type RouteContext = {
  params: Promise<{ sessionId: string }>;
};

export async function POST(_: Request, context: RouteContext) {
  const { sessionId } = await context.params;

  const { data: session } = await supabase
    .from("submission_sessions")
    .select("id,status,challenge_id")
    .eq("id", sessionId)
    .maybeSingle();

  if (!session) {
    return NextResponse.json({ message: "Session not found" }, { status: 404 });
  }

  if (session.status === "SUBMITTED") {
    return NextResponse.json(
      { message: "Session already submitted" },
      { status: 409 }
    );
  }

  // 채점: 사용자 답변 가져오기
  const { data: userAnswers } = await supabase
    .from("answers")
    .select("question_id,payload")
    .eq("session_id", sessionId);

  // 정답 키 가져오기
  const { data: answerKeys } = await supabase
    .from("answer_keys")
    .select("question_id,answer");

  // 해당 챌린지의 질문과 배점 가져오기
  const { data: questions } = await supabase
    .from("questions")
    .select("id,points")
    .eq("challenge_id", session.challenge_id);

  // 총점 계산
  const totalPoints = (questions || []).reduce((sum, q) => sum + (q.points || 0), 0);

  // 점수 계산 (배점 합산)
  let earnedPoints = 0;
  const answerKeyMap = new Map(
    (answerKeys || []).map((ak) => [ak.question_id, ak.answer])
  );
  const questionPointsMap = new Map(
    (questions || []).map((q) => [q.id, q.points || 0])
  );

  (userAnswers || []).forEach((ua) => {
    const expected = answerKeyMap.get(ua.question_id);
    if (expected && ua.payload?.toString().trim() === expected.trim()) {
      earnedPoints += questionPointsMap.get(ua.question_id) || 0;
    }
  });

  const { data: updated } = await supabase
    .from("submission_sessions")
    .update({
      status: "SUBMITTED",
      submitted_at: new Date().toISOString(),
      score: earnedPoints,
      total_questions: totalPoints,
    })
    .eq("id", sessionId)
    .select("id,challenge_id,nickname,status,created_at,submitted_at,score,total_questions")
    .single();

  return NextResponse.json({
    session: updated ? {
      id: updated.id,
      challengeId: updated.challenge_id,
      nickname: updated.nickname,
      status: updated.status,
      createdAt: updated.created_at,
      submittedAt: updated.submitted_at,
      score: updated.score,
      totalQuestions: updated.total_questions,
    } : null,
  });
}

import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseServer";

type RouteContext = {
  params: Promise<{ sessionId: string }>;
};

export async function GET(_: Request, context: RouteContext) {
  const { sessionId } = await context.params;

  const { data: session, error: sessionError } = await supabase
    .from("submission_sessions")
    .select("id, status, challenge_id")
    .eq("id", sessionId)
    .maybeSingle();

  if (sessionError || !session) {
    return NextResponse.json(
      { message: "세션을 찾을 수 없습니다." },
      { status: 404 }
    );
  }

  if (session.status !== "SUBMITTED") {
    return NextResponse.json(
      { message: "제출 완료된 세션에서만 해설을 볼 수 있습니다." },
      { status: 403 }
    );
  }

  const { data: questions, error: questionsError } = await supabase
    .from("questions")
    .select("id, order, prompt, explanation")
    .eq("challenge_id", session.challenge_id)
    .order("order", { ascending: true });

  if (questionsError) {
    return NextResponse.json(
      { message: "문제 정보를 불러오는데 실패했습니다." },
      { status: 500 }
    );
  }

  const { data: answerKeys } = await supabase
    .from("answer_keys")
    .select("question_id, answer")
    .in("question_id", questions?.map((q) => q.id) ?? []);

  const answerKeyMap = new Map(
    answerKeys?.map((ak) => [ak.question_id, ak.answer]) ?? []
  );

  const { data: userAnswers } = await supabase
    .from("answers")
    .select("question_id, payload")
    .eq("session_id", sessionId);

  const userAnswerMap = new Map(
    userAnswers?.map((a) => [a.question_id, a.payload]) ?? []
  );

  const explanations = (questions ?? []).map((q) => ({
    questionId: q.id,
    order: q.order,
    prompt: q.prompt,
    explanation: q.explanation,
    correctAnswer: answerKeyMap.get(q.id) ?? null,
    userAnswer: userAnswerMap.get(q.id) ?? null,
  }));

  return NextResponse.json({ explanations });
}


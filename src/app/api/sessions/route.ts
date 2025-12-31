import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseServer";

type SessionPayload = {
  nickname?: string;
  challengeId?: string;
  userId?: string;
};

const parsePayload = (payload: string) => {
  const trimmed = payload.trim();
  if (trimmed.startsWith("[") || trimmed.startsWith("{") || trimmed.startsWith("\"")) {
    try {
      return JSON.parse(payload);
    } catch {
      return payload;
    }
  }
  return payload;
};

export async function POST(request: Request) {
  const body = (await request.json()) as SessionPayload;

  if (!body.nickname || !body.challengeId) {
    return NextResponse.json(
      { message: "nickname and challengeId are required" },
      { status: 400 }
    );
  }

  const { data: existingSession } = await supabase
    .from("submission_sessions")
    .select("id,challenge_id,user_id,nickname,status,created_at,submitted_at")
    .eq("challenge_id", body.challengeId)
    .eq("nickname", body.nickname)
    .maybeSingle();

  let session = existingSession;

  if (!session) {
    const { data: newSession } = await supabase
      .from("submission_sessions")
      .insert({
        id: crypto.randomUUID(),
        challenge_id: body.challengeId,
        user_id: body.userId ?? null,
        nickname: body.nickname,
      })
      .select("id,challenge_id,user_id,nickname,status,created_at,submitted_at")
      .single();
    session = newSession;
  } else if (body.userId && !existingSession.user_id) {
    await supabase
      .from("submission_sessions")
      .update({ user_id: body.userId })
      .eq("id", existingSession.id);
  }

  if (!session) {
    return NextResponse.json(
      { message: "Failed to create session" },
      { status: 500 }
    );
  }

  const { data: answers } = await supabase
    .from("answers")
    .select("question_id,payload")
    .eq("session_id", session.id);

  return NextResponse.json({
    session: {
      id: session.id,
      challengeId: session.challenge_id,
      userId: session.user_id,
      nickname: session.nickname,
      status: session.status,
      createdAt: session.created_at,
      submittedAt: session.submitted_at,
    },
    answers: (answers ?? []).map((answer) => ({
      questionId: answer.question_id,
      payload: parsePayload(answer.payload),
    })),
  });
}

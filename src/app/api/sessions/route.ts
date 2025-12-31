import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseServer";

type SessionPayload = {
  nickname?: string;
  challengeId?: string;
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
    .from("SubmissionSession")
    .select("id,challengeId,nickname,status,createdAt,submittedAt")
    .eq("challengeId", body.challengeId)
    .eq("nickname", body.nickname)
    .maybeSingle();

  const session =
    existingSession ??
    (
      await supabase
        .from("SubmissionSession")
        .insert({
          id: crypto.randomUUID(),
          challengeId: body.challengeId,
          nickname: body.nickname,
        })
        .select("id,challengeId,nickname,status,createdAt,submittedAt")
        .single()
    ).data;

  if (!session) {
    return NextResponse.json(
      { message: "Failed to create session" },
      { status: 500 }
    );
  }

  const { data: answers } = await supabase
    .from("Answer")
    .select("questionId,payload")
    .eq("sessionId", session.id);

  return NextResponse.json({
    session,
    answers: (answers ?? []).map((answer) => ({
      questionId: answer.questionId,
      payload: parsePayload(answer.payload),
    })),
  });
}

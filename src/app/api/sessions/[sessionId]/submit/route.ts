import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseServer";

type RouteContext = {
  params: Promise<{ sessionId: string }>;
};

export async function POST(_: Request, context: RouteContext) {
  const { sessionId } = await context.params;

  const { data: session } = await supabase
    .from("submission_sessions")
    .select("id,status")
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

  const { data: updated } = await supabase
    .from("submission_sessions")
    .update({
      status: "SUBMITTED",
      submitted_at: new Date().toISOString(),
    })
    .eq("id", sessionId)
    .select("id,challenge_id,nickname,status,created_at,submitted_at")
    .single();

  return NextResponse.json({
    session: updated ? {
      id: updated.id,
      challengeId: updated.challenge_id,
      nickname: updated.nickname,
      status: updated.status,
      createdAt: updated.created_at,
      submittedAt: updated.submitted_at,
    } : null,
  });
}

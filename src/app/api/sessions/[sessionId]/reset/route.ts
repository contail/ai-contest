import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseServer";

type RouteContext = {
  params: Promise<{ sessionId: string }>;
};

export async function POST(_: Request, context: RouteContext) {
  const { sessionId } = await context.params;

  const { data: session } = await supabase
    .from("submission_sessions")
    .select("id")
    .eq("id", sessionId)
    .maybeSingle();

  if (!session) {
    return NextResponse.json({ message: "Session not found" }, { status: 404 });
  }

  await supabase.from("answers").delete().eq("session_id", sessionId);
  await supabase
    .from("submission_sessions")
    .update({ status: "DRAFT", submitted_at: null })
    .eq("id", sessionId);

  return NextResponse.json({ status: "reset" });
}

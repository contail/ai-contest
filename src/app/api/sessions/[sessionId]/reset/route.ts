import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseServer";

type RouteParams = {
  params: { sessionId: string };
};

export async function POST(_: Request, { params }: RouteParams) {
  const { data: session } = await supabase
    .from("SubmissionSession")
    .select("id")
    .eq("id", params.sessionId)
    .maybeSingle();

  if (!session) {
    return NextResponse.json({ message: "Session not found" }, { status: 404 });
  }

  await supabase.from("Answer").delete().eq("sessionId", params.sessionId);
  await supabase
    .from("SubmissionSession")
    .update({ status: "DRAFT", submittedAt: null })
    .eq("id", params.sessionId);

  return NextResponse.json({ status: "reset" });
}

import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseServer";

type RouteParams = {
  params: { sessionId: string };
};

export async function POST(_: Request, { params }: RouteParams) {
  const { data: session } = await supabase
    .from("SubmissionSession")
    .select("id,status")
    .eq("id", params.sessionId)
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
    .from("SubmissionSession")
    .update({
      status: "SUBMITTED",
      submittedAt: new Date().toISOString(),
    })
    .eq("id", params.sessionId)
    .select("id,challengeId,nickname,status,createdAt,submittedAt")
    .single();

  return NextResponse.json({ session: updated });
}

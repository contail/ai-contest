import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseServer";

type AnswerPayload = {
  questionId: string;
  payload: unknown;
};

type AnswersRequest = {
  answers?: AnswerPayload[];
  questionId?: string;
  payload?: unknown;
};

type RouteContext = {
  params: Promise<{ sessionId: string }>;
};

const serializePayload = (payload: unknown) => {
  if (payload === undefined || payload === null) {
    return "{}";
  }
  return typeof payload === "string" ? payload : JSON.stringify(payload);
};

const extractUrls = (payload: unknown) => {
  if (typeof payload === "string") {
    return payload
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
  }
  if (Array.isArray(payload)) {
    return payload.filter((item): item is string => typeof item === "string");
  }
  return [];
};

const isValidUrl = (value: string) => /^https?:\/\/\S+$/i.test(value.trim());

export async function PUT(request: Request, context: RouteContext) {
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

  const body = (await request.json()) as AnswersRequest;
  const entries: AnswerPayload[] = body.answers
    ? body.answers
    : body.questionId
      ? [{ questionId: body.questionId, payload: body.payload }]
      : [];

  if (entries.length === 0) {
    return NextResponse.json(
      { message: "answers or questionId/payload required" },
      { status: 400 }
    );
  }

  const { data: challenge } = await supabase
    .from("challenges")
    .select("restrict_dataset_url")
    .eq("id", session.challenge_id)
    .maybeSingle();

  if (!challenge) {
    return NextResponse.json({ message: "Challenge not found" }, { status: 404 });
  }

  const questionIds = entries.map((entry) => entry.questionId);
  const { data: questions } = await supabase
    .from("questions")
    .select("id,type")
    .in("id", questionIds);

  const questionTypeMap = new Map(
    (questions ?? []).map((question) => [question.id, question.type])
  );

  if (challenge.restrict_dataset_url) {
    const urlEntries = entries.filter((entry) => {
      const type = questionTypeMap.get(entry.questionId) ?? "";
      return type.toUpperCase() === "URL" || type.toUpperCase() === "MULTI_URL";
    });

    const submittedUrls = urlEntries.flatMap((entry) =>
      extractUrls(entry.payload)
    );

    const invalidUrl = submittedUrls.find((url) => !isValidUrl(url));
    if (invalidUrl) {
      return NextResponse.json(
        { message: "Invalid URL format", invalidUrl },
        { status: 400 }
      );
    }

    if (submittedUrls.length > 0) {
      const { data: matched } = await supabase
        .from("dataset_urls")
        .select("url")
        .eq("challenge_id", session.challenge_id)
        .in("url", submittedUrls);
      const allowed = new Set((matched ?? []).map((item) => item.url));
      const notAllowed = submittedUrls.filter((url) => !allowed.has(url));
      if (notAllowed.length > 0) {
        return NextResponse.json(
          { message: "Dataset URL validation failed", notAllowed },
          { status: 422 }
        );
      }
    }
  }

  await Promise.all(
    entries.map(async (entry) => {
      const payload = serializePayload(entry.payload);
      const { data: updated } = await supabase
        .from("answers")
        .update({
          payload,
          updated_at: new Date().toISOString(),
        })
        .eq("session_id", sessionId)
        .eq("question_id", entry.questionId)
        .select("id");

      if (!updated || updated.length === 0) {
        await supabase.from("answers").insert({
          id: crypto.randomUUID(),
          session_id: sessionId,
          question_id: entry.questionId,
          payload,
        });
      }
    })
  );

  return NextResponse.json({ status: "saved" });
}

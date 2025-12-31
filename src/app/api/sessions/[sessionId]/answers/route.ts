import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type AnswerPayload = {
  questionId: string;
  payload: unknown;
};

type AnswersRequest = {
  answers?: AnswerPayload[];
  questionId?: string;
  payload?: unknown;
};

type RouteParams = {
  params: { sessionId: string };
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

export async function PUT(request: Request, { params }: RouteParams) {
  const session = await prisma.submissionSession.findUnique({
    where: { id: params.sessionId },
    select: { status: true, challengeId: true },
  });

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

  const challenge = await prisma.challenge.findUnique({
    where: { id: session.challengeId },
    select: { restrictDatasetUrl: true },
  });

  if (!challenge) {
    return NextResponse.json({ message: "Challenge not found" }, { status: 404 });
  }

  const questionIds = entries.map((entry) => entry.questionId);
  const questions = await prisma.question.findMany({
    where: { id: { in: questionIds } },
    select: { id: true, type: true },
  });

  const questionTypeMap = new Map(
    questions.map((question) => [question.id, question.type])
  );

  if (challenge.restrictDatasetUrl) {
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
      const matched = await prisma.datasetUrl.findMany({
        where: {
          challengeId: session.challengeId,
          url: { in: submittedUrls },
        },
        select: { url: true },
      });
      const allowed = new Set(matched.map((item) => item.url));
      const notAllowed = submittedUrls.filter((url) => !allowed.has(url));
      if (notAllowed.length > 0) {
        return NextResponse.json(
          { message: "Dataset URL validation failed", notAllowed },
          { status: 422 }
        );
      }
    }
  }

  await prisma.$transaction(
    entries.map((entry) =>
      prisma.answer.upsert({
        where: {
          sessionId_questionId: {
            sessionId: params.sessionId,
            questionId: entry.questionId,
          },
        },
        update: {
          payload: serializePayload(entry.payload),
        },
        create: {
          sessionId: params.sessionId,
          questionId: entry.questionId,
          payload: serializePayload(entry.payload),
        },
      })
    )
  );

  return NextResponse.json({ status: "saved" });
}

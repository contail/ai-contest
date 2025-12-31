import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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

  const session = await prisma.submissionSession.upsert({
    where: {
      challengeId_nickname: {
        challengeId: body.challengeId,
        nickname: body.nickname,
      },
    },
    update: {},
    create: {
      challengeId: body.challengeId,
      nickname: body.nickname,
    },
  });

  const answers = await prisma.answer.findMany({
    where: { sessionId: session.id },
    select: { questionId: true, payload: true },
  });

  return NextResponse.json({
    session,
    answers: answers.map((answer) => ({
      questionId: answer.questionId,
      payload: parsePayload(answer.payload),
    })),
  });
}

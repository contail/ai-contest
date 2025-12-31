import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type RouteParams = {
  params: { id: string };
};

type QuestionInput = {
  order: number;
  type: string;
  prompt: string;
  options?: string[] | null;
  required?: boolean;
};

type QuestionsPayload = {
  questions?: QuestionInput[];
};

export async function POST(request: Request, { params }: RouteParams) {
  const body = (await request.json()) as QuestionsPayload;
  const questions = body.questions ?? [];

  await prisma.question.deleteMany({
    where: { challengeId: params.id },
  });

  for (const question of questions) {
    await prisma.question.create({
      data: {
        challengeId: params.id,
        order: question.order,
        type: question.type,
        prompt: question.prompt,
        options: question.options ? JSON.stringify(question.options) : null,
        required: question.required ?? false,
      },
    });
  }

  return NextResponse.json({ count: questions.length });
}

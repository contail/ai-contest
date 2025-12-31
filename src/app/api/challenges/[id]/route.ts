import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type RouteParams = {
  params: { id: string };
};

export async function GET(_: Request, { params }: RouteParams) {
  const challenge = await prisma.challenge.findUnique({
    where: { id: params.id },
    include: {
      questions: {
        orderBy: { order: "asc" },
        select: {
          id: true,
          order: true,
          type: true,
          prompt: true,
          options: true,
          required: true,
        },
      },
      datasetUrls: {
        select: { id: true },
      },
    },
  });

  if (!challenge) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  const datasetCount = challenge.datasetUrls.length;
  const questions = challenge.questions.map((question) => ({
    ...question,
    options: question.options ? JSON.parse(question.options) : null,
  }));

  return NextResponse.json({
    challenge: {
      id: challenge.id,
      title: challenge.title,
      subtitle: challenge.subtitle,
      summary: challenge.summary,
      tags: challenge.tags ? JSON.parse(challenge.tags) : [],
      badge: challenge.badge,
      heroCopy: challenge.heroCopy,
      description: challenge.description,
      cautionText: challenge.cautionText,
      datasetLabel: challenge.datasetLabel,
      datasetFileName: challenge.datasetFileName,
      datasetDescription: challenge.datasetDescription,
      datasetDownloadUrl: challenge.datasetDownloadUrl,
      restrictDatasetUrl: challenge.restrictDatasetUrl,
      datasetCount,
      questions,
    },
  });
}

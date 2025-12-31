import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const published = await prisma.challenge.findMany({
    where: { isPublished: true },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      subtitle: true,
      summary: true,
      tags: true,
      badge: true,
      heroCopy: true,
      description: true,
      cautionText: true,
      datasetLabel: true,
      datasetFileName: true,
      datasetDescription: true,
      datasetDownloadUrl: true,
      restrictDatasetUrl: true,
      isPublished: true,
      createdAt: true,
    },
  });

  const challenges =
    published.length > 0
      ? published
      : await prisma.challenge.findMany({
          orderBy: { createdAt: "desc" },
          select: {
          id: true,
          title: true,
          subtitle: true,
          summary: true,
          tags: true,
          badge: true,
          heroCopy: true,
          description: true,
          cautionText: true,
          datasetLabel: true,
          datasetFileName: true,
          datasetDescription: true,
          datasetDownloadUrl: true,
          restrictDatasetUrl: true,
          isPublished: true,
          createdAt: true,
        },
      });

  const payload = challenges.map((challenge) => ({
    ...challenge,
    tags: challenge.tags ? JSON.parse(challenge.tags) : [],
  }));

  return NextResponse.json({ challenges: payload });
}

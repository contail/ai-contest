import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type RouteParams = {
  params: { id: string };
};

type DatasetPayload = {
  datasetLabel?: string;
  datasetFileName?: string;
  datasetDescription?: string;
  datasetDownloadUrl?: string | null;
  urls?: string[];
};

const sanitizeUrls = (urls: string[] | undefined) => {
  if (!urls) return [];
  return Array.from(
    new Set(
      urls.map((url) => url.trim()).filter((url) => url.length > 0)
    )
  );
};

export async function POST(request: Request, { params }: RouteParams) {
  const body = (await request.json()) as DatasetPayload;
  const urls = sanitizeUrls(body.urls);

  const challenge = await prisma.challenge.update({
    where: { id: params.id },
    data: {
      datasetLabel: body.datasetLabel,
      datasetFileName: body.datasetFileName,
      datasetDescription: body.datasetDescription,
      datasetDownloadUrl: body.datasetDownloadUrl ?? null,
    },
  });

  if (urls.length > 0) {
    await prisma.datasetUrl.deleteMany({
      where: { challengeId: params.id },
    });
    for (const url of urls) {
      await prisma.datasetUrl.create({
        data: {
          challengeId: params.id,
          url,
        },
      });
    }
  }

  return NextResponse.json({ challenge, datasetCount: urls.length });
}

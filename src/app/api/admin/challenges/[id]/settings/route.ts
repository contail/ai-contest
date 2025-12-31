import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type RouteParams = {
  params: { id: string };
};

type SettingsPayload = {
  restrictDatasetUrl?: boolean;
};

export async function POST(request: Request, { params }: RouteParams) {
  const body = (await request.json()) as SettingsPayload;

  const challenge = await prisma.challenge.update({
    where: { id: params.id },
    data: {
      restrictDatasetUrl: body.restrictDatasetUrl ?? false,
    },
  });

  return NextResponse.json({ challenge });
}

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type RouteParams = {
  params: { sessionId: string };
};

export async function POST(_: Request, { params }: RouteParams) {
  const session = await prisma.submissionSession.findUnique({
    where: { id: params.sessionId },
  });

  if (!session) {
    return NextResponse.json({ message: "Session not found" }, { status: 404 });
  }

  await prisma.$transaction([
    prisma.answer.deleteMany({
      where: { sessionId: params.sessionId },
    }),
    prisma.submissionSession.update({
      where: { id: params.sessionId },
      data: {
        status: "DRAFT",
        submittedAt: null,
      },
    }),
  ]);

  return NextResponse.json({ status: "reset" });
}

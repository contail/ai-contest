import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type RouteParams = {
  params: { sessionId: string };
};

export async function POST(_: Request, { params }: RouteParams) {
  const session = await prisma.submissionSession.findUnique({
    where: { id: params.sessionId },
    select: { status: true },
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

  const updated = await prisma.submissionSession.update({
    where: { id: params.sessionId },
    data: {
      status: "SUBMITTED",
      submittedAt: new Date(),
    },
  });

  return NextResponse.json({ session: updated });
}

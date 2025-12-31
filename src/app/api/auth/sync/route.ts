import { NextResponse } from "next/server";
import { createOrUpdateUser } from "@/lib/auth";

type SyncPayload = {
  id: string;
  email: string;
  name?: string | null;
};

export async function POST(request: Request) {
  const body = (await request.json()) as SyncPayload;

  if (!body.id || !body.email) {
    return NextResponse.json({ user: null }, { status: 400 });
  }

  const user = await createOrUpdateUser(body.id, body.email, body.name);

  return NextResponse.json({ user });
}


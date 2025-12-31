import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseServer";

type RouteParams = {
  params: { id: string };
};

type SettingsPayload = {
  restrictDatasetUrl?: boolean;
};

export async function POST(request: Request, { params }: RouteParams) {
  const body = (await request.json()) as SettingsPayload;

  const { data: challenge } = await supabase
    .from("Challenge")
    .update({
      restrictDatasetUrl: body.restrictDatasetUrl ?? false,
    })
    .eq("id", params.id)
    .select("*")
    .single();

  return NextResponse.json({ challenge });
}

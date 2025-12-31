import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseServer";

type RouteContext = {
  params: Promise<{ id: string }>;
};

type SettingsPayload = {
  restrictDatasetUrl?: boolean;
};

export async function POST(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const body = (await request.json()) as SettingsPayload;

  const { data: challenge } = await supabase
    .from("challenges")
    .update({
      restrict_dataset_url: body.restrictDatasetUrl ?? false,
    })
    .eq("id", id)
    .select("*")
    .single();

  return NextResponse.json({ challenge });
}

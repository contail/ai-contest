import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseServer";

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

  const { data: challenge } = await supabase
    .from("Challenge")
    .update({
      datasetLabel: body.datasetLabel,
      datasetFileName: body.datasetFileName,
      datasetDescription: body.datasetDescription,
      datasetDownloadUrl: body.datasetDownloadUrl ?? null,
    })
    .eq("id", params.id)
    .select("*")
    .single();

  if (urls.length > 0) {
    await supabase.from("DatasetUrl").delete().eq("challengeId", params.id);
    await supabase.from("DatasetUrl").insert(
      urls.map((url) => ({
        id: crypto.randomUUID(),
        challengeId: params.id,
        url,
      }))
    );
  }

  return NextResponse.json({ challenge, datasetCount: urls.length });
}

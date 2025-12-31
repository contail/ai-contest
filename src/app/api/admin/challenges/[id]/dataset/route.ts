import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseServer";

type RouteContext = {
  params: Promise<{ id: string }>;
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

export async function POST(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const body = (await request.json()) as DatasetPayload;
  const urls = sanitizeUrls(body.urls);

  const { data: challenge } = await supabase
    .from("challenges")
    .update({
      dataset_label: body.datasetLabel,
      dataset_file_name: body.datasetFileName,
      dataset_description: body.datasetDescription,
      dataset_download_url: body.datasetDownloadUrl ?? null,
    })
    .eq("id", id)
    .select("*")
    .single();

  if (urls.length > 0) {
    await supabase.from("dataset_urls").delete().eq("challenge_id", id);
    await supabase.from("dataset_urls").insert(
      urls.map((url) => ({
        id: crypto.randomUUID(),
        challenge_id: id,
        url,
      }))
    );
  }

  return NextResponse.json({ challenge, datasetCount: urls.length });
}

import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseServer";

export async function GET() {
  const selectFields =
    "id,title,subtitle,summary,tags,badge,difficulty,hero_copy,description,caution_text,dataset_label,dataset_file_name,dataset_description,dataset_download_url,restrict_dataset_url,is_published,created_at";

  const { data: published, error: publishedError } = await supabase
    .from("challenges")
    .select(selectFields)
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  if (publishedError) {
    return NextResponse.json(
      { message: "Failed to load challenges." },
      { status: 500 }
    );
  }

  const challenges = published && published.length > 0
    ? published
    : (
        await supabase
          .from("challenges")
          .select(selectFields)
          .order("created_at", { ascending: false })
      ).data ?? [];

  const payload = challenges.map((challenge) => ({
    id: challenge.id,
    title: challenge.title,
    subtitle: challenge.subtitle,
    summary: challenge.summary,
    tags: challenge.tags ? JSON.parse(challenge.tags) : [],
    badge: challenge.badge,
    difficulty: challenge.difficulty ?? 1,
    heroCopy: challenge.hero_copy,
    description: challenge.description,
    cautionText: challenge.caution_text,
    datasetLabel: challenge.dataset_label,
    datasetFileName: challenge.dataset_file_name,
    datasetDescription: challenge.dataset_description,
    datasetDownloadUrl: challenge.dataset_download_url,
    restrictDatasetUrl: challenge.restrict_dataset_url,
    isPublished: challenge.is_published,
    createdAt: challenge.created_at,
  }));

  return NextResponse.json({ challenges: payload });
}

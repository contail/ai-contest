import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseServer";

export async function GET() {
  const selectFields =
    "id,title,subtitle,summary,tags,badge,heroCopy,description,cautionText,datasetLabel,datasetFileName,datasetDescription,datasetDownloadUrl,restrictDatasetUrl,isPublished,createdAt";

  const { data: published, error: publishedError } = await supabase
    .from("Challenge")
    .select(selectFields)
    .eq("isPublished", true)
    .order("createdAt", { ascending: false });

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
          .from("Challenge")
          .select(selectFields)
          .order("createdAt", { ascending: false })
      ).data ?? [];

  const payload = challenges.map((challenge) => ({
    ...challenge,
    tags: challenge.tags ? JSON.parse(challenge.tags) : [],
  }));

  return NextResponse.json({ challenges: payload });
}

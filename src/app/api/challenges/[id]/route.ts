import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseServer";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_: Request, context: RouteContext) {
  const { id } = await context.params;

  const { data: challenge, error } = await supabase
    .from("challenges")
    .select(
      "id,title,subtitle,summary,tags,badge,hero_copy,description,caution_text,dataset_label,dataset_file_name,dataset_description,dataset_download_url,restrict_dataset_url"
    )
    .eq("id", id)
    .maybeSingle();

  if (error || !challenge) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  const { data: questionsData } = await supabase
    .from("questions")
    .select("id,order,type,prompt,options,required")
    .eq("challenge_id", id)
    .order("order", { ascending: true });

  const { data: datasetUrls } = await supabase
    .from("dataset_urls")
    .select("id")
    .eq("challenge_id", id);

  const datasetCount = datasetUrls?.length ?? 0;
  const questions = (questionsData ?? []).map((question) => ({
    ...question,
    options: question.options ? JSON.parse(question.options) : null,
  }));

  return NextResponse.json({
    challenge: {
      id: challenge.id,
      title: challenge.title,
      subtitle: challenge.subtitle,
      summary: challenge.summary,
      tags: challenge.tags ? JSON.parse(challenge.tags) : [],
      badge: challenge.badge,
      heroCopy: challenge.hero_copy,
      description: challenge.description,
      cautionText: challenge.caution_text,
      datasetLabel: challenge.dataset_label,
      datasetFileName: challenge.dataset_file_name,
      datasetDescription: challenge.dataset_description,
      datasetDownloadUrl: challenge.dataset_download_url,
      restrictDatasetUrl: challenge.restrict_dataset_url,
      datasetCount,
      questions,
    },
  });
}

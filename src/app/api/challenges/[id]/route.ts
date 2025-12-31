import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseServer";

type RouteParams = {
  params: { id: string };
};

export async function GET(_: Request, { params }: RouteParams) {
  const { data: challenge, error } = await supabase
    .from("Challenge")
    .select(
      "id,title,subtitle,summary,tags,badge,heroCopy,description,cautionText,datasetLabel,datasetFileName,datasetDescription,datasetDownloadUrl,restrictDatasetUrl"
    )
    .eq("id", params.id)
    .maybeSingle();

  if (error || !challenge) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  const { data: questionsData } = await supabase
    .from("Question")
    .select("id,order,type,prompt,options,required")
    .eq("challengeId", params.id)
    .order("order", { ascending: true });

  const { data: datasetUrls } = await supabase
    .from("DatasetUrl")
    .select("id")
    .eq("challengeId", params.id);

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
      heroCopy: challenge.heroCopy,
      description: challenge.description,
      cautionText: challenge.cautionText,
      datasetLabel: challenge.datasetLabel,
      datasetFileName: challenge.datasetFileName,
      datasetDescription: challenge.datasetDescription,
      datasetDownloadUrl: challenge.datasetDownloadUrl,
      restrictDatasetUrl: challenge.restrictDatasetUrl,
      datasetCount,
      questions,
    },
  });
}

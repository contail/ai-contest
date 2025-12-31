import { challenges } from "@/lib/mockData";
import { supabase } from "@/lib/supabaseServer";

export type ChallengeCardData = {
  id: string;
  title: string;
  subtitle: string;
  summary: string;
  tags: string[];
  badge: string | null;
  heroCopy: string | null;
  description: string;
  cautionText: string;
  scoringSummary?: string | null;
  scoringItems?: string[] | null;
  datasetLabel: string;
  datasetFileName: string;
  datasetDescription: string;
  datasetDownloadUrl: string | null;
  restrictDatasetUrl: boolean;
};

export type ChallengeDetailData = ChallengeCardData & {
  datasetCount: number;
  questions: {
    id: string;
    order: number;
    type: string;
    prompt: string;
    options: string[] | null;
    required: boolean;
  }[];
};

const parseTags = (tags: string) => {
  try {
    return JSON.parse(tags) as string[];
  } catch {
    return [];
  }
};

const parseOptions = (options: string | null) => {
  if (!options) return null;
  try {
    return JSON.parse(options) as string[];
  } catch {
    return null;
  }
};

export async function getChallenges(): Promise<ChallengeCardData[]> {
  const { data, error } = await supabase
    .from("Challenge")
    .select(
      "id,title,subtitle,summary,tags,badge,heroCopy,description,cautionText,datasetLabel,datasetFileName,datasetDescription,datasetDownloadUrl,restrictDatasetUrl"
    )
    .eq("isPublished", true)
    .order("createdAt", { ascending: false });

  if (error || !data) {
    console.error("getChallenges failed", error);
    return [];
  }

  return data.map((challenge) => ({
    id: challenge.id,
    title: challenge.title,
    subtitle: challenge.subtitle,
    summary: challenge.summary,
    tags: parseTags(challenge.tags),
    badge: challenge.badge,
    heroCopy: challenge.heroCopy,
    description: challenge.description,
    cautionText: challenge.cautionText,
    scoringSummary: null,
    scoringItems: null,
    datasetLabel: challenge.datasetLabel,
    datasetFileName: challenge.datasetFileName,
    datasetDescription: challenge.datasetDescription,
    datasetDownloadUrl: challenge.datasetDownloadUrl,
    restrictDatasetUrl: challenge.restrictDatasetUrl,
  }));
}

export async function getChallengeDetail(
  id: string
): Promise<ChallengeDetailData | null> {
  if (!id) return null;
  const { data: challenge, error } = await supabase
    .from("Challenge")
    .select(
      "id,title,subtitle,summary,tags,badge,heroCopy,description,cautionText,datasetLabel,datasetFileName,datasetDescription,datasetDownloadUrl,restrictDatasetUrl"
    )
    .eq("id", id)
    .maybeSingle();

  if (error || !challenge) return null;

  const { data: questions } = await supabase
    .from("Question")
    .select("id,order,type,prompt,options,required")
    .eq("challengeId", id)
    .order("order", { ascending: true });

  const { data: datasetUrls } = await supabase
    .from("DatasetUrl")
    .select("id")
    .eq("challengeId", id);

  return {
    id: challenge.id,
    title: challenge.title,
    subtitle: challenge.subtitle,
    summary: challenge.summary,
    tags: parseTags(challenge.tags),
    badge: challenge.badge,
    heroCopy: challenge.heroCopy,
    description: challenge.description,
    cautionText: challenge.cautionText,
    scoringSummary: null,
    scoringItems: null,
    datasetLabel: challenge.datasetLabel,
    datasetFileName: challenge.datasetFileName,
    datasetDescription: challenge.datasetDescription,
    datasetDownloadUrl: challenge.datasetDownloadUrl,
    restrictDatasetUrl: challenge.restrictDatasetUrl,
    datasetCount: datasetUrls?.length ?? 0,
    questions: (questions ?? []).map((question) => ({
      id: question.id,
      order: question.order,
      type: question.type,
      prompt: question.prompt,
      options: parseOptions(question.options),
      required: question.required,
    })),
  };
}

export async function getChallengeDetailOrMock(
  id: string
): Promise<ChallengeDetailData | null> {
  const fromDb = await getChallengeDetail(id);
  if (fromDb) {
    const mock = challenges.find((item) => item.id === id);
    return {
      ...fromDb,
      scoringSummary: fromDb.scoringSummary ?? mock?.scoringSummary ?? null,
      scoringItems: fromDb.scoringItems ?? mock?.scoringItems ?? null,
    };
  }

  const mock = challenges.find((item) => item.id === id);
  if (!mock) return null;

  return {
    id: mock.id,
    title: mock.title,
    subtitle: mock.subtitle,
    summary: mock.summary,
    tags: mock.tags,
    badge: mock.badge ?? null,
    heroCopy: mock.heroCopy ?? null,
    description: mock.description,
    cautionText: mock.cautionText,
    scoringSummary: mock.scoringSummary ?? null,
    scoringItems: mock.scoringItems ?? null,
    datasetLabel: mock.datasetLabel,
    datasetFileName: mock.datasetFileName,
    datasetDescription: mock.datasetDescription,
    datasetDownloadUrl: mock.datasetDownloadUrl ?? null,
    restrictDatasetUrl: false,
    datasetCount: mock.id === "pfct-news" ? 100 : 0,
    questions: mock.questions.map((question) => ({
      id: question.id,
      order: question.order,
      type: question.type,
      prompt: question.prompt,
      options: question.options ?? null,
      required: question.required ?? false,
    })),
  };
}

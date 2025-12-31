import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseServer";

type RouteParams = {
  params: { id: string };
};

type QuestionInput = {
  order: number;
  type: string;
  prompt: string;
  options?: string[] | null;
  required?: boolean;
};

type QuestionsPayload = {
  questions?: QuestionInput[];
};

export async function POST(request: Request, { params }: RouteParams) {
  const body = (await request.json()) as QuestionsPayload;
  const questions = body.questions ?? [];

  await supabase.from("Question").delete().eq("challengeId", params.id);
  if (questions.length > 0) {
    await supabase.from("Question").insert(
      questions.map((question) => ({
        id: crypto.randomUUID(),
        challengeId: params.id,
        order: question.order,
        type: question.type,
        prompt: question.prompt,
        options: question.options ? JSON.stringify(question.options) : null,
        required: question.required ?? false,
      }))
    );
  }

  return NextResponse.json({ count: questions.length });
}

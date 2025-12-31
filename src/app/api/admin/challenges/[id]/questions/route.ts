import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseServer";

type RouteContext = {
  params: Promise<{ id: string }>;
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

export async function POST(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const body = (await request.json()) as QuestionsPayload;
  const questions = body.questions ?? [];

  await supabase.from("questions").delete().eq("challenge_id", id);
  if (questions.length > 0) {
    await supabase.from("questions").insert(
      questions.map((question) => ({
        id: crypto.randomUUID(),
        challenge_id: id,
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

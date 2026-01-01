import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseServer";

export const dynamic = "force-dynamic";

type Answer = {
  questionId: string;
  answer: string;
};

export async function POST(
  request: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;
  const body = await request.json();
  const { applicantName, applicantEmail, answers } = body as {
    applicantName: string;
    applicantEmail: string;
    answers: Answer[];
  };

  if (!applicantName || !applicantEmail || !answers) {
    return NextResponse.json(
      { message: "applicantName, applicantEmail, and answers are required" },
      { status: 400 }
    );
  }

  const { data: assessment, error: assessmentError } = await supabase
    .from("assessments")
    .select("id, challenge_id, is_active, expires_at")
    .eq("access_code", code)
    .single();

  if (assessmentError || !assessment) {
    return NextResponse.json({ message: "Assessment not found" }, { status: 404 });
  }

  if (!assessment.is_active) {
    return NextResponse.json({ message: "Assessment is not active" }, { status: 403 });
  }

  if (assessment.expires_at && new Date(assessment.expires_at) < new Date()) {
    return NextResponse.json({ message: "Assessment has expired" }, { status: 403 });
  }

  // 무료 플랜: 응시자 1명 제한
  const FREE_APPLICANT_LIMIT = 1;
  const { count: submissionCount } = await supabase
    .from("assessment_submissions")
    .select("*", { count: "exact", head: true })
    .eq("assessment_id", assessment.id);

  const { data: existingSubmission } = await supabase
    .from("assessment_submissions")
    .select("id, status")
    .eq("assessment_id", assessment.id)
    .eq("applicant_email", applicantEmail)
    .single();

  // 이미 제출한 본인이 아닌 경우 + 제한 초과 시
  if (!existingSubmission && submissionCount !== null && submissionCount >= FREE_APPLICANT_LIMIT) {
    return NextResponse.json(
      { message: `무료 플랜에서는 평가당 응시자 ${FREE_APPLICANT_LIMIT}명까지만 가능합니다. 추가 이용을 원하시면 문의해주세요.` },
      { status: 403 }
    );
  }

  if (existingSubmission?.status === "SUBMITTED") {
    return NextResponse.json(
      { message: "You have already submitted this assessment" },
      { status: 400 }
    );
  }

  const { data: answerKeys } = await supabase
    .from("answer_keys")
    .select("question_id, answer")
    .in(
      "question_id",
      answers.map((a) => a.questionId)
    );

  const keyMap = new Map(answerKeys?.map((k) => [k.question_id, k.answer]) ?? []);

  let score = 0;
  const gradedAnswers = answers.map((a) => {
    const correctAnswer = keyMap.get(a.questionId);
    const isCorrect =
      correctAnswer !== undefined &&
      a.answer.trim().toLowerCase() === correctAnswer.trim().toLowerCase();
    if (isCorrect) score++;
    return {
      questionId: a.questionId,
      answer: a.answer,
      isCorrect,
    };
  });

  let submissionId: string;

  if (existingSubmission) {
    submissionId = existingSubmission.id;
    await supabase
      .from("assessment_submissions")
      .update({
        status: "SUBMITTED",
        score,
        total_questions: answers.length,
        submitted_at: new Date().toISOString(),
      })
      .eq("id", submissionId);
  } else {
    const { data: newSubmission, error: insertError } = await supabase
      .from("assessment_submissions")
      .insert({
        assessment_id: assessment.id,
        applicant_name: applicantName,
        applicant_email: applicantEmail,
        status: "SUBMITTED",
        score,
        total_questions: answers.length,
        started_at: new Date().toISOString(),
        submitted_at: new Date().toISOString(),
      })
      .select("id")
      .single();

    if (insertError || !newSubmission) {
      return NextResponse.json({ message: "Failed to create submission" }, { status: 500 });
    }
    submissionId = newSubmission.id;
  }

  await supabase.from("assessment_answers").delete().eq("submission_id", submissionId);

  const answerInserts = gradedAnswers.map((a) => ({
    submission_id: submissionId,
    question_id: a.questionId,
    answer_text: a.answer,
    is_correct: a.isCorrect,
  }));

  await supabase.from("assessment_answers").insert(answerInserts);

  return NextResponse.json({
    success: true,
    score,
    totalQuestions: answers.length,
    percentage: Math.round((score / answers.length) * 100),
  });
}


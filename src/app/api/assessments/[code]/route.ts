import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseServer";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;

  const { data: assessment, error } = await supabase
    .from("assessments")
    .select(`
      id,
      title,
      description,
      company_name,
      challenge_id,
      time_limit_minutes,
      expires_at,
      is_active,
      challenges (
        id,
        title,
        subtitle,
        description,
        difficulty,
        caution_text,
        dataset_label,
        dataset_file_name,
        dataset_description,
        dataset_download_url,
        questions (
          id,
          order,
          type,
          prompt,
          options,
          required,
          points
        )
      )
    `)
    .eq("access_code", code)
    .single();

  if (error) {
    console.error("Assessment fetch error:", error);
    return NextResponse.json(
      { message: error.message || "Assessment not found" },
      { status: 404 }
    );
  }

  if (!assessment) {
    return NextResponse.json(
      { message: "Assessment not found" },
      { status: 404 }
    );
  }

  if (!assessment.is_active) {
    return NextResponse.json(
      { message: "This assessment is no longer active" },
      { status: 403 }
    );
  }

  if (assessment.expires_at && new Date(assessment.expires_at) < new Date()) {
    return NextResponse.json(
      { message: "This assessment has expired" },
      { status: 403 }
    );
  }

  // 무료 체험 제한: 응시자 1명
  const FREE_APPLICANT_LIMIT = 1;
  const { count: submissionCount } = await supabase
    .from("assessment_submissions")
    .select("*", { count: "exact", head: true })
    .eq("assessment_id", assessment.id);

  if (submissionCount !== null && submissionCount >= FREE_APPLICANT_LIMIT) {
    return NextResponse.json(
      { message: "이 평가는 무료 체험이 완료되어 더 이상 접근할 수 없습니다.", trialEnded: true },
      { status: 403 }
    );
  }

  return NextResponse.json({ assessment });
}


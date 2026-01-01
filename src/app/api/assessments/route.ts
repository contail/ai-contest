import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseServer";

export const dynamic = "force-dynamic";

function generateAccessCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ message: "userId is required" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("assessments")
    .select(`
      *,
      challenges (title, difficulty),
      assessment_submissions (id, applicant_name, applicant_email, status, score, total_questions, submitted_at)
    `)
    .eq("created_by", userId)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  return NextResponse.json({ assessments: data });
}

const FREE_ASSESSMENT_LIMIT = 1;
const FREE_APPLICANT_LIMIT = 1;

export async function POST(request: Request) {
  const body = await request.json();

  const { title, description, companyName, challengeId, userId, timeLimitMinutes, expiresAt } = body;

  if (!title || !challengeId || !userId) {
    return NextResponse.json(
      { message: "title, challengeId, userId are required" },
      { status: 400 }
    );
  }

  // 무료 사용 제한: 유저당 평가 1개
  const { count: existingCount } = await supabase
    .from("assessments")
    .select("*", { count: "exact", head: true })
    .eq("created_by", userId);

  if (existingCount !== null && existingCount >= FREE_ASSESSMENT_LIMIT) {
    return NextResponse.json(
      {
        message: "새 평가 생성을 위해선 도입문의를 신청해주세요!",
        limitReached: true
      },
      { status: 403 }
    );
  }

  const accessCode = generateAccessCode();

  const { data, error } = await supabase
    .from("assessments")
    .insert({
      title,
      description,
      company_name: companyName,
      challenge_id: challengeId,
      created_by: userId,
      access_code: accessCode,
      time_limit_minutes: timeLimitMinutes || null,
      expires_at: expiresAt || null,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  return NextResponse.json({ assessment: data, applicantLimit: FREE_APPLICANT_LIMIT });
}


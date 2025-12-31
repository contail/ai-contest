import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabaseServer";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

export async function POST() {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 1. 사용자의 답변 삭제
    await supabase
      .from("answers")
      .delete()
      .in("session_id", (
        await supabase
          .from("submission_sessions")
          .select("id")
          .eq("user_id", user.id)
      ).data?.map((s) => s.id) ?? []);

    // 2. 사용자의 세션 삭제
    await supabase
      .from("submission_sessions")
      .delete()
      .eq("user_id", user.id);

    // 3. users 테이블에서 삭제
    await supabase
      .from("users")
      .delete()
      .eq("id", user.id);

    // 4. Supabase Auth에서 사용자 삭제 (Admin API 필요)
    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(user.id);

    if (deleteError) {
      console.error("Failed to delete auth user:", deleteError);
      return NextResponse.json({ error: "Failed to delete account" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Withdraw error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}


import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";
import { getUserById } from "@/lib/auth";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

export async function GET() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("sb-access-token")?.value;
  const refreshToken = cookieStore.get("sb-refresh-token")?.value;

  if (!accessToken) {
    return NextResponse.json({ user: null });
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: { persistSession: false },
  });

  const { data: { user }, error } = await supabase.auth.getUser(accessToken);

  if (error || !user) {
    if (refreshToken) {
      const { data: refreshed } = await supabase.auth.refreshSession({
        refresh_token: refreshToken,
      });
      if (refreshed.user) {
        const profile = await getUserById(refreshed.user.id);
        return NextResponse.json({ user: profile });
      }
    }
    return NextResponse.json({ user: null });
  }

  const profile = await getUserById(user.id);
  return NextResponse.json({ user: profile });
}


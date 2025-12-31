import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createOrUpdateUser } from "@/lib/auth";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") ?? "/";

  if (code) {
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false },
    });

    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      await createOrUpdateUser(
        data.user.id,
        data.user.email ?? "",
        data.user.user_metadata?.full_name ?? data.user.user_metadata?.name
      );
    }
  }

  return NextResponse.redirect(new URL(next, requestUrl.origin));
}


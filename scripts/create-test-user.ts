import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !serviceRoleKey) {
  console.error("❌ SUPABASE_SERVICE_ROLE_KEY가 .env.local에 필요합니다.");
  console.log("\nSupabase 대시보드 → Settings → API → service_role 키를 복사해서");
  console.log(".env.local에 추가하세요:\n");
  console.log("SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here\n");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function createTestUser() {
  const email = "tester@test.com";
  const password = "tester";

  console.log(`🔧 테스트 계정 생성 중: ${email}`);

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (error) {
    if (error.message.includes("already been registered")) {
      console.log("✅ 이미 존재하는 계정입니다. 그대로 사용하세요!");
      console.log(`\n📧 Email: ${email}`);
      console.log(`🔑 Password: ${password}\n`);
      return;
    }
    console.error("❌ 생성 실패:", error.message);
    process.exit(1);
  }

  console.log("✅ 테스트 계정 생성 완료!");
  console.log(`\n📧 Email: ${email}`);
  console.log(`🔑 Password: ${password}\n`);
  console.log("User ID:", data.user?.id);
}

createTestUser();


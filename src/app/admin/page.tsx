import Header from "@/components/site/Header";
import AdminPanel from "@/components/admin/AdminPanel";
import { AdminGuard } from "@/components/auth/AdminGuard";

export default function AdminPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <AdminGuard>
        <main className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-6 pb-16 pt-8">
          <section className="border border-black/5 bg-[var(--card)] px-6 py-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Admin Console
            </p>
            <h1 className="mt-2 text-2xl font-semibold text-slate-900">
              콘테스트 관리
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              데이터셋/질문 항목/검증 정책을 업데이트합니다.
            </p>
          </section>
          <AdminPanel />
        </main>
      </AdminGuard>
    </div>
  );
}

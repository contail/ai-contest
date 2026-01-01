import Header from "@/components/site/Header";
import Link from "next/link";

export default function AssessmentLandingPage() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Header />
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-16 px-6 pb-20 pt-10">
        {/* 히어로 섹션 */}
        <section className="relative overflow-hidden rounded-[var(--radius-lg)] border border-[var(--lime-200)] bg-gradient-to-br from-[var(--lime-50)] via-white to-[var(--card)] p-10">
          <div className="absolute left-0 top-0 h-full w-1.5 bg-[var(--lime-500)]" />
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[var(--lime-100)] opacity-50 blur-3xl" />

          <div className="relative space-y-5 pl-4">
            <span className="inline-block rounded-md bg-[var(--lime-500)] px-3 py-1 text-xs font-semibold text-white">
              AI 역량 평가 솔루션
            </span>
            <h1 className="text-3xl font-bold leading-tight text-[var(--gray-900)] md:text-4xl">
              지원자의 AI 활용 역량을<br />
              <span className="text-[var(--lime-600)]">검증된 방식</span>으로 평가하세요
            </h1>
            <p className="max-w-xl text-base leading-relaxed text-[var(--gray-600)]">
              단순한 코딩 테스트를 넘어, 실제 업무 상황에서의 AI 활용 능력과
              문제 해결력을 평가합니다. 검증된 챌린지 기반의 객관적인 평가 시스템을 도입하세요.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href="/assessment/dashboard"
                className="inline-flex items-center gap-2 rounded-[var(--radius-md)] bg-[var(--gray-900)] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[var(--gray-800)]"
              >
                무료 체험하기
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <span className="text-sm text-[var(--gray-500)]">평가 1회 · 응시자 1명 무료</span>
            </div>
          </div>
        </section>

        {/* 작동 방식 */}
        <section className="space-y-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-[var(--gray-900)]">어떻게 작동하나요?</h2>
            <p className="mt-2 text-sm text-[var(--gray-500)]">3단계로 간편하게 지원자를 평가하세요</p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                step: "01",
                title: "평가 세션 생성",
                description: "평가할 챌린지를 선택하고 고유 링크를 생성합니다. 난이도와 시간 제한을 설정할 수 있습니다.",
                icon: (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                ),
              },
              {
                step: "02",
                title: "지원자 응시",
                description: "지원자에게 링크를 전달하면, 별도 회원가입 없이 바로 응시할 수 있습니다.",
                icon: (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                ),
              },
              {
                step: "03",
                title: "결과 확인",
                description: "실시간으로 점수, 소요시간, 문제별 정답률을 확인하고 비교 분석합니다.",
                icon: (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                  </svg>
                ),
              },
            ].map((item) => (
              <div
                key={item.step}
                className="relative rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--card)] p-6 transition hover:border-[var(--lime-300)] hover:shadow-md"
              >
                <div className="absolute -top-3 left-4 rounded-full bg-[var(--lime-500)] px-3 py-1 text-xs font-bold text-white">
                  STEP {item.step}
                </div>
                <div className="mb-4 mt-2 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--lime-50)] text-[var(--lime-600)]">
                  {item.icon}
                </div>
                <h3 className="mb-2 text-lg font-semibold text-[var(--gray-900)]">{item.title}</h3>
                <p className="text-sm leading-relaxed text-[var(--gray-600)]">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 특징 */}
        <section className="space-y-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-[var(--gray-900)]">왜 AI Challenge Hub인가요?</h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {[
              {
                title: "실무 중심 평가",
                description: "단순 알고리즘이 아닌, 실제 업무에서 마주치는 데이터 분석과 AI 활용 문제를 평가합니다.",
              },
              {
                title: "객관적 채점",
                description: "정해진 정답 키를 기반으로 자동 채점되어, 평가자의 주관이 개입되지 않습니다.",
              },
              {
                title: "다양한 난이도",
                description: "입문부터 전문가 레벨까지 6단계 난이도로, 직무에 맞는 평가가 가능합니다.",
              },
              {
                title: "상세 리포트",
                description: "문제별 정답률, 소요시간, 다른 지원자 대비 백분위까지 상세하게 분석합니다.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="flex gap-4 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--card)] p-5"
              >
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[var(--lime-100)]">
                  <svg className="h-4 w-4 text-[var(--lime-600)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-[var(--gray-900)]">{item.title}</h3>
                  <p className="mt-1 text-sm text-[var(--gray-600)]">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="rounded-[var(--radius-lg)] bg-[var(--gray-900)] p-10 text-center">
          <h2 className="text-2xl font-bold text-white">직접 체험해보세요</h2>
          <p className="mt-3 text-sm text-[var(--gray-400)]">
            평가 1회, 응시자 1명까지 무료로 테스트할 수 있습니다.
          </p>
          <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/assessment/dashboard"
              className="inline-flex items-center gap-2 rounded-[var(--radius-md)] bg-[var(--lime-500)] px-8 py-3 text-sm font-semibold text-white transition hover:bg-[var(--lime-600)]"
            >
              무료 체험하기
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <a
              href="mailto:contact@example.com?subject=AI Challenge Hub 평가 도입 문의"
              className="inline-flex items-center gap-2 rounded-[var(--radius-md)] border border-[var(--gray-600)] px-8 py-3 text-sm font-medium text-[var(--gray-300)] transition hover:border-[var(--gray-500)] hover:text-white"
            >
              정식 도입 문의
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}


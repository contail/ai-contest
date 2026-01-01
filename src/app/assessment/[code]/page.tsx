"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type Question = {
  id: string;
  order: number;
  type: string;
  prompt: string;
  options: string | null;
  required: boolean;
  points: number;
};

type Challenge = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  difficulty: number;
  caution_text: string | null;
  dataset_label: string | null;
  dataset_file_name: string | null;
  dataset_description: string | null;
  dataset_download_url: string | null;
  questions: Question[];
};

type Assessment = {
  id: string;
  title: string;
  description: string | null;
  company_name: string | null;
  challenge_id: string;
  time_limit_minutes: number | null;
  challenges: Challenge;
};

export default function ApplicantAssessmentPage() {
  const params = useParams();
  const router = useRouter();
  const code = params.code as string;

  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [step, setStep] = useState<"intro" | "test" | "complete">("intro");
  const [applicantName, setApplicantName] = useState("");
  const [applicantEmail, setApplicantEmail] = useState("");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ score: number; totalQuestions: number; percentage: number } | null>(null);

  useEffect(() => {
    const fetchAssessment = async () => {
      try {
        const res = await fetch(`/api/assessments/${code}`);
        if (!res.ok) {
          const data = await res.json();
          setError(data.message || "평가를 찾을 수 없습니다.");
          return;
        }
        const data = await res.json();
        setAssessment(data.assessment);
      } catch {
        setError("평가를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchAssessment();
  }, [code]);

  const handleStartTest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicantName.trim() || !applicantEmail.trim()) return;
    setStep("test");
  };

  const handleSubmit = async () => {
    if (!assessment) return;

    const unanswered = assessment.challenges.questions.filter(
      (q) => q.required && !answers[q.id]?.trim()
    );

    if (unanswered.length > 0) {
      alert(`${unanswered.length}개의 필수 문항에 답하지 않았습니다.`);
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`/api/assessments/${code}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          applicantName,
          applicantEmail,
          answers: Object.entries(answers).map(([questionId, answer]) => ({
            questionId,
            answer,
          })),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.message || "제출 중 오류가 발생했습니다.");
        return;
      }

      const data = await res.json();
      setResult(data);
      setStep("complete");
    } catch {
      alert("제출 중 오류가 발생했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--background)]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--lime-500)] border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--background)] p-6 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
          <svg className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h1 className="text-xl font-bold text-[var(--gray-900)]">접근할 수 없습니다</h1>
        <p className="mt-2 text-[var(--gray-600)]">{error}</p>
      </div>
    );
  }

  if (!assessment) return null;

  // 인트로 화면
  if (step === "intro") {
    return (
      <div className="min-h-screen bg-[var(--background)]">
        <div className="mx-auto max-w-2xl px-6 py-16">
          <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--card)] p-8 shadow-sm">
            {assessment.company_name && (
              <p className="mb-2 text-sm font-medium text-[var(--lime-600)]">{assessment.company_name}</p>
            )}
            <h1 className="text-2xl font-bold text-[var(--gray-900)]">{assessment.title}</h1>
            {assessment.description && (
              <p className="mt-3 text-sm leading-relaxed text-[var(--gray-600)]">{assessment.description}</p>
            )}

            <div className="mt-6 rounded-[var(--radius-md)] bg-[var(--gray-50)] p-4">
              <h2 className="font-semibold text-[var(--gray-900)]">{assessment.challenges.title}</h2>
              <p className="mt-1 text-sm text-[var(--gray-600)]">{assessment.challenges.subtitle}</p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                <span className="rounded-full bg-[var(--lime-100)] px-2.5 py-1 font-medium text-[var(--lime-700)]">
                  Lv.{assessment.challenges.difficulty}
                </span>
                <span className="rounded-full bg-[var(--gray-200)] px-2.5 py-1 text-[var(--gray-600)]">
                  {assessment.challenges.questions.length}문항
                </span>
                {assessment.time_limit_minutes && (
                  <span className="rounded-full bg-[var(--gray-200)] px-2.5 py-1 text-[var(--gray-600)]">
                    제한시간 {assessment.time_limit_minutes}분
                  </span>
                )}
              </div>
            </div>

            <form onSubmit={handleStartTest} className="mt-8 space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[var(--gray-700)]">이름 *</label>
                <input
                  type="text"
                  value={applicantName}
                  onChange={(e) => setApplicantName(e.target.value)}
                  placeholder="홍길동"
                  required
                  className="w-full rounded-[var(--radius-sm)] border border-[var(--border)] px-3 py-2.5 text-sm focus:border-[var(--lime-500)] focus:outline-none focus:ring-1 focus:ring-[var(--lime-500)]"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[var(--gray-700)]">이메일 *</label>
                <input
                  type="email"
                  value={applicantEmail}
                  onChange={(e) => setApplicantEmail(e.target.value)}
                  placeholder="example@email.com"
                  required
                  className="w-full rounded-[var(--radius-sm)] border border-[var(--border)] px-3 py-2.5 text-sm focus:border-[var(--lime-500)] focus:outline-none focus:ring-1 focus:ring-[var(--lime-500)]"
                />
              </div>

              <button
                type="submit"
                className="mt-6 w-full rounded-[var(--radius-md)] bg-[var(--gray-900)] py-3 text-sm font-semibold text-white transition hover:bg-[var(--gray-800)]"
              >
                평가 시작하기
              </button>
            </form>

            <p className="mt-4 text-center text-xs text-[var(--gray-400)]">
              시작 버튼을 누르면 평가가 바로 시작됩니다.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 완료 화면
  if (step === "complete" && result) {
    return (
      <div className="min-h-screen bg-[var(--background)]">
        <div className="mx-auto max-w-2xl px-6 py-16">
          <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--card)] p-8 text-center shadow-sm">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[var(--lime-100)]">
              <svg className="h-10 w-10 text-[var(--lime-600)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-[var(--gray-900)]">평가가 완료되었습니다</h1>
            <p className="mt-2 text-[var(--gray-600)]">응시해 주셔서 감사합니다.</p>

            <div className="mx-auto mt-8 max-w-xs rounded-[var(--radius-md)] bg-[var(--gray-50)] p-6">
              <p className="text-sm text-[var(--gray-500)]">나의 점수</p>
              <p className="mt-2 text-4xl font-bold text-[var(--lime-600)]">
                {result.score}<span className="text-lg text-[var(--gray-400)]">/{result.totalQuestions}</span>
              </p>
              <p className="mt-1 text-sm text-[var(--gray-500)]">정답률 {result.percentage}%</p>
            </div>

            <p className="mt-8 text-sm text-[var(--gray-500)]">
              결과는 담당자에게 전달됩니다. 창을 닫으셔도 됩니다.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 테스트 화면
  const challenge = assessment.challenges;
  const sortedQuestions = [...challenge.questions].sort((a, b) => a.order - b.order);

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* 헤더 */}
      <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-6">
          <div>
            <h1 className="text-sm font-semibold text-[var(--gray-900)]">{assessment.title}</h1>
            <p className="text-xs text-[var(--gray-500)]">{applicantName} ({applicantEmail})</p>
          </div>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="rounded-[var(--radius-sm)] bg-[var(--lime-500)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[var(--lime-600)] disabled:opacity-50"
          >
            {submitting ? "제출 중..." : "제출하기"}
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-8">
        {/* 문제 설명 */}
        <div className="mb-8 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--card)] p-6">
          <h2 className="text-lg font-bold text-[var(--gray-900)]">{challenge.title}</h2>
          <p className="mt-2 text-sm leading-relaxed text-[var(--gray-600)]">{challenge.description}</p>

          {challenge.dataset_download_url && (
            <div className="mt-4">
              <a
                href={challenge.dataset_download_url}
                className="inline-flex items-center gap-2 rounded-[var(--radius-sm)] bg-[var(--gray-800)] px-4 py-2 text-sm font-medium text-white transition hover:bg-[var(--gray-700)]"
                download
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                {challenge.dataset_file_name}
              </a>
            </div>
          )}
        </div>

        {/* 문제 목록 */}
        <div className="space-y-6">
          {sortedQuestions.map((question, index) => (
            <div
              key={question.id}
              className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--card)] p-6"
            >
              <div className="mb-4 flex items-start gap-3">
                <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-[var(--lime-100)] text-sm font-semibold text-[var(--lime-700)]">
                  {index + 1}
                </span>
                <div className="flex-1">
                  <p className="text-sm leading-relaxed text-[var(--gray-800)]">{question.prompt}</p>
                  {question.required && (
                    <span className="mt-2 inline-block text-xs text-red-500">* 필수</span>
                  )}
                </div>
              </div>

              {question.type === "SHORT" && (
                <input
                  type="text"
                  value={answers[question.id] || ""}
                  onChange={(e) => setAnswers({ ...answers, [question.id]: e.target.value })}
                  placeholder="답변을 입력하세요"
                  className="w-full rounded-[var(--radius-sm)] border border-[var(--border)] px-3 py-2.5 text-sm focus:border-[var(--lime-500)] focus:outline-none focus:ring-1 focus:ring-[var(--lime-500)]"
                />
              )}

              {question.type === "LONG" && (
                <textarea
                  value={answers[question.id] || ""}
                  onChange={(e) => setAnswers({ ...answers, [question.id]: e.target.value })}
                  placeholder="답변을 입력하세요"
                  rows={4}
                  className="w-full rounded-[var(--radius-sm)] border border-[var(--border)] px-3 py-2.5 text-sm focus:border-[var(--lime-500)] focus:outline-none focus:ring-1 focus:ring-[var(--lime-500)]"
                />
              )}

              {question.type === "CHOICE" && question.options && (
                <div className="space-y-2">
                  {JSON.parse(question.options).map((option: string, optIndex: number) => (
                    <label
                      key={optIndex}
                      className={`flex cursor-pointer items-center gap-3 rounded-[var(--radius-sm)] border p-3 transition ${
                        answers[question.id] === option
                          ? "border-[var(--lime-500)] bg-[var(--lime-50)]"
                          : "border-[var(--border)] hover:bg-[var(--gray-50)]"
                      }`}
                    >
                      <input
                        type="radio"
                        name={question.id}
                        value={option}
                        checked={answers[question.id] === option}
                        onChange={(e) => setAnswers({ ...answers, [question.id]: e.target.value })}
                        className="h-4 w-4 text-[var(--lime-500)]"
                      />
                      <span className="text-sm text-[var(--gray-700)]">{option}</span>
                    </label>
                  ))}
                </div>
              )}

              {/* CHOICE인데 options 없거나, 알 수 없는 타입일 때 기본 입력 */}
              {!["SHORT", "LONG"].includes(question.type) &&
                !(question.type === "CHOICE" && question.options) && (
                <input
                  type="text"
                  value={answers[question.id] || ""}
                  onChange={(e) => setAnswers({ ...answers, [question.id]: e.target.value })}
                  placeholder="답변을 입력하세요"
                  className="w-full rounded-[var(--radius-sm)] border border-[var(--border)] px-3 py-2.5 text-sm focus:border-[var(--lime-500)] focus:outline-none focus:ring-1 focus:ring-[var(--lime-500)]"
                />
              )}
            </div>
          ))}
        </div>

        {/* 제출 버튼 */}
        <div className="mt-8">
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full rounded-[var(--radius-md)] bg-[var(--gray-900)] py-4 text-base font-semibold text-white transition hover:bg-[var(--gray-800)] disabled:opacity-50"
          >
            {submitting ? "제출 중..." : "평가 제출하기"}
          </button>
        </div>
      </main>
    </div>
  );
}


"use client";

import Header from "@/components/site/Header";
import { useAuth } from "@/components/auth/AuthProvider";
import { LoginButton } from "@/components/auth/LoginButton";
import { useEffect, useState } from "react";
import Link from "next/link";
import { format } from "date-fns";

type Challenge = {
  id: string;
  title: string;
  difficulty: number;
};

type Submission = {
  id: string;
  applicant_name: string;
  applicant_email: string;
  status: string;
  score: number | null;
  total_questions: number | null;
  submitted_at: string | null;
};

type Assessment = {
  id: string;
  title: string;
  description: string | null;
  company_name: string | null;
  challenge_id: string;
  access_code: string;
  time_limit_minutes: number | null;
  expires_at: string | null;
  is_active: boolean;
  created_at: string;
  challenges: Challenge;
  assessment_submissions: Submission[];
};

export default function AssessmentDashboard() {
  const { user, loading: authLoading } = useAuth();
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    companyName: "",
    challengeId: "",
    timeLimitMinutes: "",
  });

  useEffect(() => {
    if (!user?.id) return;

    const fetchData = async () => {
      try {
        const [assessRes, challengeRes] = await Promise.all([
          fetch(`/api/assessments?userId=${user.id}`),
          fetch("/api/challenges"),
        ]);

        if (assessRes.ok) {
          const data = await assessRes.json();
          setAssessments(data.assessments || []);
        }

        if (challengeRes.ok) {
          const data = await challengeRes.json();
          setChallenges(data.challenges || []);
        }
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.id]);

  const [limitError, setLimitError] = useState<string | null>(null);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id || !formData.title || !formData.challengeId) return;

    setCreating(true);
    setLimitError(null);
    try {
      const res = await fetch("/api/assessments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description || null,
          companyName: formData.companyName || null,
          challengeId: formData.challengeId,
          userId: user.id,
          timeLimitMinutes: formData.timeLimitMinutes
            ? parseInt(formData.timeLimitMinutes)
            : null,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setAssessments((prev) => [
          { ...data.assessment, challenges: challenges.find((c) => c.id === formData.challengeId), assessment_submissions: [] },
          ...prev,
        ]);
        setShowCreateModal(false);
        setFormData({ title: "", description: "", companyName: "", challengeId: "", timeLimitMinutes: "" });
      } else {
        const data = await res.json();
        if (data.limitReached) {
          setLimitError(data.message);
        } else {
          alert(data.message || "오류가 발생했습니다.");
        }
      }
    } catch {
      alert("오류가 발생했습니다.");
    } finally {
      setCreating(false);
    }
  };

  const copyLink = (code: string) => {
    const url = `${window.location.origin}/assessment/${code}`;
    navigator.clipboard.writeText(url);
    alert("링크가 복사되었습니다!");
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[var(--background)]">
        <Header />
        <main className="flex items-center justify-center py-20">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-[var(--lime-500)] border-t-transparent" />
        </main>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[var(--background)]">
        <Header />
        <main className="mx-auto flex w-full max-w-5xl flex-col items-center gap-6 px-6 py-20 text-center">
          <h1 className="text-2xl font-bold text-[var(--gray-900)]">로그인이 필요합니다</h1>
          <p className="text-[var(--gray-600)]">평가 대시보드를 사용하려면 로그인해주세요.</p>
          <LoginButton redirectTo="/assessment/dashboard" />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Header />
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 pb-16 pt-10">
        {/* 헤더 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[var(--gray-900)]">평가 대시보드</h1>
            <p className="mt-1 text-sm text-[var(--gray-500)]">
              지원자 평가를 생성하고 결과를 확인하세요
            </p>
          </div>
          <div className="flex items-center gap-3">
            {assessments.length >= 1 && (
              <span className="text-xs text-[var(--gray-500)]">무료 체험 사용 중</span>
            )}
            <button
              onClick={() => setShowCreateModal(true)}
              disabled={assessments.length >= 1}
              className={`inline-flex items-center gap-2 rounded-[var(--radius-md)] px-5 py-2.5 text-sm font-semibold transition ${
                assessments.length >= 1
                  ? "cursor-not-allowed bg-[var(--gray-200)] text-[var(--gray-400)]"
                  : "bg-[var(--gray-900)] text-white hover:bg-[var(--gray-800)]"
              }`}
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              새 평가 만들기
            </button>
          </div>
        </div>

        {/* 무료 체험 제한 안내 */}
        {assessments.length >= 1 && (() => {
          const totalApplicants = assessments.reduce(
            (sum, a) => sum + (a.assessment_submissions?.length ?? 0), 0
          );
          const isTrialComplete = totalApplicants >= 1;

          return isTrialComplete ? (
            <div className="rounded-[var(--radius-md)] border border-amber-200 bg-amber-50 p-4">
              <p className="text-sm text-amber-800">
                <span className="font-semibold">무료 체험이 완료되었습니다.</span> 추가 평가 생성을 원하시면 도입 문의를 신청해주세요.
              </p>
              <a
                href="mailto:contact@example.com?subject=AI Challenge Hub 평가 도입 문의"
                className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-amber-700 underline hover:text-amber-900"
              >
                도입 문의하기 →
              </a>
            </div>
          ) : (
            <div className="rounded-[var(--radius-md)] border border-blue-200 bg-blue-50 p-4">
              <p className="text-sm text-blue-800">
                <span className="font-semibold">무료 체험 중</span> · 평가 1개 생성됨 · 응시자 1명까지 무료
              </p>
            </div>
          );
        })()}

        {/* 평가 목록 */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-[var(--lime-500)] border-t-transparent" />
          </div>
        ) : assessments.length === 0 ? (
          <div className="rounded-[var(--radius-lg)] border border-dashed border-[var(--border)] bg-[var(--card)] px-6 py-16 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--gray-100)]">
              <svg className="h-8 w-8 text-[var(--gray-400)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-[var(--gray-900)]">아직 생성된 평가가 없습니다</h3>
            <p className="mt-2 text-sm text-[var(--gray-500)]">새 평가를 만들어 지원자에게 링크를 공유하세요.</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="mt-6 inline-flex items-center gap-2 rounded-[var(--radius-md)] bg-[var(--lime-500)] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--lime-600)]"
            >
              첫 평가 만들기
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {assessments.map((assessment) => (
              <div
                key={assessment.id}
                className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--card)] p-6"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-[var(--gray-900)]">{assessment.title}</h3>
                    <p className="mt-1 text-sm text-[var(--gray-500)]">
                      {assessment.challenges?.title} · 코드: <code className="rounded bg-[var(--gray-100)] px-1.5 py-0.5 font-mono text-xs">{assessment.access_code}</code>
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {(assessment.assessment_submissions?.length ?? 0) >= 1 ? (
                      <span className="text-xs text-[var(--gray-400)]">체험 완료</span>
                    ) : (
                      <>
                        <button
                          onClick={() => copyLink(assessment.access_code)}
                          className="inline-flex items-center gap-1.5 rounded-[var(--radius-sm)] border border-[var(--border)] bg-white px-3 py-1.5 text-xs font-medium text-[var(--gray-700)] transition hover:bg-[var(--gray-50)]"
                        >
                          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                          링크 복사
                        </button>
                        <Link
                          href={`/assessment/${assessment.access_code}`}
                          target="_blank"
                          className="inline-flex items-center gap-1.5 rounded-[var(--radius-sm)] border border-[var(--border)] bg-white px-3 py-1.5 text-xs font-medium text-[var(--gray-700)] transition hover:bg-[var(--gray-50)]"
                        >
                          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                          미리보기
                        </Link>
                      </>
                    )}
                  </div>
                </div>

                {/* 응시자 목록 */}
                {assessment.assessment_submissions?.length > 0 && (
                  <div className="mt-4 border-t border-[var(--border)] pt-4">
                    <h4 className="mb-3 text-sm font-semibold text-[var(--gray-700)]">
                      응시자 ({assessment.assessment_submissions.length}명)
                    </h4>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-[var(--border)] text-left">
                            <th className="pb-2 font-medium text-[var(--gray-500)]">이름</th>
                            <th className="pb-2 font-medium text-[var(--gray-500)]">이메일</th>
                            <th className="pb-2 font-medium text-[var(--gray-500)]">상태</th>
                            <th className="pb-2 text-right font-medium text-[var(--gray-500)]">점수</th>
                            <th className="pb-2 text-right font-medium text-[var(--gray-500)]">제출일</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border)]">
                          {assessment.assessment_submissions.map((sub) => (
                            <tr key={sub.id}>
                              <td className="py-2 font-medium text-[var(--gray-900)]">{sub.applicant_name}</td>
                              <td className="py-2 text-[var(--gray-600)]">{sub.applicant_email}</td>
                              <td className="py-2">
                                <span
                                  className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                                    sub.status === "SUBMITTED"
                                      ? "bg-green-100 text-green-700"
                                      : "bg-yellow-100 text-yellow-700"
                                  }`}
                                >
                                  {sub.status === "SUBMITTED" ? "완료" : "진행중"}
                                </span>
                              </td>
                              <td className="py-2 text-right">
                                {sub.score !== null && sub.total_questions !== null ? (
                                  <span className="font-semibold text-[var(--lime-600)]">
                                    {sub.score}/{sub.total_questions}
                                  </span>
                                ) : (
                                  "-"
                                )}
                              </td>
                              <td className="py-2 text-right text-[var(--gray-500)]">
                                {sub.submitted_at
                                  ? format(new Date(sub.submitted_at), "M/d HH:mm")
                                  : "-"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {assessment.assessment_submissions?.length === 0 && (
                  <p className="mt-4 text-sm text-[var(--gray-400)]">아직 응시자가 없습니다.</p>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      {/* 생성 모달 */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-[var(--radius-lg)] bg-white p-6 shadow-xl">
            <h2 className="text-xl font-bold text-[var(--gray-900)]">새 평가 만들기</h2>
            <form onSubmit={handleCreate} className="mt-6 space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[var(--gray-700)]">
                  평가 제목 *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="예: 2024 신입 개발자 AI 역량 평가"
                  className="w-full rounded-[var(--radius-sm)] border border-[var(--border)] px-3 py-2 text-sm focus:border-[var(--lime-500)] focus:outline-none focus:ring-1 focus:ring-[var(--lime-500)]"
                  required
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-[var(--gray-700)]">
                  사용할 챌린지 *
                </label>
                <select
                  value={formData.challengeId}
                  onChange={(e) => setFormData({ ...formData, challengeId: e.target.value })}
                  className="w-full rounded-[var(--radius-sm)] border border-[var(--border)] px-3 py-2 text-sm focus:border-[var(--lime-500)] focus:outline-none focus:ring-1 focus:ring-[var(--lime-500)]"
                  required
                >
                  <option value="">챌린지를 선택하세요</option>
                  {challenges.map((c) => (
                    <option key={c.id} value={c.id}>
                      [Lv.{c.difficulty}] {c.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-[var(--gray-700)]">
                  회사/조직명
                </label>
                <input
                  type="text"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  placeholder="예: (주)피에프씨테크놀로지스"
                  className="w-full rounded-[var(--radius-sm)] border border-[var(--border)] px-3 py-2 text-sm focus:border-[var(--lime-500)] focus:outline-none focus:ring-1 focus:ring-[var(--lime-500)]"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-[var(--gray-700)]">
                  설명 (선택)
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="지원자에게 보여줄 안내 메시지"
                  rows={2}
                  className="w-full rounded-[var(--radius-sm)] border border-[var(--border)] px-3 py-2 text-sm focus:border-[var(--lime-500)] focus:outline-none focus:ring-1 focus:ring-[var(--lime-500)]"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-[var(--gray-700)]">
                  시간 제한 (분)
                </label>
                <input
                  type="number"
                  value={formData.timeLimitMinutes}
                  onChange={(e) => setFormData({ ...formData, timeLimitMinutes: e.target.value })}
                  placeholder="제한 없음"
                  min="1"
                  className="w-full rounded-[var(--radius-sm)] border border-[var(--border)] px-3 py-2 text-sm focus:border-[var(--lime-500)] focus:outline-none focus:ring-1 focus:ring-[var(--lime-500)]"
                />
              </div>

              {limitError && (
                <div className="rounded-[var(--radius-md)] border border-amber-200 bg-amber-50 p-4">
                  <p className="text-sm font-medium text-amber-800">{limitError}</p>
                  <a
                    href="mailto:contact@example.com?subject=AI Challenge Hub 평가 도입 문의"
                    className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-amber-700 underline hover:text-amber-900"
                  >
                    도입 문의하기 →
                  </a>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => { setShowCreateModal(false); setLimitError(null); }}
                  className="rounded-[var(--radius-sm)] px-4 py-2 text-sm font-medium text-[var(--gray-600)] hover:bg-[var(--gray-100)]"
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={creating || !!limitError}
                  className="rounded-[var(--radius-sm)] bg-[var(--gray-900)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[var(--gray-800)] disabled:opacity-50"
                >
                  {creating ? "생성 중..." : "평가 생성"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}


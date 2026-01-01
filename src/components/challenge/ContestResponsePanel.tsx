"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { ChallengeDetailData } from "@/lib/challengeQueries";
import { useAuth } from "@/components/auth/AuthProvider";
import QuestionListPanel from "@/components/challenge/QuestionListPanel";

type ContestResponsePanelProps = {
  challenge: ChallengeDetailData;
};

type SaveStatus = "idle" | "saving" | "saved" | "error" | "submitted";

const isNonEmpty = (value: string | string[] | null) => {
  if (Array.isArray(value)) {
    return value.length > 0;
  }
  return typeof value === "string" && value.trim().length > 0;
};

const isValidUrl = (value: string) => {
  if (!value) return true;
  return /^https?:\/\/\S+$/i.test(value.trim());
};

const validateAnswer = (
  question: ChallengeDetailData["questions"][number],
  value: string | string[] | null
) => {
  if (question.required && !isNonEmpty(value)) {
    return "필수 응답 항목입니다.";
  }

  const type = question.type.toString().toUpperCase();
  if (type === "URL") {
    if (typeof value === "string" && value.trim().length > 0) {
      return isValidUrl(value) ? null : "URL 형식을 확인하세요.";
    }
  }

  if (type === "MULTI_URL") {
    if (typeof value === "string" && value.trim().length > 0) {
      const lines = value
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);
      const invalid = lines.find((line) => !isValidUrl(line));
      return invalid ? "URL 형식을 확인하세요." : null;
    }
  }

  return null;
};

export default function ContestResponsePanel({
  challenge,
}: ContestResponsePanelProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const nickname = user?.nickname ?? user?.email?.split("@")[0] ?? "";

  const [sessionId, setSessionId] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, string | string[] | null>>(
    {}
  );
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [serverErrors, setServerErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<SaveStatus>("idle");
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const [restored, setRestored] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmChecked, setConfirmChecked] = useState(false);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const cancelButtonRef = useRef<HTMLButtonElement | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sessionCreatingRef = useRef(false);

  useEffect(() => {
    if (!user || !nickname) return;
    if (sessionCreatingRef.current) return;
    sessionCreatingRef.current = true;

    const createSession = async () => {
      try {
        const response = await fetch("/api/sessions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nickname,
            challengeId: challenge.id,
            userId: user.id,
          }),
        });
        if (!response.ok) {
          throw new Error("Failed to create session");
        }
        const data = (await response.json()) as {
          session: { id: string; status: string };
          answers: { questionId: string; payload: string | string[] | null }[];
        };
        setSessionId(data.session.id);
        const submitted = data.session.status === "SUBMITTED";
        if (submitted) {
          // 이미 제출된 경우 메인으로 리다이렉트
          router.push("/");
          return;
        }
        if (data.answers?.length) {
          const restored: Record<string, string | string[] | null> = {};
          data.answers.forEach((answer) => {
            restored[answer.questionId] = answer.payload;
          });
          setAnswers(restored);
          setRestored(true);
          setLastSavedAt(new Date());
          if (!submitted) {
            setStatus("saved");
          }
        }
      } catch {
        setStatus("error");
      }
    };

    createSession();
  }, [user, nickname, challenge.id]);

  useEffect(() => {
    return () => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }
    };
  }, []);

  const saveAnswer = useCallback(
    async (questionId: string, payload: string | string[] | null) => {
      if (!sessionId) return;
      try {
        const response = await fetch(`/api/sessions/${sessionId}/answers`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ questionId, payload }),
        });
        if (!response.ok) {
          const data = (await response.json()) as {
            message?: string;
            notAllowed?: string[];
            invalidUrl?: string;
          };
          if (data?.message) {
            if (data.message === "Dataset URL validation failed") {
              setServerErrors((prev) => ({
                ...prev,
                [questionId]:
                  "데이터셋에 포함된 URL만 입력할 수 있습니다.",
              }));
            } else if (data.message === "Invalid URL format") {
              setServerErrors((prev) => ({
                ...prev,
                [questionId]: "URL 형식을 확인하세요.",
              }));
            }
          }
          throw new Error("Failed to save");
        }
        setLastSavedAt(new Date());
        setStatus("saved");
      } catch {
        setStatus("error");
      }
    },
    [sessionId]
  );

  const handleAnswerChange = useCallback(
    (questionId: string, value: string | string[] | null) => {
      if (isSubmitted) return;
      setAnswers((prev) => ({ ...prev, [questionId]: value }));
      setTouched((prev) => ({ ...prev, [questionId]: true }));
      setServerErrors((prev) => {
        if (!prev[questionId]) return prev;
        const next = { ...prev };
        delete next[questionId];
        return next;
      });
      if (!sessionId) return;
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }
      setStatus("saving");
      saveTimerRef.current = setTimeout(() => {
        saveAnswer(questionId, value);
      }, 500);
    },
    [isSubmitted, saveAnswer, sessionId]
  );

  const requiredComplete = challenge.questions
    .filter((question) => question.required)
    .every((question) => isNonEmpty(answers[question.id] ?? null));

  const errors = challenge.questions.reduce<Record<string, string>>(
    (acc, question) => {
      const error = validateAnswer(question, answers[question.id] ?? null);
      if (error && touched[question.id]) acc[question.id] = error;
      return acc;
    },
    {}
  );

  const mergedErrors = { ...errors, ...serverErrors };

  const hasValidationErrors = Object.keys(mergedErrors).length > 0;

  const canSubmit =
    !!sessionId &&
    !!user &&
    requiredComplete &&
    !hasValidationErrors &&
    !isSubmitting &&
    !isSubmitted;

  const handleSubmit = () => {
    if (!sessionId || !canSubmit) return;
    setConfirmOpen(true);
  };

  const handleConfirmSubmit = async () => {
    if (!sessionId || !canSubmit) return;
    setConfirmOpen(false);
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/sessions/${sessionId}/submit`, {
        method: "POST",
      });
      if (!response.ok) {
        throw new Error("Failed to submit");
      }
      // 제출 완료 후 메인으로 리다이렉트
      router.push("/");
    } catch {
      setStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (!confirmOpen) {
      setConfirmChecked(false);
    }
  }, [confirmOpen]);

  useEffect(() => {
    if (!confirmOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setConfirmOpen(false);
      }
      if (event.key === "Tab" && modalRef.current) {
        const focusable = modalRef.current.querySelectorAll<HTMLElement>(
          "button, input, a"
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKeyDown);
    cancelButtonRef.current?.focus();
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [confirmOpen]);

  const inputsDisabled = !sessionId || isSubmitted || !user;
  const formattedLastSavedAt =
    lastSavedAt?.toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
    }) ?? null;

  // 로딩 중 (ChallengePageContent에서도 체크하지만, 혹시 모를 상황 대비)
  if (loading) {
    return (
      <div className="flex flex-col gap-4">
        <section className="border border-black/5 bg-[var(--card)] p-4 shadow-sm">
          <div className="h-20 animate-pulse rounded bg-slate-100" />
        </section>
      </div>
    );
  }

  // 로그인 안된 상태는 ChallengePageContent에서 처리하므로 여기선 간단히 표시
  if (!user) {
    return (
      <div className="flex flex-col gap-4">
        <QuestionListPanel
          challenge={challenge}
          answers={{}}
          onAnswerChange={() => {}}
          errors={{}}
          onSubmit={() => {}}
          inputsDisabled={true}
          submitDisabled={true}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {confirmOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
        >
          <div
            ref={modalRef}
            className="w-full max-w-sm rounded-[var(--radius-lg)] bg-white p-6 shadow-[var(--shadow-lg)]"
          >
            <p className="text-base font-bold text-[var(--gray-900)]">
              최종 제출 확인
            </p>
            <p className="mt-3 text-sm leading-relaxed text-[var(--gray-600)]">
              최종 제출 이후에는 응답을 수정할 수 없습니다. 모든 질문 항목을
              검토했는지 확인하세요.
            </p>
            <label className="mt-4 flex cursor-pointer items-start gap-3 rounded-[var(--radius-sm)] border border-[var(--border-strong)] p-3 text-sm text-[var(--gray-700)] transition hover:border-[var(--brand)]">
              <input
                type="checkbox"
                className="mt-0.5 h-4 w-4 accent-[var(--brand)]"
                checked={confirmChecked}
                onChange={(event) => setConfirmChecked(event.target.checked)}
              />
              모든 질문 항목을 검토했음을 확인합니다.
            </label>
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                className="flex-1 rounded-[var(--radius-sm)] border border-[var(--border-strong)] px-4 py-2.5 text-sm font-medium text-[var(--gray-700)] transition hover:bg-[var(--gray-50)]"
                onClick={() => setConfirmOpen(false)}
                ref={cancelButtonRef}
              >
                취소
              </button>
              <button
                type="button"
                className="flex-1 rounded-[var(--radius-sm)] bg-[var(--brand)] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--brand-dark)] disabled:bg-[var(--gray-200)] disabled:text-[var(--gray-500)]"
                onClick={handleConfirmSubmit}
                disabled={isSubmitting || !confirmChecked}
              >
                최종 제출
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {restored ? (
        <div className="flex items-center gap-2 rounded-[var(--radius-sm)] bg-[var(--lime-50)] px-4 py-3 text-sm text-[var(--lime-700)]">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          기존 응답이 복원되었습니다.
          {formattedLastSavedAt ? (
            <span className="text-xs text-[var(--lime-600)]">
              · 마지막 저장 {formattedLastSavedAt}
            </span>
          ) : null}
        </div>
      ) : null}

      {status === "error" ? (
        <div className="flex items-center gap-2 rounded-[var(--radius-sm)] bg-red-50 px-4 py-3 text-sm text-red-600">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          저장 중 문제가 발생했습니다. 네트워크 상태를 확인한 뒤 다시 입력해 주세요.
        </div>
      ) : null}

      <QuestionListPanel
        challenge={challenge}
        answers={answers}
        onAnswerChange={handleAnswerChange}
        errors={mergedErrors}
        onSubmit={handleSubmit}
        inputsDisabled={inputsDisabled}
        submitDisabled={!canSubmit}
      />
    </div>
  );
}

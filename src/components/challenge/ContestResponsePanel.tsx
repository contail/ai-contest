"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ChallengeDetailData } from "@/lib/challengeQueries";
import QuestionListPanel from "@/components/challenge/QuestionListPanel";

type ContestResponsePanelProps = {
  challenge: ChallengeDetailData;
};

type SaveStatus = "idle" | "saving" | "saved" | "error" | "submitted";

const buildStatusText = (status: SaveStatus, timeText?: string | null) => {
  switch (status) {
    case "saving":
      return "응답 저장 중";
    case "saved":
      return timeText
        ? `자동 저장됨 · ${timeText}`
        : "자동 저장됨 · 최종 제출 후 수정 불가";
    case "error":
      return "저장 실패 · 다시 시도하세요";
    case "submitted":
      return "최종 제출 완료 · 응답 수정 불가";
    default:
      return "응시 중";
  }
};

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
  const [nickname, setNickname] = useState("");
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
  const [resetOpen, setResetOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem("pfct.nickname");
    if (stored) {
      setNickname(stored);
    }
  }, []);

  useEffect(() => {
    if (!nickname) return;
    if (typeof window !== "undefined") {
      window.localStorage.setItem("pfct.nickname", nickname);
    }
  }, [nickname]);

  useEffect(() => {
    if (!nickname) return;

    const createSession = async () => {
      try {
        const response = await fetch("/api/sessions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nickname, challengeId: challenge.id }),
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
          setIsSubmitted(true);
          setStatus("submitted");
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
  }, [nickname, challenge.id]);

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
    !!nickname &&
    requiredComplete &&
    !hasValidationErrors &&
    !isSubmitting &&
    !isSubmitted;

  const submitDisabledReason = () => {
    if (!nickname) return "응시자명을 먼저 입력하세요.";
    if (!sessionId) return "응시 세션을 생성 중입니다.";
    if (!requiredComplete) return "필수 질문 항목 응답을 완료하세요.";
    if (hasValidationErrors) return "입력 형식을 확인하세요.";
    if (isSubmitting) return "최종 제출 처리 중입니다.";
    if (isSubmitted) return "최종 제출이 완료되었습니다.";
    return null;
  };

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
      setIsSubmitted(true);
      setStatus("submitted");
    } catch {
      setStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (!confirmOpen && !resetOpen) {
      setConfirmChecked(false);
    }
  }, [confirmOpen, resetOpen]);

  useEffect(() => {
    if (!confirmOpen && !resetOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setConfirmOpen(false);
        setResetOpen(false);
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
  }, [confirmOpen, resetOpen]);

  const inputsDisabled = !sessionId || isSubmitted;
  const formattedLastSavedAt =
    lastSavedAt?.toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
    }) ?? null;

  return (
    <div className="flex flex-col gap-4">
      {confirmOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4"
          role="dialog"
          aria-modal="true"
        >
          <div
            ref={modalRef}
            className="w-full max-w-md border border-slate-200 bg-white p-6 shadow-lg"
          >
            <p className="text-sm font-semibold text-slate-900">
              최종 제출 확인
            </p>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              최종 제출 이후에는 응답을 수정할 수 없습니다. 모든 질문 항목을
              검토했는지 확인하세요.
            </p>
            <label className="mt-4 flex items-start gap-2 text-sm text-slate-600">
              <input
                type="checkbox"
                className="mt-1 h-4 w-4 accent-[var(--brand)]"
                checked={confirmChecked}
                onChange={(event) => setConfirmChecked(event.target.checked)}
              />
              모든 질문 항목을 검토했음을 확인합니다.
            </label>
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                className="border border-slate-200 px-4 py-2 text-sm text-slate-600"
                onClick={() => setConfirmOpen(false)}
                ref={cancelButtonRef}
              >
                취소
              </button>
              <button
                type="button"
                className="bg-[var(--brand)] px-4 py-2 text-sm font-semibold text-white"
                onClick={handleConfirmSubmit}
                disabled={isSubmitting || !confirmChecked}
              >
                최종 제출
              </button>
            </div>
          </div>
        </div>
      ) : null}
      {resetOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4"
          role="dialog"
          aria-modal="true"
        >
          <div
            ref={modalRef}
            className="w-full max-w-md border border-slate-200 bg-white p-6 shadow-lg"
          >
            <p className="text-sm font-semibold text-slate-900">
              응답 초기화 요청
            </p>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              이 작업은 응시자 본인 요청만으로 즉시 반영되지 않습니다. 담당자
              확인 후 초기화가 진행됩니다.
            </p>
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                className="border border-slate-200 px-4 py-2 text-sm text-slate-600"
                onClick={() => setResetOpen(false)}
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      ) : null}
      <section className="border border-black/5 bg-[var(--card)] p-4 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          응시자 정보
        </p>
        <div className="mt-3 flex flex-col gap-2 md:flex-row md:items-center">
          <label className="text-sm text-slate-600 md:w-32">응시자명</label>
          <input
            type="text"
            value={nickname}
            onChange={(event) => setNickname(event.target.value)}
            placeholder="닉네임을 입력하세요."
            className="w-full border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-[var(--brand)] focus:outline-none focus:ring-1 focus:ring-[var(--brand)]/30"
          />
        </div>
        <p className="mt-2 text-xs text-slate-500">
          응시자명은 세션 식별 목적으로만 사용됩니다.
        </p>
      </section>

      {restored ? (
        <div className="border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
          기존 응답이 복원되었습니다.
          {formattedLastSavedAt ? (
            <span className="ml-2 text-xs text-emerald-800">
              마지막 저장 {formattedLastSavedAt}
            </span>
          ) : null}
        </div>
      ) : null}

      {status === "error" ? (
        <div className="border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          저장 중 문제가 발생했습니다. 네트워크 상태를 확인한 뒤 다시
          입력해 주세요.
        </div>
      ) : null}

      <section className="border border-black/5 bg-[var(--card)] px-4 py-4 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          응시 정책
        </p>
        <p className="mt-2 text-sm text-slate-600">
          최종 제출 이후에는 응답 수정이 제한되며, 재응시는 별도 안내에
          따릅니다.
        </p>
        <div className="mt-3 flex items-center gap-3 text-sm text-slate-600">
          <span>응시 상태</span>
          <span className="border border-slate-200 px-2 py-1 text-xs">
            {isSubmitted ? "최종 제출 완료" : "응시 중"}
          </span>
        </div>
        <button
          type="button"
          className="mt-4 border border-slate-200 px-3 py-2 text-xs text-slate-600"
          onClick={() => setResetOpen(true)}
          disabled={!sessionId || isSubmitted}
        >
          응답 초기화 요청
        </button>
      </section>

      <QuestionListPanel
        challenge={challenge}
        answers={answers}
        onAnswerChange={handleAnswerChange}
        errors={mergedErrors}
        statusText={
          submitDisabledReason() ?? buildStatusText(status, formattedLastSavedAt)
        }
        onSubmit={handleSubmit}
        inputsDisabled={inputsDisabled}
        submitDisabled={!canSubmit}
      />
    </div>
  );
}

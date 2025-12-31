"use client";

import { useState } from "react";

type SessionResetButtonProps = {
  sessionId: string;
  nickname: string;
};

export default function SessionResetButton({
  sessionId,
  nickname,
}: SessionResetButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isReset, setIsReset] = useState(false);

  const handleReset = async () => {
    if (!confirm(`"${nickname}"의 응시 기록을 초기화하시겠습니까?\n\n모든 답변이 삭제되고 다시 응시할 수 있습니다.`)) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/sessions/${sessionId}/reset`, {
        method: "POST",
      });
      if (response.ok) {
        setIsReset(true);
      } else {
        alert("초기화에 실패했습니다.");
      }
    } catch {
      alert("네트워크 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isReset) {
    return (
      <span className="rounded-[var(--radius-sm)] bg-[var(--lime-50)] px-2 py-1 text-xs font-medium text-[var(--lime-700)]">
        초기화됨
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={handleReset}
      disabled={isLoading}
      className="rounded-[var(--radius-sm)] border border-red-200 bg-red-50 px-2 py-1 text-xs font-medium text-red-600 transition hover:bg-red-100 disabled:opacity-50"
    >
      {isLoading ? "처리 중..." : "초기화"}
    </button>
  );
}


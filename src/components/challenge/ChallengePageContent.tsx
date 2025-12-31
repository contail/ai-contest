"use client";

import { useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { LoginButton } from "@/components/auth/LoginButton";
import ChallengeIntroPanel from "@/components/challenge/ChallengeIntroPanel";
import ChallengeLayout from "@/components/challenge/ChallengeLayout";
import ContestResponsePanel from "@/components/challenge/ContestResponsePanel";
import type { ChallengeDetailData } from "@/lib/challengeQueries";

type ChallengePageContentProps = {
  challenge: ChallengeDetailData;
};

export default function ChallengePageContent({
  challenge,
}: ChallengePageContentProps) {
  const { user, loading, signInWithPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsLoggingIn(true);

    const { error } = await signInWithPassword(email, password);
    if (error) {
      setLoginError("로그인 실패: 아이디 또는 비밀번호를 확인하세요.");
    }
    setIsLoggingIn(false);
  };

  // 로딩 중
  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--gray-200)] border-t-[var(--brand)]" />
      </div>
    );
  }

  // 로그인 안된 상태 - 로그인 화면만 표시
  if (!user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="w-full max-w-sm rounded-[var(--radius-lg)] border border-[var(--border)] bg-white p-8 shadow-[var(--shadow-lg)]">
          <div className="flex items-center justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--lime-100)]">
              <svg
                className="h-8 w-8 text-[var(--lime-600)]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
          </div>
          <p className="mt-5 text-center text-lg font-bold text-[var(--gray-900)]">
            로그인이 필요합니다
          </p>
          <p className="mt-2 text-center text-sm text-[var(--gray-500)]">
            콘테스트에 응시하려면 로그인하세요.
          </p>

          {/* ID/PW 로그인 폼 */}
          <form onSubmit={handlePasswordLogin} className="mt-6 space-y-3">
            <input
              type="text"
              placeholder="아이디 (이메일)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-[var(--radius-sm)] border border-[var(--border)] px-3 py-2.5 text-sm focus:border-[var(--brand)] focus:outline-none"
            />
            <input
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-[var(--radius-sm)] border border-[var(--border)] px-3 py-2.5 text-sm focus:border-[var(--brand)] focus:outline-none"
            />
            {loginError && (
              <p className="text-xs text-red-500">{loginError}</p>
            )}
            <button
              type="submit"
              disabled={isLoggingIn || !email || !password}
              className="w-full rounded-[var(--radius-sm)] bg-[var(--brand)] py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
            >
              {isLoggingIn ? "로그인 중..." : "로그인"}
            </button>
          </form>

          <div className="my-4 flex items-center gap-3">
            <div className="h-px flex-1 bg-[var(--border)]" />
            <span className="text-xs text-[var(--gray-400)]">또는</span>
            <div className="h-px flex-1 bg-[var(--border)]" />
          </div>

          <LoginButton
            redirectTo={`/challenge/${challenge.id}`}
            fullWidth
          >
            Google로 로그인
          </LoginButton>
        </div>
      </div>
    );
  }

  // 로그인된 상태 - 정상 표시
  return (
    <ChallengeLayout
      left={
        <div className="md:h-full md:overflow-y-auto md:pr-2">
          <ChallengeIntroPanel challenge={challenge} />
        </div>
      }
      right={
        <div className="md:h-full md:overflow-y-auto md:pl-2">
          <ContestResponsePanel challenge={challenge} />
        </div>
      }
    />
  );
}


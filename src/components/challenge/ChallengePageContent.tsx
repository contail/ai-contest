"use client";

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
  const { user, loading } = useAuth();

  // 로딩 중
  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--gray-200)] border-t-[var(--brand)]" />
      </div>
    );
  }

  // 로그인 안된 상태 - 전체 딤 처리 + 모달
  if (!user) {
    return (
      <div className="relative">
        {/* 로그인 유도 오버레이 */}
        <div className="absolute inset-0 z-20 flex items-start justify-center bg-[var(--background)]/50 pt-24">
          <div className="w-full max-w-sm rounded-[var(--radius-lg)] bg-white p-6 shadow-[var(--shadow-lg)]">
            <div className="flex items-center justify-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--lime-100)]">
                <svg
                  className="h-7 w-7 text-[var(--lime-600)]"
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
            <p className="mt-4 text-center text-base font-bold text-[var(--gray-900)]">
              로그인이 필요합니다
            </p>
            <p className="mt-2 text-center text-sm text-[var(--gray-500)]">
              콘테스트에 응시하려면 Google 계정으로 로그인하세요.
            </p>
            <div className="mt-6">
              <LoginButton
                redirectTo={`/challenge/${challenge.id}`}
                fullWidth
              >
                Google로 로그인
              </LoginButton>
            </div>
          </div>
        </div>

        {/* 딤 처리된 콘텐츠 미리보기 */}
        <div className="pointer-events-none select-none opacity-70">
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


"use client";

import { useState, useRef, useEffect } from "react";
import { useAuth } from "./AuthProvider";
import { LoginButton } from "./LoginButton";

export function UserMenu() {
  const { user, loading, signOut, signInWithPassword, withdraw } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showWithdrawConfirm, setShowWithdrawConfirm] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleWithdraw = async () => {
    setIsWithdrawing(true);
    await withdraw();
    setIsWithdrawing(false);
  };

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsLoggingIn(true);
    const { error } = await signInWithPassword(email, password);
    if (error) {
      setLoginError("로그인 실패");
    } else {
      setShowDropdown(false);
    }
    setIsLoggingIn(false);
  };

  if (loading) {
    return (
      <div className="h-9 w-24 animate-pulse rounded bg-slate-200" />
    );
  }

  if (!user) {
    return (
      <div className="relative flex items-center gap-2" ref={dropdownRef}>
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="rounded-[var(--radius-sm)] border border-[var(--border)] bg-white px-3 py-2 text-xs font-medium text-[var(--gray-600)] transition hover:bg-[var(--gray-50)]"
        >
          ID 로그인
        </button>
        <LoginButton />

        {showDropdown && (
          <div className="absolute right-0 top-full z-[9999] mt-2 w-64 rounded-[var(--radius-md)] border border-[var(--border)] bg-white p-4 shadow-xl">
            <form onSubmit={handlePasswordLogin} className="space-y-3">
              <input
                type="text"
                placeholder="tester@test.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-[var(--radius-sm)] border border-[var(--border)] px-3 py-2 text-sm focus:border-[var(--brand)] focus:outline-none"
              />
              <input
                type="password"
                placeholder="비밀번호"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-[var(--radius-sm)] border border-[var(--border)] px-3 py-2 text-sm focus:border-[var(--brand)] focus:outline-none"
              />
              {loginError && (
                <p className="text-xs text-red-500">{loginError}</p>
              )}
              <button
                type="submit"
                disabled={isLoggingIn || !email || !password}
                className="w-full rounded-[var(--radius-sm)] bg-[var(--brand)] py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
              >
                {isLoggingIn ? "로그인 중..." : "로그인"}
              </button>
            </form>
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      <div className="relative flex items-center gap-3" ref={userMenuRef}>
        <button
          onClick={() => setShowUserMenu(!showUserMenu)}
          className="flex items-center gap-2 rounded-[var(--radius-sm)] border border-[var(--border)] bg-white px-3 py-2 text-sm font-medium text-slate-900 transition hover:bg-slate-50"
        >
          {user.nickname ?? user.email.split("@")[0]}
          {user.role === "admin" && (
            <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-xs text-emerald-600">
              관리자
            </span>
          )}
          <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {showUserMenu && (
          <div className="absolute right-0 top-full z-[9999] mt-2 w-40 overflow-hidden rounded-[var(--radius-md)] border border-[var(--border)] bg-white shadow-lg">
            <button
              onClick={signOut}
              className="w-full px-4 py-2.5 text-left text-sm text-slate-700 transition hover:bg-slate-50"
            >
              로그아웃
            </button>
            <button
              onClick={() => {
                setShowUserMenu(false);
                setShowWithdrawConfirm(true);
              }}
              className="w-full border-t border-[var(--border)] px-4 py-2.5 text-left text-sm text-red-600 transition hover:bg-red-50"
            >
              회원 탈퇴
            </button>
          </div>
        )}
      </div>

      {/* 탈퇴 확인 모달 */}
      {showWithdrawConfirm && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/50">
          <div className="w-full max-w-sm rounded-[var(--radius-lg)] bg-white p-6 shadow-xl">
            <h3 className="text-lg font-bold text-[var(--gray-900)]">
              회원 탈퇴
            </h3>
            <p className="mt-2 text-sm text-[var(--gray-600)]">
              정말 탈퇴하시겠습니까? 탈퇴 시 모든 데이터가 삭제되며 복구할 수 없습니다.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowWithdrawConfirm(false)}
                className="flex-1 rounded-[var(--radius-sm)] border border-[var(--border)] bg-white py-2.5 text-sm font-medium text-[var(--gray-700)] transition hover:bg-[var(--gray-50)]"
              >
                취소
              </button>
              <button
                onClick={handleWithdraw}
                disabled={isWithdrawing}
                className="flex-1 rounded-[var(--radius-sm)] bg-red-600 py-2.5 text-sm font-medium text-white transition hover:bg-red-700 disabled:opacity-50"
              >
                {isWithdrawing ? "처리 중..." : "탈퇴하기"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}


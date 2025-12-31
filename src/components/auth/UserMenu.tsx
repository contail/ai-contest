"use client";

import { useState, useRef, useEffect } from "react";
import { useAuth } from "./AuthProvider";
import { LoginButton } from "./LoginButton";

export function UserMenu() {
  const { user, loading, signOut, signInWithPassword } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
    <div className="flex items-center gap-3">
      <div className="text-right">
        <p className="text-sm font-medium text-slate-900">
          {user.nickname ?? user.email.split("@")[0]}
        </p>
        {user.role === "admin" && (
          <p className="text-xs text-emerald-600">관리자</p>
        )}
      </div>
      <button
        onClick={signOut}
        className="border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-600 transition hover:bg-slate-50"
      >
        로그아웃
      </button>
    </div>
  );
}


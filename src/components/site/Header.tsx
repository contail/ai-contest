"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { UserMenu } from "@/components/auth/UserMenu";
import { LoginButton } from "@/components/auth/LoginButton";

const navItems = [
  { label: "챌린지", href: "/", adminOnly: false },
  { label: "리더보드", href: "/leaderboard", adminOnly: false },
  // { label: "지원자 평가", href: "/assessment", adminOnly: false }, // 임시 비활성화
  { label: "결과 요약", href: "/results", adminOnly: true },
  { label: "관리자", href: "/admin", adminOnly: true },
];

export default function Header() {
  const { user, loading, signOut } = useAuth();
  const isAdmin = user?.role === "admin";
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const visibleNavItems = navItems.filter(
    (item) => !item.adminOnly || isAdmin
  );

  return (
    <header className="relative z-[9999] w-full border-b border-black/5 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 md:h-16 md:px-6">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm font-semibold tracking-[0.1em] text-slate-900 md:text-base md:tracking-[0.14em]"
        >
          <span className="border-b-2 border-[var(--brand)] pb-1">AI Challenge</span>
          <span className="hidden text-xs font-medium text-slate-500 sm:inline">
            Hub
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 text-sm text-slate-600 md:flex">
          {visibleNavItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="transition hover:text-slate-900 hover:underline hover:decoration-[var(--brand)] hover:underline-offset-8"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {/* Desktop: UserMenu */}
          <div className="hidden md:block">
            <UserMenu />
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-md text-slate-600 hover:bg-slate-100 md:hidden"
            aria-label="메뉴 열기"
          >
            {mobileMenuOpen ? (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="absolute left-0 right-0 top-full border-b border-black/5 bg-white shadow-lg md:hidden">
          <nav className="mx-auto flex max-w-6xl flex-col px-4 py-3">
            {visibleNavItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="border-b border-slate-100 py-3 text-sm font-medium text-slate-700 transition last:border-b-0 hover:text-[var(--brand)]"
              >
                {item.label}
              </Link>
            ))}

            {/* Mobile Login Section */}
            {!loading && !user && (
              <div className="mt-3 flex flex-col gap-2 border-t border-slate-100 pt-4">
                <LoginButton fullWidth>Google 로그인</LoginButton>
              </div>
            )}

            {/* Mobile User Info */}
            {!loading && user && (
              <div className="mt-3 border-t border-slate-100 pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-900">
                    {user.nickname ?? user.email.split("@")[0]}
                    {user.role === "admin" && (
                      <span className="ml-2 rounded bg-emerald-100 px-1.5 py-0.5 text-xs text-emerald-600">
                        관리자
                      </span>
                    )}
                  </span>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      signOut();
                    }}
                    className="rounded-md px-3 py-1.5 text-sm text-slate-600 transition hover:bg-slate-100"
                  >
                    로그아웃
                  </button>
                </div>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}

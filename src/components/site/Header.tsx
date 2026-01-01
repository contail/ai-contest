"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { UserMenu } from "@/components/auth/UserMenu";

const navItems = [
  { label: "챌린지", href: "/", adminOnly: false },
  { label: "리더보드", href: "/leaderboard", adminOnly: false },
  { label: "지원자 평가", href: "/assessment", adminOnly: false },
  { label: "결과 요약", href: "/results", adminOnly: true },
  { label: "관리자", href: "/admin", adminOnly: true },
];

export default function Header() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const visibleNavItems = navItems.filter(
    (item) => !item.adminOnly || isAdmin
  );

  return (
    <header className="relative z-[9999] w-full border-b border-black/5 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link
          href="/"
          className="flex items-center gap-2 text-base font-semibold tracking-[0.14em] text-slate-900"
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

          <UserMenu />
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="absolute left-0 right-0 top-full border-b border-black/5 bg-white shadow-lg md:hidden">
          <nav className="mx-auto flex max-w-6xl flex-col px-6 py-4">
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
          </nav>
        </div>
      )}
    </header>
  );
}

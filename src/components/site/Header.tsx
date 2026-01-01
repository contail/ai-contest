"use client";

import Link from "next/link";
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

  const visibleNavItems = navItems.filter(
    (item) => !item.adminOnly || isAdmin
  );

  return (
    <header className="relative z-[9999] w-full border-b border-black/5 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link
          href="/"
          className="flex items-center gap-3 text-base font-semibold tracking-[0.14em] text-slate-900"
        >
          <span className="border-b-2 border-[var(--brand)] pb-1">AI Challenge</span>
          <span className="text-xs font-medium text-slate-500">
            Hub
          </span>
        </Link>
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
        <UserMenu />
      </div>
    </header>
  );
}

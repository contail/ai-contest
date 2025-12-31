"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-[var(--border)] bg-[var(--gray-50)]">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <p className="text-xs text-[var(--gray-500)]">
          © {new Date().getFullYear()} AI Challenge Hub. All rights reserved.
        </p>
        <nav className="flex items-center gap-4 text-xs text-[var(--gray-500)]">
          <Link
            href="/terms"
            className="transition hover:text-[var(--gray-700)] hover:underline"
          >
            이용약관
          </Link>
          <Link
            href="/privacy"
            className="transition hover:text-[var(--gray-700)] hover:underline"
          >
            개인정보처리방침
          </Link>
        </nav>
      </div>
    </footer>
  );
}


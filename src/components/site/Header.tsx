import Link from "next/link";

const navItems = [
  { label: "콘테스트 목록", href: "/" },
  { label: "결과 요약", href: "/results" },
  { label: "관리자", href: "/admin" },
];

export default function Header() {
  return (
    <header className="w-full border-b border-black/5 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link
          href="/"
          className="flex items-center gap-3 text-base font-semibold tracking-[0.14em] text-slate-900"
        >
          <span className="border-b-2 border-[var(--brand)] pb-1">PFCT</span>
          <span className="text-xs font-medium text-slate-500">
            AI Contest Lab
          </span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-slate-600 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="transition hover:text-slate-900 hover:underline hover:decoration-[var(--brand)] hover:underline-offset-8"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-600">
            응시자
          </div>
        </div>
      </div>
    </header>
  );
}

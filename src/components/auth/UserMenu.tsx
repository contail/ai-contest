"use client";

import { useAuth } from "./AuthProvider";
import { LoginButton } from "./LoginButton";

export function UserMenu() {
  const { user, loading, signOut } = useAuth();

  if (loading) {
    return (
      <div className="h-9 w-24 animate-pulse rounded bg-slate-200" />
    );
  }

  if (!user) {
    return <LoginButton />;
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


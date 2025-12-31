"use client";

import { ReactNode } from "react";
import { useAuth } from "./AuthProvider";
import { LoginButton } from "./LoginButton";

type AdminGuardProps = {
  children: ReactNode;
};

export function AdminGuard({ children }: AdminGuardProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-t-slate-600" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-md px-6 py-16 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
          접근 제한
        </p>
        <h1 className="mt-3 text-xl font-semibold text-slate-900">
          로그인이 필요합니다
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          이 페이지에 접근하려면 로그인해주세요.
        </p>
        <div className="mt-6">
          <LoginButton />
        </div>
      </div>
    );
  }

  if (user.role !== "admin") {
    return (
      <div className="mx-auto max-w-md px-6 py-16 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-rose-500">
          접근 거부
        </p>
        <h1 className="mt-3 text-xl font-semibold text-slate-900">
          관리자 권한이 필요합니다
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          이 페이지는 관리자만 접근할 수 있습니다.
        </p>
        <p className="mt-4 text-xs text-slate-500">
          현재 로그인: {user.email}
        </p>
      </div>
    );
  }

  return <>{children}</>;
}


"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
} from "react";
import { supabaseClient } from "@/lib/supabaseClient";

type User = {
  id: string;
  email: string;
  name: string | null;
  nickname: string | null;
  role: "user" | "admin";
} | null;

type AuthContextType = {
  user: User;
  loading: boolean;
  signInWithGoogle: (redirectTo?: string) => Promise<void>;
  signInWithPassword: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  withdraw: () => Promise<{ error: string | null }>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signInWithGoogle: async () => {},
  signInWithPassword: async () => ({ error: null }),
  signOut: async () => {},
  withdraw: async () => ({ error: null }),
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = useCallback(async (authUser: { id: string; email?: string; user_metadata?: { full_name?: string; name?: string } }) => {
    try {
      const res = await fetch("/api/auth/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: authUser.id,
          email: authUser.email ?? "",
          name: authUser.user_metadata?.full_name ?? authUser.user_metadata?.name ?? null,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      } else {
        setUser({
          id: authUser.id,
          email: authUser.email ?? "",
          name: authUser.user_metadata?.full_name ?? authUser.user_metadata?.name ?? null,
          nickname: authUser.email?.split("@")[0] ?? null,
          role: "user",
        });
      }
    } catch {
      setUser({
        id: authUser.id,
        email: authUser.email ?? "",
        name: authUser.user_metadata?.full_name ?? authUser.user_metadata?.name ?? null,
        nickname: authUser.email?.split("@")[0] ?? null,
        role: "user",
      });
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      // OAuth 콜백인 경우 (해시에 access_token 포함)
      const isOAuthCallback = window.location.hash?.includes("access_token");

      if (isOAuthCallback) {
        // Supabase가 해시를 처리할 시간을 줌
        await new Promise(r => setTimeout(r, 300));

        // 세션 확인
        const { data: { session } } = await supabaseClient.auth.getSession();

        if (session?.user) {
          // 해시 제거하고 강제 새로고침 - 가장 확실한 방법
          const cleanUrl = window.location.pathname + window.location.search;
          window.location.replace(cleanUrl);
          return;
        }
      }

      // 일반 페이지 로드
      const { data: { session } } = await supabaseClient.auth.getSession();

      if (mounted) {
        if (session?.user) {
          await fetchUserProfile(session.user);
        }
        setLoading(false);
      }
    };

    // Auth state 변경 리스너
    const { data: { subscription } } = supabaseClient.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        if (event === "SIGNED_IN" && session?.user) {
          await fetchUserProfile(session.user);
          setLoading(false);
        } else if (event === "SIGNED_OUT") {
          setUser(null);
          setLoading(false);
        } else if (event === "TOKEN_REFRESHED" && session?.user) {
          await fetchUserProfile(session.user);
        }
      }
    );

    initAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [fetchUserProfile]);

  const signInWithGoogle = async (redirectTo?: string) => {
    const callbackUrl = `${window.location.origin}${redirectTo ?? "/"}`;

    await supabaseClient.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: callbackUrl,
      },
    });
  };

  const signInWithPassword = async (email: string, password: string) => {
    const { error } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      return { error: error.message };
    }
    return { error: null };
  };

  const signOut = async () => {
    await supabaseClient.auth.signOut({ scope: "global" });
    setUser(null);
    window.location.href = "/";
  };

  const withdraw = async () => {
    try {
      const { data: { session } } = await supabaseClient.auth.getSession();
      if (!session?.access_token) {
        return { error: "로그인이 필요합니다." };
      }

      const res = await fetch("/api/auth/withdraw", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${session.access_token}`,
        },
      });
      if (!res.ok) {
        return { error: "탈퇴 처리 중 오류가 발생했습니다." };
      }
      await supabaseClient.auth.signOut({ scope: "global" });
      setUser(null);
      window.location.href = "/";
      return { error: null };
    } catch {
      return { error: "탈퇴 처리 중 오류가 발생했습니다." };
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signInWithPassword, signOut, withdraw }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

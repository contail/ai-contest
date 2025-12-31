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
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signInWithGoogle: async () => {},
  signInWithPassword: async () => ({ error: null }),
  signOut: async () => {},
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
    const initAuth = async () => {
      try {
        const { data: { session } } = await supabaseClient.auth.getSession();
        if (session?.user) {
          await fetchUserProfile(session.user);
        }
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    const { data: { subscription } } = supabaseClient.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" && session?.user) {
          await fetchUserProfile(session.user);
        } else if (event === "SIGNED_OUT") {
          setUser(null);
        }
      }
    );

    return () => subscription.unsubscribe();
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
    await supabaseClient.auth.signOut();
    setUser(null);
    window.location.href = "/";
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signInWithPassword, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

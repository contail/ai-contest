import { supabase } from "./supabaseServer";

export type UserProfile = {
  id: string;
  email: string;
  name: string | null;
  nickname: string | null;
  role: "user" | "admin";
  createdAt: string;
};

export async function getUserById(id: string): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from("users")
    .select("id,email,name,nickname,role,created_at")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) return null;

  return {
    id: data.id,
    email: data.email,
    name: data.name,
    nickname: data.nickname,
    role: data.role as "user" | "admin",
    createdAt: data.created_at,
  };
}

export async function createOrUpdateUser(
  id: string,
  email: string,
  name?: string | null
): Promise<UserProfile | null> {
  const nickname = email.split("@")[0];

  const { data: existing } = await supabase
    .from("users")
    .select("id,role")
    .eq("id", id)
    .maybeSingle();

  if (existing) {
    const { data, error } = await supabase
      .from("users")
      .update({ email, name, nickname })
      .eq("id", id)
      .select("id,email,name,nickname,role,created_at")
      .single();

    if (error || !data) return null;
    return {
      id: data.id,
      email: data.email,
      name: data.name,
      nickname: data.nickname,
      role: data.role as "user" | "admin",
      createdAt: data.created_at,
    };
  }

  const { data, error } = await supabase
    .from("users")
    .insert({ id, email, name, nickname, role: "user" })
    .select("id,email,name,nickname,role,created_at")
    .single();

  if (error || !data) return null;
  return {
    id: data.id,
    email: data.email,
    name: data.name,
    nickname: data.nickname,
    role: data.role as "user" | "admin",
    createdAt: data.created_at,
  };
}

export function isAdmin(user: UserProfile | null): boolean {
  return user?.role === "admin";
}


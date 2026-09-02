"use client";

import { createClient } from "../supabase/client";

export type UpdateProfileInput = {
  firstName: string;
  lastName: string;
  username: string;
  title: string;
  bio: string;
};

export const updateProfile = async (
  input: UpdateProfileInput,
): Promise<{ error?: string }> => {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "You must be signed in to upload" };

  const username = input.username.trim().replace(/^@/, "");
  if (!username) return { error: "Username cannot be empty." };
  if (!input.firstName.trim()) return { error: "First name cannot be empty." };

  const { error } = await supabase
    .from("profiles")
    .update({
      first_name: input.firstName.trim(),
      last_name: input.lastName.trim(),
      username,
      title: input.title.trim(),
      bio: input.bio.trim(),
    })
    .eq("id", user.id);

  if (error) {
    if (error.code === "23505") {
      return { error: "That username is already taken." };
    }
    return { error: error.message };
  }

  return {};
};

export const setProfilePhotoUrl = async (
  target: "avatar" | "cover",
  url: string,
): Promise<{ error?: string }> => {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "You must be signed in." };

  const { error } = await supabase
    .from("profiles")
    .update(target === "avatar" ? { avatar_url: url } : { cover_url: url })
    .eq("id", user.id);

  if (error) return { error: error.message };

  return {};
};

export const saveDailyReflection = async (
  text: string,
): Promise<{ error?: string }> => {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "You must be signed in." };

  const { error } = await supabase
    .from("profiles")
    .update({ daily_reflection: text.trim() })
    .eq("id", user.id);

  if (error) return { error: error.message };

  return {};
};

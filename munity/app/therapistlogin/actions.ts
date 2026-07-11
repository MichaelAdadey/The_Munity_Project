"use server";

import { redirect } from "next/navigation";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { createClient } from "@/lib/supabase/server";
import { routes } from "@/lib/routes";

export type TherapistLoginState = { error?: string } | undefined;

export async function signInAsTherapist(
  _prev: TherapistLoginState,
  formData: FormData,
): Promise<TherapistLoginState> {
  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");

  if (!email || !password) {
    return { error: "Please enter your email and password." };
  }

  if (!isSupabaseConfigured()) {
    redirect(routes.therapistDashboard);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) return { error: error.message };
  redirect(routes.therapistDashboard);
}

export async function signInWithGoogleAsTherapistLogin(): Promise<void> {
  if (!isSupabaseConfigured()) {
    redirect(routes.therapistDashboard);
  }

  const supabase = await createClient();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${siteUrl}/auth/callback?next=${encodeURIComponent(routes.therapistDashboard)}`,
    },
  });

  if (error) {
    redirect(`${routes.therapistLogin}?error=${encodeURIComponent(error.message)}`);
  }
  if (data.url) redirect(data.url);
}

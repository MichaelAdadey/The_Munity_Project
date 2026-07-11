"use server";

import { redirect } from "next/navigation";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { createClient } from "@/lib/supabase/server";
import { routes } from "@/lib/routes";

export type TherapistSignupState = { error?: string } | undefined;

const therapistOnboardingPath = routes.therapistOnboarding.basicInfo;

export async function signUpAsTherapist(
  _prev: TherapistSignupState,
  formData: FormData,
): Promise<TherapistSignupState> {
  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");

  if (!email || !password) {
    return { error: "Please enter your email and password." };
  }

  if (!isSupabaseConfigured()) {
    redirect(therapistOnboardingPath);
  }

  const supabase = await createClient();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { role: "therapist" },
      emailRedirectTo: `${siteUrl}${therapistOnboardingPath}`,
    },
  });

  if (error) return { error: error.message };
  redirect(therapistOnboardingPath);
}

export async function signInWithGoogleAsTherapist(): Promise<void> {
  if (!isSupabaseConfigured()) {
    redirect(therapistOnboardingPath);
  }

  const supabase = await createClient();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${siteUrl}/auth/callback?next=${encodeURIComponent(therapistOnboardingPath)}`,
    },
  });

  if (error) {
    redirect(`${routes.therapistSignup}?error=${encodeURIComponent(error.message)}`);
  }
  if (data.url) redirect(data.url);
}

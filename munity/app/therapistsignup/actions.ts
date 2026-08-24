"use server";

import { redirect } from "next/navigation";
import { getMockAccountByRole } from "@/lib/mock-credentials";
import { setMockSession } from "@/lib/mock-session";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { createClient } from "@/lib/supabase/server";
import { authErrorMessage } from "@/lib/auth/error-messages";
import { routes } from "@/lib/routes";

export type TherapistSignupState = { error?: string; success?: string } | undefined;

const therapistOnboardingPath = routes.therapistOnboarding.basicInfo;

/** Create a therapist account without redirecting (used during onboarding). */
export async function createTherapistAccount(
  formData: FormData,
): Promise<TherapistSignupState> {
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");

  if (!email || !password) {
    return { error: "Please enter your email and password." };
  }

  if (password.length < 8) {
    return { error: "Password must be at least 8 characters." };
  }

  if (!isSupabaseConfigured()) {
    const account = getMockAccountByRole("therapist");
    await setMockSession({
      ...account,
      email: email.toLowerCase() || account.email,
    });
    return undefined;
  }

  const supabase = await createClient();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { role: "therapist" },
      emailRedirectTo: `${siteUrl}/auth/callback?next=${encodeURIComponent(therapistOnboardingPath)}`,
    },
  });

  if (error) {
    return {
      error: authErrorMessage(
        error,
        "Signup failed. Supabase could not save the new user — check your Supabase Auth/Postgres logs (this is usually the on_auth_user_created trigger on auth.users or a constraint on public.profiles).",
      ),
    };
  }

  // If email confirmation is ON, there's no session yet — the therapist
  // must check their inbox and click the link before onboarding can start.
  if (!data.session) {
    return {
      success:
        "Account created. Check your email to confirm your address, then log back in to continue onboarding.",
    };
  }

  return undefined;
}

export async function signUpAsTherapist(
  _prev: TherapistSignupState,
  formData: FormData,
): Promise<TherapistSignupState> {
  const result = await createTherapistAccount(formData);
  if (result?.error) return result;
  if (result?.success) return result;
  redirect(therapistOnboardingPath);
}

export async function signInWithGoogleAsTherapist(): Promise<void> {
  if (!isSupabaseConfigured()) {
    await setMockSession(getMockAccountByRole("therapist"));
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

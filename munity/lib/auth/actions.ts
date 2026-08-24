/**
 * Auth Server Actions — this is the "backend logic" for signup/login.
 *
 * In Next.js you usually do NOT need a separate /backend folder.
 * Put mutations here (or under app/api/...) and keep UI in components/.
 *
 * "use server" marks every exported function as callable from the client
 * via a form action or an event handler.
 */

"use server";

import { redirect } from "next/navigation";
import { createClient } from "../supabase/server";
import { isSupabaseConfigured } from "../supabase/client";
import { clearMockSession } from "../mock-session";
import { authErrorMessage } from "./error-messages";
import { USER_ROLES } from "./roles";
import { loginSchema, patientSignupSchema } from "../validations/auth";
import { UserRole } from "@/types/auth";

/** Shape we return to the form so the UI can show field/server errors. */
export type AuthActionState = {
  error?: string;
  success?: string;
};

/**
 * Patient signup
 * 1) Validate form fields with Zod
 * 2) Create auth user in Supabase (email + password)
 * 3) Store first/last name + role in user metadata
 * 4) A DB trigger copies that into public.profiles (see SQL migration)
 */

export const signUpPatient = async (
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> => {
  // Pull raw strings from the HTML form
  const raw = {
    firstName: String(formData.get("firstName") ?? ""),
    lastName: String(formData.get("lastName") ?? ""),
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
  };

  // Validate before touching the network
  const parsed = patientSignupSchema.safeParse(raw);
  if (!parsed.success) {
    // Show the first validation message
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const { firstName, lastName, email, password } = parsed.data;
  const supabase = await createClient();

  // signUp creates auth.users; options.data becomes raw_user_meta_data
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name: firstName,
        last_name: lastName,
        role: USER_ROLES.PATIENT,
      },
      // The confirmation link comes back to /auth/callback which exchanges
      // the code for a session, then sends the member straight to /home.
      emailRedirectTo: `${siteUrl}/auth/callback?next=${encodeURIComponent("/home")}`,
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

  // If email confirmation is ON in Supabase, the user must check their inbox.
  // If it's OFF, they are already signed in — redirect them to home/dashboard.
  if (!data.session) {
    return {
      success: "Account created. Check your email to confirm, then log in",
    };
  }

  redirect("/home");
};

/**
 * Login (email + password)
 * Works for any role; after login you can check profiles.role and route them.
 */

export const signIn = async (
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> => {
  const raw = {
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
  };

  const parsed = loginSchema.safeParse(raw);
  if (!parsed.success) {
    // Show the first validation message
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    return { error: error.message };
  }

  if (!data.user) {
    return { error: "Login failed. No user returned."}
  }

  // Route by role (admins should use /admin/login, but handle if they use this form)
  const role = await getProfileRole(supabase, data.user.id);
  if (role === USER_ROLES.ADMIN) {
    redirect("/admin");
  } else if (role === USER_ROLES.THERAPIST) {
    redirect("/therapistdashboard")
  }

  // Successful login → leave the auth pages
  // Later: look up role and send patients/therapists/admins to different homes
  redirect("/home");
};

export const signInAdmin = async (
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> => {
  const raw = {
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
  };

  const parsed = loginSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    return { error: error.message };
  }

  //   const role = await getProfileRole(data.user.id);
  if (!data.user) {
    return { error: "Login failed. No user returned." };
  }

  // IMPORTANT: reuse this same client (session is already in memory).
  // Creating a new client here can miss cookies and make the profile
  // query return null under RLS — which looks like "stuck on login".
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", data.user.id)
    .maybeSingle();

  if (profileError) {
    await supabase.auth.signOut();
    return { error: `Could not read profiles: ${profileError.message}` };
  }

  if (!profile) {
    await supabase.auth.signOut();
    return {
      error:
        "No profile row for this user. Create the Auth user, then run the admin seed UPDATE.",
    };
  }

  if (profile.role !== USER_ROLES.ADMIN) {
    // Wrong portal — clear the session so they don't stay "logged in" as admin
    await supabase.auth.signOut();
    return {
      error: `This account is not an admin (current role: ${profile.role}).`,
    };
  }

  redirect("/admin");
};


export const signInTherapist = async (
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> => {
  const raw = {
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
  };

  const parsed = loginSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    return { error: error.message };
  }

  //   const role = await getProfileRole(data.user.id);
  if (!data.user) {
    return { error: "Login failed. No user returned." };
  }

  // IMPORTANT: reuse this same client (session is already in memory).
  // Creating a new client here can miss cookies and make the profile
  // query return null under RLS — which looks like "stuck on login".
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", data.user.id)
    .maybeSingle();

  if (profileError) {
    await supabase.auth.signOut();
    return { error: `Could not read profiles: ${profileError.message}` };
  }

  if (!profile) {
    await supabase.auth.signOut();
    return {
      error:
        "No profile row for this user. Create the Auth user, then run the admin seed UPDATE.",
    };
  }

  if (profile.role !== USER_ROLES.THERAPIST) {
    // Wrong portal — clear the session so they don't stay "logged in" as therapist
    await supabase.auth.signOut();
    return {
      error: `This account is not a therapist (current role: ${profile.role}).`,
    };
  }

  redirect("/therapistdashboard");
};

/**
 * Read role from public.profiles for the signed-in user.
 * Returns null if the row is missing (shouldn't happen if the trigger ran).
 */
const getProfileRole = async (
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
): Promise<UserRole | null> => {
  const { data, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .maybeSingle();

  if (error || !data) return null;

  return data.role as UserRole;
};

/** Sign out and clear the session cookies (Supabase + preview mock). */
export const signOut = async () => {
  await clearMockSession();
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }
  redirect("/login");
};

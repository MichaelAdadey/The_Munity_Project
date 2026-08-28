/**
 * Shared auth / user types for the whole team.
 *
 * Keep role + profile shapes here so app pages, components, and lib/
 * all import from one place instead of redefining strings.
 */

/** The three user types in Munity. Start with "patient"; add others later. */

export type UserRole = "patient" | "therapist" | "admin";

/**
 * One row in the public.profiles table (created by our SQL migration).
 * This is app-level user data; passwords live only in Supabase Auth.
 */

export type Profile = {
  id: string; // matched auth.users.id (UUID)
  first_name: string;
  last_name: string;
  email: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
  username?: string | null;
  title?: string | null;
  bio?: string | null;
  avatar_url?: string | null;
  cover_url?: string | null;
  daily_reflection?: string | null;
};

/** Fields the patient signup form collects (before we call Supabase). */
export type PatientSignupInput = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

/** Fields the login form collects (all roles can reuse this later). */
export type LoginInput = {
  email: string;
  password: string;
};

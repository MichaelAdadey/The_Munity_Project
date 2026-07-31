/**
 * Zod schemas for auth forms.
 *
 * Why Zod? Catch bad input on the server (and optionally on the client)
 * before we hit Supabase — clearer errors for the user.
 */

import { z } from "zod";

/** Patient signup: first name, last name, email, password */
export const patientSignupSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, "First name is required")
    .max(50, "First name is too long"),
  lastName: z
    .string()
    .trim()
    .min(1, "Last name is required")
    .max(50, "Last name is too long"),
  email: z.email("Enter a valid email"),
  // Supabase default minimum is often 6; raise this if we require more.
  password: z.string().min(6, "Password must be at least 6 characters"),
});

/** Login: email + password only (shared by all roles later) */
export const loginSchema = z.object({
  email: z.email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

export type PatientSignupSchema = z.infer<typeof patientSignupSchema>;
export type LoginSchema = z.infer<typeof loginSchema>;

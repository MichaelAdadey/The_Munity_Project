/**
 * Role helpers — small constants so we never typo "patient" vs "Patient".
 * Import USER_ROLES.PATIENT instead of writing the string by hand.
 */

import type { UserRole } from "@/types/auth";

export const USER_ROLES = {
  PATIENT: "patient",
  THERAPIST: "therapist",
  ADMIN: "admin",
} as const satisfies Record<string, UserRole>;

/** True if the given role is a patient (useful when protecting routes later). */
export const isPatient = (role: UserRole | null | undefined): boolean => {
  return role === USER_ROLES.PATIENT;
};

export const isAdmin = (role: UserRole | null | undefined): boolean => {
  return role === USER_ROLES.ADMIN;
};

export const isTherapist = (role: UserRole | null | undefined): boolean => {
  return role === USER_ROLES.THERAPIST;
};

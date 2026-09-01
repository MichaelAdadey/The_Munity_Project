import { createClient } from "../supabase/server";

/**
 * "not-submitted" covers therapists with no therapist_details row yet — the
 * onboarding upsert only runs once the final (payout) step is submitted.
 */
export type CredentialVerificationStatus =
  | "not-submitted"
  | "in-review"
  | "verified"
  | "rejected";

export type CredentialStatus = {
  status: CredentialVerificationStatus;
  /** When the application was submitted (therapist_details row created). */
  submittedAt: string | null;
};

/** Real verification lifecycle for a therapist, read from therapist_details. */
export async function getCredentialStatus(therapistId: string): Promise<CredentialStatus> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("therapist_details")
    .select("verification_status, created_at")
    .eq("profile_id", therapistId)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) return { status: "not-submitted", submittedAt: null };

  return {
    status: (data.verification_status as CredentialVerificationStatus) ?? "in-review",
    submittedAt: data.created_at as string,
  };
}

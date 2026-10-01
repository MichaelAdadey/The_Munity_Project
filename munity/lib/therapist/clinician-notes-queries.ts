import { createClient } from "../supabase/server";

export type ClinicianNote = {
  body: string;
  updatedAt: string;
};

/**
 * The therapist's private scratchpad for one patient — never shown to the patient.
 * One row per (therapist, patient) pair; requires the `clinician_notes` table
 * (see supabase/manual-setup.sql).
 */
export async function getClinicianNoteForPatient(
  therapistId: string,
  patientId: string,
): Promise<ClinicianNote | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("clinician_notes")
    .select("body, updated_at")
    .eq("therapist_id", therapistId)
    .eq("patient_id", patientId)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) return null;

  return { body: data.body as string, updatedAt: data.updated_at as string };
}

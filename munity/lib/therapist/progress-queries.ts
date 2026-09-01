import { createClient } from "../supabase/server";
import { buildProgress, type BookingRow, type PatientProgress } from "./progress-shared";

export type { PatientProgress, AttendanceSession, SessionsBucket } from "./progress-shared";

/** Real session/attendance metrics for one patient, scoped to a date range — feeds the Progress page. */
export async function getPatientProgress(
  therapistId: string,
  patientId: string,
  rangeStart: Date,
  rangeEnd: Date,
): Promise<PatientProgress> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("bookings")
    .select("id, scheduled_at, status")
    .eq("therapist_id", therapistId)
    .eq("patient_id", patientId)
    .gte("scheduled_at", rangeStart.toISOString())
    .lte("scheduled_at", rangeEnd.toISOString())
    .order("scheduled_at", { ascending: true });

  if (error) throw new Error(error.message);

  return buildProgress((data ?? []) as BookingRow[], rangeStart, rangeEnd);
}

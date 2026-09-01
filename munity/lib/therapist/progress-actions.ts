"use client";

import { createClient } from "../supabase/client";
import { buildProgress, type BookingRow, type PatientProgress } from "./progress-shared";

/** Client-side refetch used when the therapist changes the date-range filter. */
export const fetchPatientProgress = async (
  patientId: string,
  rangeStart: Date,
  rangeEnd: Date,
): Promise<PatientProgress> => {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("You must be signed in to view progress");

  const { data, error } = await supabase
    .from("bookings")
    .select("id, scheduled_at, status")
    .eq("therapist_id", user.id)
    .eq("patient_id", patientId)
    .gte("scheduled_at", rangeStart.toISOString())
    .lte("scheduled_at", rangeEnd.toISOString())
    .order("scheduled_at", { ascending: true });

  if (error) throw new Error(error.message);

  return buildProgress((data ?? []) as BookingRow[], rangeStart, rangeEnd);
};

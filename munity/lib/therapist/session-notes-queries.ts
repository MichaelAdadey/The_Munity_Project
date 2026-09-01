import { createClient } from "../supabase/server";

export type SessionNote = {
  id: string;
  patientId: string;
  title: string;
  body: string;
  sessionDate: string;
  createdAt: string;
};

type SessionNoteRow = {
  id: string;
  patient_id: string;
  title: string;
  body: string;
  session_date: string;
  created_at: string;
};

function toSessionNote(row: SessionNoteRow): SessionNote {
  return {
    id: row.id,
    patientId: row.patient_id,
    title: row.title,
    body: row.body,
    sessionDate: row.session_date,
    createdAt: row.created_at,
  };
}

/** Every session note this therapist has written, across their caseload — feeds the Sessions overview. */
export async function getSessionNotesForTherapist(therapistId: string): Promise<SessionNote[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("session_notes")
    .select("id, patient_id, title, body, session_date, created_at")
    .eq("therapist_id", therapistId)
    .order("session_date", { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []).map(toSessionNote);
}

/** Session notes for one patient, scoped to this therapist. */
export async function getSessionNotesForPatient(
  therapistId: string,
  patientId: string,
): Promise<SessionNote[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("session_notes")
    .select("id, patient_id, title, body, session_date, created_at")
    .eq("therapist_id", therapistId)
    .eq("patient_id", patientId)
    .order("session_date", { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []).map(toSessionNote);
}

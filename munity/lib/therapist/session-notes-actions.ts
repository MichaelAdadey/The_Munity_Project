"use client";

import { createClient } from "../supabase/client";
import type { SessionNote } from "./session-notes-queries";

/** Creates a new session note for a patient. */
export const createSessionNote = async (input: {
  patientId: string;
  title: string;
  body: string;
  sessionDate: string;
}): Promise<SessionNote> => {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("You must be signed in to save a session note");

  const { data, error } = await supabase
    .from("session_notes")
    .insert({
      therapist_id: user.id,
      patient_id: input.patientId,
      title: input.title,
      body: input.body,
      session_date: input.sessionDate,
    })
    .select("id, patient_id, title, body, session_date, created_at")
    .single();

  if (error) throw new Error(error.message);

  return {
    id: data.id,
    patientId: data.patient_id,
    title: data.title,
    body: data.body,
    sessionDate: data.session_date,
    createdAt: data.created_at,
  };
};

/** Edits an existing session note's title/body. */
export const updateSessionNote = async (
  noteId: string,
  patch: { title: string; body: string },
): Promise<void> => {
  const supabase = createClient();
  const { error } = await supabase
    .from("session_notes")
    .update({ title: patch.title, body: patch.body })
    .eq("id", noteId);

  if (error) throw new Error(error.message);
};

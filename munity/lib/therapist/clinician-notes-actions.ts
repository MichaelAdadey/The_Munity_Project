"use client";

import { createClient } from "../supabase/client";

/** Saves (creates or overwrites) the therapist's private draft note for a patient. */
export const saveClinicianNote = async (patientId: string, body: string): Promise<void> => {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("You must be signed in to save this note");

  const { error } = await supabase.from("clinician_notes").upsert(
    {
      therapist_id: user.id,
      patient_id: patientId,
      body,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "therapist_id,patient_id" },
  );

  if (error) throw new Error(error.message);
};

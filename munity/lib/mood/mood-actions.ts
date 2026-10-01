"use client";

import { createClient } from "@/lib/supabase/client";
import type { Mood } from "@/lib/types";

/** Logs a mood check-in for the signed-in patient. Requires `mood_entries` (see supabase/manual-setup.sql). */
export const saveMoodCheckin = async (mood: Mood, note?: string): Promise<void> => {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("You must be signed in to log a check-in");

  const { error } = await supabase.from("mood_entries").insert({
    user_id: user.id,
    mood,
    note: note?.trim() || null,
  });

  if (error) throw new Error(error.message);
};

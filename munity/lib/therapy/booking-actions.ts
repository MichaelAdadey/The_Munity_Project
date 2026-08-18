"use client";

import { createClient } from "../supabase/client";

export type CreateBookingInput = {
  therapistId: string;
  scheduledAt: string;
  sessionType?: "video" | "chat";
};

export const createBooking = async ({
  therapistId,
  scheduledAt,
  sessionType = "video",
}: CreateBookingInput): Promise<void> => {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("You must be signed in to book a session");
  }

  const { error } = await supabase.from("bookings").insert({
    patient_id: user.id,
    therapist_id: therapistId,
    scheduled_at: scheduledAt,
    session_type: sessionType,
  });

  if (error) throw new Error(error.message);
};

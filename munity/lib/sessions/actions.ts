"use client";

import { createClient } from "../supabase/client";

export const setBookingPriority = async (
  bookingId: string,
  priority: "low" | "normal" | "high" | "urgent",
): Promise<void> => {
  const supabase = createClient();

  const { error } = await supabase
    .from("bookings")
    .update({ priority })
    .eq("id", bookingId);
  if (error) throw new Error(error.message);
};

export const archiveBooking = async (bookingId: string): Promise<void> => {
  const supabase = createClient();

  const { error } = await supabase
    .from("bookings")
    .update({ archived: true })
    .eq("id", bookingId);
  if (error) throw new Error(error.message);
};

export const unarchiveBooking = async (bookingId: string): Promise<void> => {
  const supabase = createClient();

  const { error } = await supabase
    .from("bookings")
    .update({ archived: false })
    .eq("id", bookingId);
  if (error) throw new Error(error.message);
};

export async function cancelBooking(bookingId: string): Promise<void> {
  const supabase = createClient();

  const { data: booking } = await supabase
    .from("bookings")
    .select("therapist_id, patient_id")
    .eq("id", bookingId)
    .maybeSingle();

  const { error } = await supabase
    .from("bookings")
    .update({ status: "cancelled" })
    .eq("id", bookingId);
  if (error) throw new Error(error.message);

  if (booking?.therapist_id) {
    const { data: patientProfile } = await supabase
      .from("profiles")
      .select("first_name, last_name")
      .eq("id", booking.patient_id)
      .maybeSingle();
    const patientName = patientProfile
      ? `${patientProfile.first_name} ${patientProfile.last_name}`.trim()
      : "A patient";

    await supabase.from("notifications").insert({
      recipient_id: booking.therapist_id,
      type: "booking_cancelled",
      title: "Session cancelled",
      body: `${patientName} cancelled their upcoming session.`,
      href: "/therapistappointments",
    });
  }
}

export const deleteBooking = async (bookingId: string): Promise<void> => {
  const supabase = createClient();

  const { error } = await supabase
    .from("bookings")
    .delete()
    .eq("id", bookingId);
  if (error) throw new Error(error.message);
};

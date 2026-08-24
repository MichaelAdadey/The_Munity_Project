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

export const cancelBooking = async (bookingId: string): Promise<void> => {
  const supabase = createClient();

  const { error } = await supabase
    .from("bookings")
    .update({ status: "cancelled" })
    .eq("id", bookingId);
  if (error) throw new Error(error.message);
};

export const deleteBooking = async (bookingId: string): Promise<void> => {
  const supabase = createClient();

  const { error } = await supabase
    .from("bookings")
    .delete()
    .eq("id", bookingId);
  if (error) throw new Error(error.message);
};

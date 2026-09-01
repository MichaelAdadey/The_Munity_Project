"use client";

import { createClient } from "../supabase/client";
import type { AppointmentItem } from "./appointments-queries";

const FALLBACK_AVATAR = "/images/profile/avatar.jpg";

/** Therapist accepts a pending booking request. */
export const acceptBooking = async (bookingId: string): Promise<void> => {
  const supabase = createClient();
  const { error } = await supabase
    .from("bookings")
    .update({ status: "confirmed" })
    .eq("id", bookingId)
    .eq("status", "pending");
  if (error) throw new Error(error.message);
};

/** Cancels a pending or confirmed booking (also used to decline a request). */
export const cancelBooking = async (bookingId: string): Promise<void> => {
  const supabase = createClient();
  const { error } = await supabase
    .from("bookings")
    .update({ status: "cancelled" })
    .eq("id", bookingId)
    .in("status", ["pending", "confirmed"]);
  if (error) throw new Error(error.message);
};

/** Marks a confirmed session as completed once it has taken place. */
export const completeBooking = async (bookingId: string): Promise<void> => {
  const supabase = createClient();
  const { error } = await supabase
    .from("bookings")
    .update({ status: "completed" })
    .eq("id", bookingId)
    .eq("status", "confirmed");
  if (error) throw new Error(error.message);
};

/** Moves a pending or confirmed booking to a new time. */
export const rescheduleBooking = async (bookingId: string, scheduledAt: string): Promise<void> => {
  const supabase = createClient();
  const { error } = await supabase
    .from("bookings")
    .update({ scheduled_at: scheduledAt })
    .eq("id", bookingId)
    .in("status", ["pending", "confirmed"]);
  if (error) throw new Error(error.message);
};

/** All bookings (any status) for this therapist within a date range — feeds the calendar view. */
export const fetchAppointmentsForRange = async (
  rangeStart: string,
  rangeEnd: string,
): Promise<AppointmentItem[]> => {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data: bookingsRaw, error } = await supabase
    .from("bookings")
    .select("id, scheduled_at, status, session_type, patient_id")
    .eq("therapist_id", user.id)
    .gte("scheduled_at", rangeStart)
    .lte("scheduled_at", rangeEnd)
    .order("scheduled_at", { ascending: true });

  if (error) throw new Error(error.message);

  const bookings = bookingsRaw ?? [];
  const patientIds = Array.from(
    new Set(bookings.map((b) => b.patient_id).filter((id): id is string => !!id)),
  );

  const { data: profiles } =
    patientIds.length > 0
      ? await supabase.from("profiles").select("id, first_name, last_name, avatar_url").in("id", patientIds)
      : { data: [] as { id: string; first_name: string; last_name: string; avatar_url: string | null }[] };

  const nameById = new Map((profiles ?? []).map((p) => [p.id, `${p.first_name} ${p.last_name}`.trim()]));
  const avatarById = new Map((profiles ?? []).map((p) => [p.id, p.avatar_url]));
  const now = new Date();

  return bookings.map((booking) => {
    const scheduledAt = new Date(booking.scheduled_at as string);
    return {
      bookingId: booking.id as string,
      name: nameById.get(booking.patient_id as string) || "Unknown Patient",
      patientId: (booking.patient_id as string) ?? "",
      avatar: avatarById.get(booking.patient_id as string) || FALLBACK_AVATAR,
      type: (booking.session_type ?? "video") as "video" | "chat",
      status: booking.status as AppointmentItem["status"],
      scheduledAt: booking.scheduled_at as string,
      time: scheduledAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isToday: scheduledAt.toDateString() === now.toDateString(),
      isPast: scheduledAt.getTime() < now.getTime(),
    };
  });
};

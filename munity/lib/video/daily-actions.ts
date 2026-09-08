"use server";

import { createClient } from "@/lib/supabase/server";

const DAILY_API_BASE = "https://api.daily.co/v1";

type DailyRoomResponse = {
  url: string;
  name: string;
};

export async function getOrCreateVideoRoom(
  bookingId: string,
): Promise<{ url?: string; error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "You must be signed in." };

  const { data: booking, error: fetchError } = await supabase
    .from("bookings")
    .select(
      "id, patient_id, therapist_id, video_room_url, session_type, status",
    )
    .eq("id", bookingId)
    .maybeSingle();

  if (fetchError) return { error: fetchError.message };
  if (!booking) return { error: "Booking not found." };

  if (booking.patient_id !== user.id && booking.therapist_id !== user.id) {
    return { error: "You are not part of this booking." };
  }

  if (booking.session_type !== "video") {
    return { error: "This booking isn't a video session." };
  }

  if (booking.video_room_url) {
    return { url: booking.video_room_url as string };
  }

  const apiKey = process.env.DAILY_API_KEY;
  if (!apiKey) return { error: "Video calling isn't configured yet." };

  const response = await fetch(`${DAILY_API_BASE}/rooms`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: `booking-${booking.id}`,
      properties: {
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 6,
        enable_chat: true,
        enable_screenshare: true,
      },
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    return { error: `Couldn't create video room: ${body}` };
  }

  const room = (await response.json()) as DailyRoomResponse;

  const { error: updateError } = await supabase
    .from("bookings")
    .update({ video_room_url: room.url })
    .eq("id", booking.id);

  if (updateError) return { error: updateError.message };

  return { url: room.url };
}

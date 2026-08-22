"use client";

import { createClient } from "../supabase/client";
import {
  WeekDay,
  weekDays,
  type WeeklyAvailability,
} from "../therapist-availability";

export const fetchMyAvailability = async (): Promise<WeeklyAvailability> => {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const empty: WeeklyAvailability = {
    Mon: [],
    Tue: [],
    Wed: [],
    Thu: [],
    Fri: [],
    Sat: [],
    Sun: [],
  };
  if (!user) return empty;

  const { data, error } = await supabase
    .from("availability_slots")
    .select("day_of_week, time_slot")
    .eq("therapist_id", user.id)
    .eq("is_active", true);

  if (error) throw new Error(error.message);

  const result: WeeklyAvailability = { ...empty };
  for (const row of data ?? []) {
    const day = row.day_of_week as WeekDay;
    if (weekDays.includes(day)) {
      result[day] = [...result[day], row.time_slot as string];
    }
  }
  return result;
};

export const saveMyAvailability = async (
  availability: WeeklyAvailability,
): Promise<void> => {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("You must be signed in to save availability");

  const { error: deleteError } = await supabase
    .from("availability_slots")
    .delete()
    .eq("therapist_id", user.id);
  if (deleteError) throw new Error(deleteError.message);

  const rows = weekDays.flatMap((day) =>
    availability[day].map((timeSlot) => ({
      therapist_id: user.id,
      day_of_week: day,
      time_slot: timeSlot,
      is_active: true,
    })),
  );

  if (rows.length === 0) return;

  const { error: insertError } = await supabase
    .from("availability_slots")
    .insert(rows);
  if (insertError) throw new Error(insertError.message);
};

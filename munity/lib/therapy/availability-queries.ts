"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "../supabase/client";
import {
  bookingScheduledAt,
  formatDayLabel,
  timeSlots,
  weekdayFromDate,
  weekDays,
  type WeekDay,
} from "../therapist-availability";

export type BookableDay = {
  day: WeekDay;
  date: Date;
  label: string;
  slots: string[];
};

export const getUpcomingBookableDays = async (
  therapistId: string,
  from = new Date(),
): Promise<BookableDay[]> => {
  const supabase = createClient();

  const start = new Date(from);
  start.setHours(0, 0, 0, 0);
  const rangeEnd = new Date(start);
  rangeEnd.setDate(rangeEnd.getDate() + 14);

  const [
    { data: slotsRaw, error: slotsError },
    { data: bookingsRaw, error: bookingsError },
  ] = await Promise.all([
    supabase
      .from("availability_slots")
      .select("day_of_week, time_slot")
      .eq("therapist_id", therapistId)
      .eq("is_active", true),
    supabase
      .from("bookings")
      .select("scheduled_at")
      .eq("therapist_id", therapistId)
      .in("status", ["confirmed", "pending"])
      .gte("scheduled_at", start.toISOString())
      .lte("scheduled_at", rangeEnd.toISOString()),
  ]);

  if (slotsError) throw new Error(slotsError.message);
  if (bookingsError) throw new Error(bookingsError.message);

  const bookedTimestamps = new Set(
    (bookingsRaw ?? []).map((b) =>
      new Date(b.scheduled_at as string).getTime(),
    ),
  );

  const slotsByDay = new Map<WeekDay, string[]>();
  for (const day of weekDays) slotsByDay.set(day, []);
  for (const slot of slotsRaw ?? []) {
    const day = slot.day_of_week as WeekDay;
    if (slotsByDay.has(day)) {
      slotsByDay.get(day)!.push(slot.time_slot as string);
    }
  }
  for (const day of weekDays) {
    slotsByDay
      .get(day)!
      .sort(
        (a, b) =>
          timeSlots.indexOf(a as (typeof timeSlots)[number]) -
          timeSlots.indexOf(b as (typeof timeSlots)[number]),
      );
  }

  const days: BookableDay[] = [];
  for (let offset = 0; offset < 14 && days.length < 7; offset += 1) {
    const date = new Date(start);
    date.setDate(start.getDate() + offset);
    const day = weekdayFromDate(date);
    const daySlots = slotsByDay.get(day) ?? [];

    const openSlots = daySlots.filter((time) => {
      const scheduledAt = new Date(bookingScheduledAt(date, time)).getTime();
      return !bookedTimestamps.has(scheduledAt);
    });

    if (openSlots.length === 0) continue;
    days.push({
      day,
      date,
      label: formatDayLabel(date, day),
      slots: openSlots,
    });
  }

  return days;
};

export const useBookableDays = (therapistId: string, open: boolean) => {
  const [bookableDays, setBookableDays] = useState<BookableDay[]>([]);
  const [selectedDayKey, setSelectedDayKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const refreshDays = useCallback(() => {
    void (async () => {
      setLoading(true);
      setLoadError(null);
      try {
        const days = await getUpcomingBookableDays(therapistId);
        setBookableDays(days);
        setSelectedDayKey((current) => {
          if (current && days.some((day) => day.label === current))
            return current;
          return days[0]?.label ?? null;
        });
      } catch (err) {
        setLoadError(
          err instanceof Error ? err.message : "Couldn't load availability",
        );
        setBookableDays([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [therapistId]);

  useEffect(() => {
    if (!open) return;
    // Defer so setState is NOT synchronous in the effect
    const timer = window.setTimeout(() => {
      refreshDays();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [open, refreshDays]);

  return {
    bookableDays,
    selectedDayKey,
    setSelectedDayKey,
    loading,
    loadError,
    refreshDays,
  };
};

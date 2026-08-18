"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createClient } from "../supabase/client";

export type MyBooking = {
  id: string;
  therapistId: string;
  scheduledAt: string;
  status: string;
};

export const fetchMyBookings = async (): Promise<MyBooking[]> => {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from("bookings")
    .select("id, therapist_id, scheduled_at, status")
    .eq("patient_id", user.id)
    .gte("scheduled_at", new Date().toISOString())
    .order("scheduled_at", { ascending: true });

  if (error) throw new Error(error.message);

  return (data ?? []).map((row) => ({
    id: row.id as string,
    therapistId: row.therapist_id as string,
    scheduledAt: row.scheduled_at as string,
    status: row.status as string,
  }));
};

export const useMyBookings = (flash: (message: string) => void) => {
  const [bookings, setBookings] = useState<MyBooking[]>([]);
  const [loading, setLoading] = useState(true);

  const flashRef = useRef(flash);
  useEffect(() => {
    flashRef.current = flash;
  }, [flash]);

  const refresh = useCallback(() => {
    void (async () => {
      try {
        const data = await fetchMyBookings();
        setBookings(data);
      } catch (error) {
        flashRef.current(
          error instanceof Error ? error.message : "Failed to load bookings",
        );
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      refresh();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [refresh]);

  return { bookings, loading, refresh };
};

export const formatExistingBookingWhen = (scheduledAt: string): string => {
  const date = new Date(scheduledAt);
  const day = date.toLocaleDateString(undefined, {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
  const time = date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${day}, ${time}`;
};

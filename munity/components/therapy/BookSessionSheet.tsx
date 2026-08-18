"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Calendar, Check, Clock3, X } from "lucide-react";
import {
  AVAILABILITY_UPDATED_EVENT,
  bookingScheduledAt,
  formatBookingWhen,
  getUpcomingBookableDays,
  type BookableDay,
} from "@/lib/therapist-availability";

type BookSessionSheetProps = {
  open: boolean;
  onClose: () => void;
  therapistId: string;
  therapistName: string;
  rate: number;
  alreadyBooked: boolean;
  latestBookingWhen?: string | null;
  onConfirm: (booking: { when: string; scheduledAt: string }) => void;
};

export function BookSessionSheet({
  open,
  onClose,
  therapistId,
  therapistName,
  rate,
  alreadyBooked,
  latestBookingWhen,
  onConfirm,
}: BookSessionSheetProps) {
  const [bookableDays, setBookableDays] = useState<BookableDay[]>([]);
  const [selectedDayKey, setSelectedDayKey] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  function refreshDays() {
    const days = getUpcomingBookableDays(therapistId);
    setBookableDays(days);
    setSelectedDayKey((current) => {
      if (current && days.some((day) => day.label === current)) return current;
      return days[0]?.label ?? null;
    });
  }

  useEffect(() => {
    if (!open) return;
    refreshDays();
    setSelectedTime(null);

    function handleUpdate(event: Event) {
      const detail = (event as CustomEvent<{ therapistId?: string }>).detail;
      if (detail?.therapistId && detail.therapistId !== therapistId) return;
      refreshDays();
    }

    window.addEventListener(AVAILABILITY_UPDATED_EVENT, handleUpdate);
    return () => window.removeEventListener(AVAILABILITY_UPDATED_EVENT, handleUpdate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, therapistId]);

  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const selectedDay =
    bookableDays.find((day) => day.label === selectedDayKey) ?? bookableDays[0] ?? null;

  function handleConfirm() {
    if (!selectedDay || !selectedTime) return;
    onConfirm({
      when: formatBookingWhen(selectedDay.label, selectedTime),
      scheduledAt: bookingScheduledAt(selectedDay.date, selectedTime),
    });
    onClose();
  }

  return (
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-[70] flex items-end justify-center sm:items-center">
          <motion.button
            type="button"
            aria-label="Close booking sheet"
            className="absolute inset-0 bg-munity-text/30 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="book-session-title"
            initial={{ y: "100%", opacity: 0.6 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 380, damping: 34 }}
            className="relative z-10 flex max-h-[88vh] w-full max-w-lg flex-col overflow-hidden rounded-t-[28px] border border-munity-border bg-white shadow-[0_-12px_40px_rgba(62,82,25,0.18)] sm:rounded-[28px]"
          >
            <div className="flex items-start justify-between gap-3 border-b border-munity-border/70 px-5 pb-4 pt-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-munity-muted">
                  Book a session
                </p>
                <h2
                  id="book-session-title"
                  className="mt-1 text-xl font-bold text-munity-green"
                >
                  {therapistName}
                </h2>
                <p className="mt-1 text-sm text-munity-muted">₵{rate}/hr · pick an open slot</p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full p-2 text-munity-muted transition hover:bg-munity-sidebar hover:text-munity-text"
                aria-label="Close"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="overflow-y-auto px-5 py-5">
              {alreadyBooked && latestBookingWhen ? (
                <div className="mb-5 flex items-start gap-3 rounded-2xl border border-munity-green/20 bg-munity-lime/40 px-4 py-3">
                  <Check className="mt-0.5 size-4 shrink-0 text-munity-green" strokeWidth={3} />
                  <div>
                    <p className="text-sm font-semibold text-munity-olive-text">
                      You already have a session booked
                    </p>
                    <p className="mt-0.5 text-xs text-munity-muted">{latestBookingWhen}</p>
                    <p className="mt-1 text-xs text-munity-muted">
                      You can book another open slot below if you need a follow-up.
                    </p>
                  </div>
                </div>
              ) : null}

              {bookableDays.length === 0 ? (
                <div className="rounded-2xl border border-munity-border bg-munity-sidebar px-4 py-8 text-center">
                  <Calendar className="mx-auto size-8 text-munity-muted" />
                  <p className="mt-3 text-sm font-semibold text-munity-text">
                    No open hours right now
                  </p>
                  <p className="mt-1 text-xs text-munity-muted">
                    This therapist hasn’t published availability for the coming days.
                  </p>
                </div>
              ) : (
                <>
                  <div>
                    <div className="mb-3 flex items-center gap-2">
                      <Calendar className="size-4 text-munity-green" />
                      <p className="text-sm font-semibold text-munity-text">Choose a day</p>
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-1">
                      {bookableDays.map((day) => {
                        const active = day.label === selectedDay?.label;
                        return (
                          <button
                            key={day.label}
                            type="button"
                            onClick={() => {
                              setSelectedDayKey(day.label);
                              setSelectedTime(null);
                            }}
                            className={`shrink-0 rounded-2xl border px-4 py-3 text-left transition ${
                              active
                                ? "border-munity-green bg-munity-lime text-munity-olive-text"
                                : "border-munity-border bg-munity-bg text-munity-muted hover:border-munity-green/40"
                            }`}
                          >
                            <p className="text-sm font-semibold">{day.label}</p>
                            <p className="mt-0.5 text-[11px]">
                              {day.slots.length} slot{day.slots.length === 1 ? "" : "s"}
                            </p>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {selectedDay ? (
                    <div className="mt-6">
                      <div className="mb-3 flex items-center gap-2">
                        <Clock3 className="size-4 text-munity-green" />
                        <p className="text-sm font-semibold text-munity-text">
                          Available times · {selectedDay.label}
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                        {selectedDay.slots.map((slot) => {
                          const active = selectedTime === slot;
                          return (
                            <button
                              key={slot}
                              type="button"
                              onClick={() => setSelectedTime(slot)}
                              className={`rounded-xl border px-3 py-3 text-sm font-semibold transition ${
                                active
                                  ? "border-munity-green bg-munity-green text-white"
                                  : "border-munity-border bg-white text-munity-text hover:border-munity-green/50"
                              }`}
                            >
                              {slot}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ) : null}
                </>
              )}
            </div>

            <div className="border-t border-munity-border/70 px-5 py-4">
              <button
                type="button"
                disabled={!selectedDay || !selectedTime}
                onClick={handleConfirm}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-munity-green px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-munity-green-dark disabled:cursor-not-allowed disabled:opacity-45"
              >
                <Calendar className="size-4" />
                {selectedDay && selectedTime
                  ? `Confirm ${selectedDay.label}, ${selectedTime}`
                  : "Select a day and time"}
              </button>
            </div>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}

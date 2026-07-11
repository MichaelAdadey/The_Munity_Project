"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { TherapistAppShell } from "@/components/therapistlayout/TherapistAppShell";

const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

const timeSlots = [
  "08:00 AM",
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "01:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
  "05:00 PM",
] as const;

const defaultAvailability: Record<(typeof weekDays)[number], string[]> = {
  Mon: ["09:00 AM", "10:00 AM", "02:00 PM", "03:00 PM"],
  Tue: ["10:00 AM", "11:00 AM", "01:00 PM", "04:00 PM"],
  Wed: ["09:00 AM", "02:00 PM", "03:00 PM", "04:00 PM"],
  Thu: ["10:00 AM", "11:00 AM", "02:00 PM"],
  Fri: ["09:00 AM", "10:00 AM", "01:00 PM", "02:00 PM"],
  Sat: ["10:00 AM"],
  Sun: [],
};

export function TherapistAvailabilityView() {
  const [availability, setAvailability] = useState(defaultAvailability);

  function toggleSlot(day: (typeof weekDays)[number], slot: string) {
    setAvailability((current) => {
      const daySlots = current[day];
      const next = daySlots.includes(slot)
        ? daySlots.filter((item) => item !== slot)
        : [...daySlots, slot];
      return { ...current, [day]: next };
    });
  }

  return (
    <TherapistAppShell
      active="Availability"
      title="Availability"
      subtitle="Set the hours patients can book video and text sessions."
    >
      <section className="rounded-[20px] border border-munity-input-border bg-white p-6 shadow-[0_4px_10px_rgba(85,107,47,0.05)]">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-munity-text">Weekly schedule</h2>
            <p className="mt-1 text-sm text-munity-muted">
              Tap a slot to open or close it. Changes apply to future bookings.
            </p>
          </div>
          <button
            type="button"
            className="rounded-xl bg-munity-green px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-munity-green-dark"
          >
            Save availability
          </button>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-[720px]">
            <div className="mb-3 grid grid-cols-[100px_repeat(7,minmax(0,1fr))] gap-2">
              <div />
              {weekDays.map((day) => (
                <div
                  key={day}
                  className="rounded-xl bg-munity-sidebar px-2 py-2 text-center text-sm font-semibold text-munity-text"
                >
                  {day}
                </div>
              ))}
            </div>

            {timeSlots.map((slot, rowIndex) => (
              <motion.div
                key={slot}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: rowIndex * 0.02 }}
                className="mb-2 grid grid-cols-[100px_repeat(7,minmax(0,1fr))] gap-2"
              >
                <div className="flex items-center text-xs font-semibold text-munity-muted">
                  {slot}
                </div>
                {weekDays.map((day) => {
                  const active = availability[day].includes(slot);
                  return (
                    <button
                      key={`${day}-${slot}`}
                      type="button"
                      onClick={() => toggleSlot(day, slot)}
                      className={`rounded-xl border px-2 py-3 text-xs font-semibold transition ${
                        active
                          ? "border-munity-green bg-munity-lime/60 text-munity-olive-text"
                          : "border-munity-input-border bg-munity-bg text-munity-muted hover:border-munity-green/40"
                      }`}
                    >
                      {active ? "Open" : "Closed"}
                    </button>
                  );
                })}
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </TherapistAppShell>
  );
}

"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { TherapistAppShell } from "@/components/therapistlayout/TherapistAppShell";
import { LivePulse, useLiveToast } from "@/components/live/LiveFeedback";
import {
  DEMO_THERAPIST_AVAILABILITY_ID,
  defaultWeeklyAvailability,
  getTherapistAvailability,
  saveTherapistAvailability,
  timeSlots,
  weekDays,
  type WeekDay,
  type WeeklyAvailability,
} from "@/lib/therapist-availability";

export function TherapistAvailabilityView() {
  const [availability, setAvailability] = useState<WeeklyAvailability>(
    defaultWeeklyAvailability,
  );
  const [hydrated, setHydrated] = useState(false);
  const { flash } = useLiveToast();

  useEffect(() => {
    setAvailability(getTherapistAvailability(DEMO_THERAPIST_AVAILABILITY_ID));
    setHydrated(true);
  }, []);

  function toggleSlot(day: WeekDay, slot: string) {
    setAvailability((current) => {
      const daySlots = current[day];
      const nextSlots = daySlots.includes(slot)
        ? daySlots.filter((item) => item !== slot)
        : [...daySlots, slot];
      return { ...current, [day]: nextSlots };
    });
    flash(`${day} at ${slot} ${availability[day].includes(slot) ? "closed" : "opened"}`);
  }

  function handleSave() {
    saveTherapistAvailability(DEMO_THERAPIST_AVAILABILITY_ID, availability);
    flash("Availability saved — members can book these slots");
  }

  if (!hydrated) {
    return (
      <TherapistAppShell
        active="Availability"
        title="Availability"
        subtitle="Set the hours patients can book video and text sessions."
      >
        <div className="h-40 animate-pulse rounded-[20px] bg-munity-sidebar" />
      </TherapistAppShell>
    );
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
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-semibold text-munity-text">Weekly schedule</h2>
              <LivePulse label="Updating" />
            </div>
            <p className="mt-1 text-sm text-munity-muted">
              Tap a slot to open or close it. Saved hours appear when members book with you.
            </p>
          </div>
          <button
            type="button"
            onClick={handleSave}
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

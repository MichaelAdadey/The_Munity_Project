import type { Mood } from "@/lib/types";

/** Struggling → Thriving, in ascending order. Mirrors the `mood_entries.mood` check constraint. */
export const MOOD_ORDER: Mood[] = [
  "struggling",
  "anxious",
  "tired",
  "calm",
  "optimistic",
  "thriving",
];

export const MOOD_LABELS: Record<Mood, string> = {
  struggling: "Struggling",
  anxious: "Anxious",
  tired: "Tired",
  calm: "Calm",
  optimistic: "Optimistic",
  thriving: "Thriving",
};

/** 1 (struggling) – 6 (thriving), for charting and averaging. */
export const MOOD_SCORE: Record<Mood, number> = {
  struggling: 1,
  anxious: 2,
  tired: 3,
  calm: 4,
  optimistic: 5,
  thriving: 6,
};

/** Moods that warrant surfacing to a patient's therapist as a distress signal. */
export const DISTRESS_MOODS: Mood[] = ["struggling", "anxious"];

export function isDistressMood(mood: Mood): boolean {
  return DISTRESS_MOODS.includes(mood);
}

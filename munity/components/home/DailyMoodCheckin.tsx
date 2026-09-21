"use client";

import { useState } from "react";
import type { Mood } from "@/lib/types";
import { MOOD_ORDER, MOOD_LABELS } from "@/lib/mood/mood-scale";
import { saveMoodCheckin } from "@/lib/mood/mood-actions";

const cardClass =
  "rounded-[20px] border border-munity-border bg-white shadow-[0_4px_10px_rgba(85,107,47,0.05)]";

/**
 * Private daily wellbeing check-in — distinct from the post composer's public mood tag below.
 * Feeds the therapist-side crisis banner, Analysis mood summaries, and per-patient Mood Trends.
 */
export function DailyMoodCheckin() {
  const [saving, setSaving] = useState(false);
  const [savedMood, setSavedMood] = useState<Mood | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSave(mood: Mood) {
    setSaving(true);
    setError(null);
    try {
      await saveMoodCheckin(mood);
      setSavedMood(mood);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't save your check-in");
    } finally {
      setSaving(false);
    }
  }

  if (savedMood) {
    return (
      <div className={`${cardClass} p-5 sm:p-6`}>
        <p className="text-sm font-semibold text-munity-green">
          Thanks for checking in — logged as &ldquo;{MOOD_LABELS[savedMood]}&rdquo;.
        </p>
        <button
          type="button"
          onClick={() => setSavedMood(null)}
          className="mt-2 text-xs font-semibold text-munity-muted transition hover:text-munity-green hover:underline"
        >
          Log a different mood
        </button>
      </div>
    );
  }

  return (
    <div className={`${cardClass} p-5 sm:p-6`}>
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-munity-muted">
        Daily Check-in
      </p>
      <h2 className="mt-1 text-lg font-bold text-munity-text">How are you feeling right now?</h2>
      <p className="mt-1 text-sm text-munity-muted">
        Private to you and your therapist — not shared on your feed.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {MOOD_ORDER.map((mood) => (
          <button
            key={mood}
            type="button"
            disabled={saving}
            onClick={() => handleSave(mood)}
            className="rounded-full border border-munity-border bg-munity-sidebar px-4 py-2 text-sm font-semibold text-munity-text transition hover:border-munity-green/40 hover:bg-munity-lime/30 disabled:opacity-50"
          >
            {MOOD_LABELS[mood]}
          </button>
        ))}
      </div>
      {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
    </div>
  );
}

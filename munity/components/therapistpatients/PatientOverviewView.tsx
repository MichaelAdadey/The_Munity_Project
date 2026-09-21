"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Clock, MoreVertical, Video } from "lucide-react";
import { TopNav } from "@/components/therapistlayout/TopNav";
import { PatientSidebar } from "@/components/therapistlayout/Sidebars";
import { CollapsibleSidebarLayout } from "@/components/therapistlayout/CollapsibleSidebarLayout";
import { SidebarProvider } from "@/components/therapistlayout/SidebarContext";
import { AnimatedPage } from "@/components/ui/AnimatedPage";
import { Button } from "@/components/ui/AppButton";
import { LivePulse, LiveTicker, useLiveToast } from "@/components/live/LiveFeedback";
import { useLoading } from "@/components/ui/LoadingProvider";
import { BookSessionSheet } from "@/components/therapy/BookSessionSheet";
import { patientNavHref } from "@/lib/routes";
import type { TherapistPatient } from "@/lib/therapist/patients-queries";
import { createAppointmentForPatient } from "@/lib/therapist/appointments-actions";
import { saveClinicianNote } from "@/lib/therapist/clinician-notes-actions";
import type { MoodEntryRow } from "@/lib/mood/mood-queries";
import { MOOD_LABELS, MOOD_SCORE } from "@/lib/mood/mood-scale";
import { timeAgo } from "@/lib/utils";

interface PatientOverviewViewProps {
  patient: TherapistPatient;
  therapistId: string;
  initialClinicianNote?: string;
  moodEntries?: MoodEntryRow[];
}

function buildWeeklyMoodBars(entries: MoodEntryRow[]) {
  const days = Array.from({ length: 7 }, (_, i) => {
    const day = new Date();
    day.setHours(0, 0, 0, 0);
    day.setDate(day.getDate() - (6 - i));
    return day;
  });

  return days.map((day) => {
    const dayEntries = entries.filter((entry) => {
      const created = new Date(entry.createdAt);
      return (
        created.getFullYear() === day.getFullYear() &&
        created.getMonth() === day.getMonth() &&
        created.getDate() === day.getDate()
      );
    });

    const score =
      dayEntries.length === 0
        ? null
        : dayEntries.reduce((sum, entry) => sum + MOOD_SCORE[entry.mood], 0) / dayEntries.length;

    return { label: day.toLocaleDateString(undefined, { weekday: "short" }), score };
  });
}

export function PatientOverviewView({
  patient,
  therapistId,
  initialClinicianNote = "",
  moodEntries = [],
}: PatientOverviewViewProps) {
  const router = useRouter();
  const { withLoading } = useLoading();
  const { flash } = useLiveToast();
  const [notes, setNotes] = useState(initialClinicianNote);
  const [savedNote, setSavedNote] = useState(initialClinicianNote);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [bookingInFlight, setBookingInFlight] = useState(false);

  const avatar = patient.avatar;
  const clinicalNotesHref = patientNavHref(patient.slug, "Clinical Notes");
  const moodBars = buildWeeklyMoodBars(moodEntries);
  const latestMood = moodEntries[0] ?? null;
  const recentActivity = moodEntries.slice(0, 5);

  return (
    <SidebarProvider storageKey="munity-patient-sidebar-open">
    <div className="min-h-screen bg-munity-bg">
      <TopNav active="Patients" />

      <div className="w-full pt-16">
        <CollapsibleSidebarLayout
          sidebar={
            <PatientSidebar
              active="Overview"
              patientSlug={patient.slug}
              patient={{
                name: patient.name,
                clientId: patient.clientId,
                avatar,
              }}
            />
          }
          mainClassName="px-10 pb-16 pt-6"
        >
        <AnimatedPage className="relative flex-1">
          <section className="flex gap-8 rounded-[20px] border border-munity-border bg-white p-6 shadow-[0_4px_10px_rgba(85,107,47,0.05)]">
            <div className="relative size-32 shrink-0 overflow-hidden rounded-full shadow-[0_0_0_4px_rgba(214,231,161,0.3)]">
              <Image src={avatar} alt={patient.name} fill className="object-cover" />
            </div>
            <div className="flex flex-1 flex-col gap-4">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-base font-normal text-munity-text">{patient.name}</h1>
                  <div className="mt-1 flex gap-2">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        patient.status === "Active"
                          ? "bg-munity-lime/50 text-munity-olive-text"
                          : "bg-[#e4e4cc] text-[#474836]"
                      }`}
                    >
                      {patient.status} Patient
                    </span>
                    <span className="rounded-full bg-[#e4e4cc] px-3 py-1 text-xs font-semibold text-[#474836]">
                      {patient.sessionCount} session{patient.sessionCount === 1 ? "" : "s"}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button className="px-5 py-4" onClick={() => setBookingOpen(true)}>
                    Book Session
                  </Button>
                  <Button variant="outline" className="px-3 py-3">
                    <MoreVertical className="size-4" />
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-4 border-t border-munity-border pt-6">
                {[
                  { label: "EMAIL", value: patient.email },
                  { label: "CLIENT ID", value: patient.clientId },
                  { label: "LAST SESSION", value: patient.lastSessionLabel },
                  { label: "MEMBER SINCE", value: patient.memberSince },
                ].map((item) => (
                  <div key={item.label}>
                    <p className="text-base uppercase tracking-wider text-munity-muted">{item.label}</p>
                    <p className="text-base text-munity-text">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <LiveTicker
            items={[
              `${patient.sessionCount} session${patient.sessionCount === 1 ? "" : "s"} on record with ${patient.name}.`,
              "Next session preparation is ready to review.",
            ]}
          />

          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
            <section className="rounded-[20px] border border-munity-border bg-white p-8 shadow-[0_4px_10px_rgba(85,107,47,0.05)] lg:col-span-2">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-base text-munity-text">Mood Trends</h2>
                  <p className="text-base text-munity-muted">
                    Patient self-reported mood levels — last 7 days
                  </p>
                </div>
                {latestMood ? (
                  <span className="rounded-full bg-munity-lime/40 px-3 py-1 text-xs font-bold text-munity-green-dark">
                    Latest: {MOOD_LABELS[latestMood.mood]}
                  </span>
                ) : null}
              </div>
              {moodEntries.length === 0 ? (
                <div className="mt-8 flex h-64 flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-munity-input-border px-6 text-center">
                  <p className="text-sm font-semibold text-munity-text">No mood check-ins yet</p>
                  <p className="max-w-xs text-sm text-munity-muted">
                    {patient.name} hasn&apos;t logged a mood check-in in the last 7 days.
                  </p>
                </div>
              ) : (
                <>
                  <div className="relative mt-8 flex h-64 items-end justify-between gap-2 border-b border-l border-munity-input-border px-2 pb-4">
                    {[...Array(4)].map((_, i) => (
                      <div
                        key={i}
                        className="pointer-events-none absolute inset-x-0 border-t border-dashed border-munity-input-border"
                        style={{ bottom: `${(i + 1) * 25}%` }}
                      />
                    ))}
                    {moodBars.map((bar) => (
                      <div
                        key={bar.label}
                        title={bar.score == null ? "No check-in" : `${bar.score.toFixed(1)} / 6`}
                        className={`w-[13%] rounded-t-lg ${
                          bar.score == null ? "bg-munity-input-border" : "bg-munity-green"
                        }`}
                        style={{ height: bar.score == null ? "4%" : `${(bar.score / 6) * 100}%` }}
                      />
                    ))}
                  </div>
                  <div className="mt-4 flex justify-between px-2 text-base text-munity-muted">
                    {moodBars.map((bar) => (
                      <span key={bar.label}>{bar.label}</span>
                    ))}
                  </div>
                </>
              )}
            </section>

            <section className="relative flex flex-col justify-between overflow-hidden rounded-[20px] bg-munity-green p-8 shadow-lg">
              <div>
                <p className="text-base uppercase tracking-[0.16em] text-munity-lime-light">
                  <span className="flex items-center gap-2">
                    Upcoming Session
                    {patient.nextSessionAt ? <LivePulse label="confirmed" /> : null}
                  </span>
                </p>
                {patient.nextSessionAt ? (
                  <>
                    <h3 className="mt-4 text-base text-white">{patient.nextSessionLabel}</h3>
                    <p className="text-base text-white">
                      {new Date(patient.nextSessionAt).toLocaleTimeString([], {
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </p>
                  </>
                ) : (
                  <p className="mt-4 text-base text-white/80">
                    No upcoming session scheduled with {patient.name}.
                  </p>
                )}
              </div>
              <div className="mt-8 space-y-4">
                {patient.nextSessionAt ? (
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-full bg-white/20">
                      <Video className="size-4 text-white" />
                    </div>
                    <p className="text-base text-white">Session details available on your calendar</p>
                  </div>
                ) : null}
                <Button
                  variant="lime"
                  className="w-full"
                  onClick={() =>
                    withLoading(async () => {
                      router.push(clinicalNotesHref);
                    }, "Opening session notes...")
                  }
                >
                  Prepare Session Notes
                </Button>
              </div>
            </section>

            <section className="rounded-[20px] border border-munity-border bg-white p-8 shadow-[0_4px_10px_rgba(85,107,47,0.05)]">
              <div className="mb-8 flex items-center justify-between">
                <h2 className="text-base text-munity-text">Recent Activity</h2>
                <Clock className="size-[18px] text-munity-muted" />
              </div>
              {recentActivity.length === 0 ? (
                <div className="rounded-xl border border-dashed border-munity-input-border p-6 text-center">
                  <p className="text-sm font-semibold text-munity-text">No recent activity</p>
                  <p className="mt-1 text-sm text-munity-muted">
                    Mood check-ins from {patient.name} will show up here.
                  </p>
                </div>
              ) : (
                <ul className="space-y-4">
                  {recentActivity.map((entry) => (
                    <li key={entry.createdAt} className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-munity-text">
                          Logged a mood check-in: {MOOD_LABELS[entry.mood]}
                        </p>
                        {entry.note ? (
                          <p className="mt-1 truncate text-sm text-munity-muted">&ldquo;{entry.note}&rdquo;</p>
                        ) : null}
                      </div>
                      <span className="shrink-0 text-xs font-medium text-munity-muted">
                        {timeAgo(entry.createdAt)}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
              <Link
                href={patientNavHref(patient.slug, "Progress")}
                className="mt-8 block w-full text-center text-sm font-bold text-munity-green hover:underline"
              >
                View All Activity
              </Link>
            </section>

            <section className="rounded-[20px] border border-munity-border bg-munity-sidebar p-8 lg:col-span-2">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base text-munity-text">Private Clinician Notes</h3>
                  <p className="text-sm font-semibold text-munity-muted">
                    These notes are only visible to you.
                  </p>
                </div>
                <span className="rounded-full bg-munity-lime/30 px-3 py-1 text-xs font-bold text-munity-green-dark">
                  Draft
                </span>
              </div>
              <textarea
                rows={4}
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                placeholder="Start typing private observations or reminders for next session..."
                className="mt-6 w-full resize-none bg-transparent text-base text-munity-gray outline-none"
              />
              <div className="mt-6 flex justify-end gap-3">
                <Button
                  variant="ghost"
                  onClick={() => setNotes(savedNote)}
                  disabled={notes === savedNote}
                >
                  Discard
                </Button>
                <Button
                  onClick={() =>
                    withLoading(async () => {
                      try {
                        await saveClinicianNote(patient.id, notes.trim());
                        setSavedNote(notes.trim());
                        setNotes(notes.trim());
                        flash("Private clinician draft saved");
                      } catch (error) {
                        flash(error instanceof Error ? error.message : "Couldn't save draft");
                      }
                    }, "Saving draft...")
                  }
                  disabled={!notes.trim() || notes === savedNote}
                >
                  Save Draft
                </Button>
              </div>
            </section>
          </div>
        </AnimatedPage>
        </CollapsibleSidebarLayout>
      </div>
      <BookSessionSheet
        open={bookingOpen}
        onClose={() => setBookingOpen(false)}
        therapistId={therapistId}
        therapistName={patient.name}
        alreadyBooked={Boolean(patient.nextSessionAt)}
        latestBookingWhen={patient.nextSessionLabel}
        submitting={bookingInFlight}
        onConfirm={async ({ when, scheduledAt }) => {
          setBookingInFlight(true);
          try {
            await createAppointmentForPatient({ patientId: patient.id, scheduledAt });
            flash(`Session booked with ${patient.name} · ${when}`);
            setBookingOpen(false);
            router.refresh();
          } catch (error) {
            flash(error instanceof Error ? error.message : "Couldn't book session");
          } finally {
            setBookingInFlight(false);
          }
        }}
      />
    </div>
    </SidebarProvider>
  );
}

"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import {
  Check,
  Pencil,
  PlusCircle,
  Printer,
  Save,
  Search,
} from "lucide-react";
import { TopNav } from "@/components/therapistlayout/TopNav";
import { PatientSidebar } from "@/components/therapistlayout/Sidebars";
import { CollapsibleSidebarLayout } from "@/components/therapistlayout/CollapsibleSidebarLayout";
import { SidebarProvider } from "@/components/therapistlayout/SidebarContext";
import { AnimatedPage } from "@/components/ui/AnimatedPage";
import { Button } from "@/components/ui/AppButton";
import { LiveTicker, useLiveToast } from "@/components/live/LiveFeedback";
import { useLoading } from "@/components/ui/LoadingProvider";
import { assets } from "@/lib/assets";
import { useMockStore } from "@/lib/mock-store";
import type { PatientRecord } from "@/lib/routes";
import { patientNavHref, patientRoutes, routes } from "@/lib/routes";

type NoteSession = {
  id: string | number;
  date: string;
  title: string;
  excerpt: string;
  tags?: string[];
  active: boolean;
  faded?: boolean;
  body?: string;
};

const sessions: NoteSession[] = [
  {
    id: 12,
    date: "Today",
    title: "Addressing Anxiety Triggers",
    excerpt: "Patient reported increased stress during workplace transition. Focus",
    tags: ["CBT", "MOOD: FAIR"],
    active: true,
  },
  {
    id: 11,
    date: "Oct 17, 2023",
    title: "Boundary Setting at Home",
    excerpt: "Explored family dynamics and the concept of healthy detachment.…",
    active: false,
  },
  {
    id: 10,
    date: "Oct 10, 2023",
    title: "Initial Progress Review",
    excerpt: "Month 3 review. Patient showing marked improvement in sleep…",
    active: false,
  },
  {
    id: 9,
    date: "Oct 03, 2023",
    title: "Grief and Loss Processing",
    excerpt: "First session focusing on the recent loss of the pet. Narrative…",
    active: false,
    faded: true,
  },
];

interface ClinicalNotesViewProps {
  patient: PatientRecord;
}

export function ClinicalNotesView({ patient }: ClinicalNotesViewProps) {
  const { sessionNotes } = useMockStore();
  const router = useRouter();
  const { withLoading } = useLoading();
  const { flash } = useLiveToast();
  const [activeSessionId, setActiveSessionId] = useState<string | number>(12);
  const [saved, setSaved] = useState(false);
  const [tasks, setTasks] = useState([true, false]);
  const [exportOpen, setExportOpen] = useState(false);
  const [homeworkTexts, setHomeworkTexts] = useState<string[]>([
    "Daily 5-minute boxed breathing during commute.",
    'Journaling identifying 3 "Evidence Against" a negative thought.',
  ]);
  const hwInputsRef = useRef<Array<HTMLInputElement | null>>([]);
  const hwFocusNext = useRef(false);
  const [titleState, setTitleState] = useState("");
  const [summaryState, setSummaryState] = useState("");
  const [observationsState, setObservationsState] = useState("");
  const [moodState, setMoodState] = useState("Fair (5-6)");
  const [riskState, setRiskState] = useState("Low risk");
  const avatar = assets.avatars[patient.avatarKey];
  const firstName = patient.name.split(" ")[0];
  const persistedSessions: NoteSession[] = sessionNotes
    .filter((note) => note.patientSlug === patient.slug)
    .map((note) => ({
      id: note.id,
      date: new Date(`${note.sessionDate}T12:00:00`).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      title: note.title,
      excerpt: note.body,
      tags: ["SAVED NOTE"],
      body: note.body,
      active: false,
    }));

  function buildNoteHTML(session: NoteSession) {
    return `
      <div style="font-family:system-ui,-apple-system,'Segoe UI',Roboto,'Helvetica Neue',Arial;padding:20px;color:#21311b;">
        <h1 style="color:#3e5219;">${session.title}</h1>
        <p><strong>Date:</strong> ${session.date}</p>
        <p><strong>Patient:</strong> ${patient.name}</p>
        <h2>Session Notes</h2>
        <p>${(session.body || session.excerpt).replace(/\n/g, '<br/>')}</p>
      </div>
    `;
  }

  function buildNotePlainText(session: NoteSession) {
    return [
      session.title,
      `Date: ${session.date}`,
      `Patient: ${patient.name}`,
      "",
      "Session Notes:",
      session.body || session.excerpt,
    ].join("\n");
  }

  function exportNoteAsPDF() {
    if (typeof window === "undefined") return;
    const session = allSessions.find((s) => s.id === activeSessionId);
    if (!session) return;
    const content = buildNoteHTML(session);
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Clinical Note</title><style>body{font-family:system-ui,-apple-system,sans-serif;padding:20px;color:#21311b;}h1{color:#3e5219;}h2{margin-top:16px;}</style></head><body>${content}</body></html>`;
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const w = window.open(url);
    if (w) {
      setTimeout(() => {
        w.print();
      }, 250);
    }
  }

  function exportNoteAsWord() {
    if (typeof window === "undefined") return;
    const session = allSessions.find((s) => s.id === activeSessionId);
    if (!session) return;
    const content = buildNoteHTML(session);
    const html = `<html xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="utf-8"/><title>Clinical Note</title><style>body{font-family:Calibri,sans-serif;line-height:1.5;}h1{color:#3e5219;margin-bottom:10px;}h2{margin-top:16px;margin-bottom:8px;}p{margin:6px 0;}</style></head><body>${content}</body></html>`;
    const blob = new Blob([html], { type: "application/vnd.ms-word" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${patient.name.replace(/\\s+/g, "_")}_clinical_note_${activeSessionId}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  function emailNote() {
    if (typeof window === "undefined") return;
    const session = allSessions.find((s) => s.id === activeSessionId);
    if (!session) return;
    const text = buildNotePlainText(session);
    const subject = `Clinical Note: ${session.title}`;
    const mailto = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}`;
    window.location.href = mailto;
  }
  const allSessions = [...persistedSessions, ...sessions];
  const activeSession =
    allSessions.find((session) => session.id === activeSessionId) ?? allSessions[0];
  const newNoteHref = patientRoutes(patient.slug).newSessionNote;

  useEffect(() => {
    if (!activeSession) return;
    setTitleState(activeSession.title ?? "");
    setSummaryState(activeSession.body ?? activeSession.excerpt ?? "");
    // default clinical observations text (editable)
    setObservationsState(
      `Observed significant psychomotor agitation (hand wringing) when discussing her direct supervisor. Cognitive distortions identified: catastrophizing ("I'll be the first to be let go") and personalizing organizational changes. Affect remained congruent with mood throughout. Significant insight displayed during the role-playing exercise regarding her internal locus of control.`
    );
    // keep previous selections if present in the body text
    if (activeSession.body) {
      if (activeSession.body.includes("Low risk")) setRiskState("Low risk");
      if (activeSession.body.includes("Moderate risk")) setRiskState("Moderate risk");
      if (activeSession.body.includes("Elevated risk")) setRiskState("Elevated risk");
      if (activeSession.body.includes("Excellent")) setMoodState("Excellent (9-10)");
      if (activeSession.body.includes("Good")) setMoodState("Good (7-8)");
      if (activeSession.body.includes("Fair")) setMoodState("Fair (5-6)");
      if (activeSession.body.includes("Low (3-4)")) setMoodState("Low (3-4)");
      if (activeSession.body.includes("Poor")) setMoodState("Poor (1-2)");
    }
  }, [activeSessionId]);

  useEffect(() => {
    if (!hwFocusNext.current) return;
    hwFocusNext.current = false;
    requestAnimationFrame(() => {
      const el = hwInputsRef.current[hwInputsRef.current.length - 1];
      el?.focus();
    });
  }, [homeworkTexts.length]);

  return (
    <SidebarProvider storageKey="munity-patient-sidebar-open">
    <div className="min-h-screen bg-munity-bg">
      <TopNav active="Patients" showSearch />

      <div className="w-full pt-16">
        <CollapsibleSidebarLayout
          sidebar={
            <PatientSidebar
              active="Clinical Notes"
              patientSlug={patient.slug}
              patient={{
                name: patient.name,
                clientId: patient.clientId,
                avatar,
              }}
            />
          }
          mainClassName="flex flex-1 flex-col"
        >
          <header className="flex h-16 items-center border-b border-munity-input-border/30 bg-munity-bg/80 px-10 backdrop-blur-md">
            <div className="flex items-center gap-4">
              <div className="relative size-10 overflow-hidden rounded-full bg-munity-lime">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={avatar} alt={patient.name} className="size-full object-cover" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-munity-text">{patient.name}</h2>
                <p className="text-xs font-medium text-munity-muted">
                  Patient ID: {patient.clientId} • Last Session: Oct 24, 2023
                </p>
              </div>
            </div>
          </header>

          <div className="flex flex-1 gap-6 p-6">
            <aside className="flex w-72 shrink-0 flex-col gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-munity-muted" />
                <input
                  type="search"
                  placeholder="Search notes..."
                  className="w-full rounded-xl border border-munity-input-border bg-white py-3.5 pl-10 pr-4 text-base text-gray-500 outline-none transition focus:border-munity-green focus:shadow-[0_0_0_3px_rgba(62,82,25,0.12)]"
                />
              </div>
              <div className="flex flex-col gap-3 overflow-auto">
                {allSessions.map((session) => {
                  const isActive = session.id === activeSessionId;
                  return (
                  <motion.button
                    key={session.id}
                    type="button"
                    onClick={() => {
                      setActiveSessionId(session.id);
                      setSaved(false);
                    }}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className={`rounded-[20px] border bg-white p-[18px] text-left shadow-[0_4px_10px_rgba(85,107,47,0.05)] ${
                      isActive
                        ? "border-2 border-munity-green"
                        : "border-munity-input-border"
                    } ${session.faded ? "opacity-80" : ""}`}
                  >
                    <div className="flex items-center justify-between text-sm">
                    <span
                      className={`font-semibold tracking-wide ${
                        isActive ? "text-munity-green" : "text-munity-muted"
                      }`}
                    >
                        Session #{session.id}
                      </span>
                      <span className="text-xs font-medium text-munity-muted">{session.date}</span>
                    </div>
                    <h3 className="mt-1 text-base text-munity-text">{session.title}</h3>
                    <p className="mt-1 text-sm leading-5 text-munity-muted">{session.excerpt}</p>
                    {session.tags && (
                      <div className="mt-2 flex gap-2">
                        {session.tags.map((tag) => (
                          <span
                            key={tag}
                            className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                              tag === "CBT"
                                ? "bg-munity-lime text-munity-olive-text"
                                : "bg-munity-divider text-munity-muted"
                            }`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </motion.button>
                  );
                })}
              </div>
            </aside>

            <AnimatedPage className="flex flex-1 flex-col overflow-hidden rounded-[20px] border border-munity-input-border bg-white shadow-[0_4px_20px_rgba(85,107,47,0.05)]">
              <div className="flex items-center justify-between border-b border-munity-input-border bg-munity-bg px-8 py-5">
                <div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-semibold tracking-wide text-munity-green">Session #{activeSession.id}</span>
                    <span className="text-munity-gray">•</span>
                    <span className="font-semibold tracking-wide text-munity-muted">{activeSession.date}</span>
                  </div>
                  <input
                    value={titleState}
                    onChange={(e) => setTitleState(e.target.value)}
                    className="text-2xl font-semibold text-munity-text w-full bg-transparent outline-none"
                  />
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => router.push(newNoteHref)}>
                    <PlusCircle className="size-4" />
                    New note
                  </Button>
                  <div className="relative">
                    <Button variant="ghost" onClick={() => setExportOpen((s) => !s)}>
                      <Printer className="size-4" />
                      Export
                    </Button>
                    {exportOpen && (
                      <div className="absolute right-0 z-10 mt-2 w-48 rounded-xl border border-munity-border bg-white p-2 shadow-lg">
                        <button
                          type="button"
                          onClick={() => {
                            exportNoteAsPDF();
                            setExportOpen(false);
                          }}
                          className="w-full text-left rounded-md px-3 py-2 text-sm hover:bg-munity-sidebar"
                        >
                          Export as PDF
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            exportNoteAsWord();
                            setExportOpen(false);
                          }}
                          className="w-full text-left rounded-md px-3 py-2 text-sm hover:bg-munity-sidebar"
                        >
                          Export as Word
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            emailNote();
                            setExportOpen(false);
                          }}
                          className="w-full text-left rounded-md px-3 py-2 text-sm hover:bg-munity-sidebar"
                        >
                          Email note
                        </button>
                      </div>
                    )}
                  </div>
                  <Button
                    onClick={() =>
                      withLoading(async () => {
                        await new Promise((resolve) => setTimeout(resolve, 800));
                        setSaved(true);
                        flash("Clinical note changes saved");
                      }, "Saving changes...")
                    }
                  >
                    <Save className="size-4" />
                    {saved ? "Saved ✓" : "Save Changes"}
                  </Button>
                </div>
              </div>

              <div className="flex-1 overflow-auto px-8 py-8">
                <div className="mx-auto max-w-3xl space-y-10">
                  <LiveTicker items={[`${patient.name}'s latest note is open for review.`, "All changes are saved locally in this workspace."]} />
                  <section>
                    <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-munity-green">
                      Session Summary
                    </h3>
                    <textarea
                      value={summaryState}
                      onChange={(e) => setSummaryState(e.target.value)}
                      className="mt-3 w-full rounded-xl border border-munity-input-border/30 bg-munity-sidebar p-4 text-base leading-relaxed text-munity-text resize-y"
                      rows={6}
                    />
                  </section>

                  <section>
                    <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-munity-green">
                      Clinical Observations
                    </h3>
                    <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="flex items-center justify-between rounded-xl border border-munity-input-border bg-munity-bg p-4">
                        <span className="text-sm font-semibold tracking-wide text-munity-text">Mood Rating</span>
                        <select value={moodState} onChange={(e) => setMoodState(e.target.value)} className="rounded-full border border-munity-input-border bg-white px-3 py-1 text-sm">
                          <option>Excellent (9-10)</option>
                          <option>Good (7-8)</option>
                          <option>Fair (5-6)</option>
                          <option>Low (3-4)</option>
                          <option>Poor (1-2)</option>
                        </select>
                      </div>
                      <div className="flex items-center justify-between rounded-xl border border-munity-input-border bg-munity-bg p-4">
                        <span className="text-sm font-semibold tracking-wide text-munity-text">Risk Assessment</span>
                        <select value={riskState} onChange={(e) => setRiskState(e.target.value)} className="rounded-full border border-munity-input-border bg-white px-3 py-1 text-sm">
                          <option>Low risk</option>
                          <option>Moderate risk</option>
                          <option>Elevated risk</option>
                        </select>
                      </div>
                    </div>
                    <div className="mt-4 rounded-xl border border-munity-input-border/30 bg-munity-sidebar p-4 text-base leading-relaxed text-munity-text">
                      Observed significant psychomotor agitation (hand wringing) when discussing her
                      direct supervisor. Cognitive distortions identified: catastrophizing (&quot;I&apos;ll be
                      the first to be let go&quot;) and personalizing organizational changes. Affect
                      remained congruent with mood throughout. Significant insight displayed during
                      the role-playing exercise regarding her internal locus of control.
                    </div>
                  </section>

                  <section>
                    <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-munity-green">
                      Next Steps &amp; Homework
                    </h3>
                    <div className="mt-3 space-y-3">
                      <button type="button" onClick={() => { setTasks((items) => [!items[0], items[1]]); flash("Homework task updated"); }} className="flex w-full items-center gap-3 rounded-xl border border-munity-input-border bg-white p-3 text-left">
                        <span className={`flex size-5.5 items-center justify-center rounded ${tasks[0] ? "bg-munity-green text-white" : "border border-munity-input-border"}`}>
                          {tasks[0] ? <Check className="size-4" strokeWidth={3} /> : null}
                        </span>
                        <span className="text-base leading-relaxed">
                          Daily 5-minute boxed breathing during commute.
                        </span>
                      </button>
                      <button type="button" onClick={() => { setTasks((items) => [items[0], !items[1]]); flash("Homework task updated"); }} className="flex w-full items-center gap-3 rounded-xl border border-munity-input-border bg-white p-3 text-left">
                        <span className={`flex size-5.5 items-center justify-center rounded ${tasks[1] ? "bg-munity-green text-white" : "border border-munity-input-border"}`}>
                          {tasks[1] ? <Check className="size-4" strokeWidth={3} /> : null}
                        </span>
                        <span className="text-base leading-relaxed">
                          Journaling identifying 3 &quot;Evidence Against&quot; a negative thought.
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={() => { setTasks((items) => [...items, false]); flash("New homework task added"); }}
                        className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-munity-green"
                      >
                        <PlusCircle className="size-4" />
                        Add New Task
                      </button>
                    </div>
                  </section>

                  <p className="text-sm text-munity-muted">
                    <Link href={patientNavHref(patient.slug, "Progress")} className="font-semibold text-munity-green hover:underline">
                      View therapeutic progress
                    </Link>
                    {" · "}
                    <Link href={routes.therapistDashboard} className="font-semibold text-munity-green hover:underline">
                      Back to dashboard
                    </Link>
                  </p>
                </div>
              </div>
            </AnimatedPage>
          </div>
        </CollapsibleSidebarLayout>
      </div>
    </div>
    </SidebarProvider>
  );
}

function ObservationCard({
  label,
  badge,
  badgeClass,
}: {
  label: string;
  badge: string;
  badgeClass: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-munity-input-border bg-munity-bg p-4">
      <span className="text-sm font-semibold tracking-wide text-munity-text">{label}</span>
      <span className={`rounded-full px-3 py-1 text-xs font-bold ${badgeClass}`}>{badge}</span>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, Plus, Save, X } from "lucide-react";
import { TopNav } from "@/components/therapistlayout/TopNav";
import { PatientSidebar } from "@/components/therapistlayout/Sidebars";
import { CollapsibleSidebarLayout } from "@/components/therapistlayout/CollapsibleSidebarLayout";
import { SidebarProvider } from "@/components/therapistlayout/SidebarContext";
import { AnimatedPage } from "@/components/ui/AnimatedPage";
import { Button } from "@/components/ui/AppButton";
import { Select } from "@/components/ui/AppSelect";
import { useLoading } from "@/components/ui/LoadingProvider";
import { assets } from "@/lib/assets";
import { mockStore } from "@/lib/mock-store";
import type { PatientRecord } from "@/lib/routes";
import { patientRoutes } from "@/lib/routes";

const moodOptions = [
  { value: "excellent", label: "Excellent (9–10)" },
  { value: "good", label: "Good (7–8)" },
  { value: "fair", label: "Fair (5–6)" },
  { value: "low", label: "Low (3–4)" },
  { value: "poor", label: "Poor (1–2)" },
];

const riskOptions = [
  { value: "low", label: "Low risk" },
  { value: "moderate", label: "Moderate risk" },
  { value: "elevated", label: "Elevated risk" },
];

const modalityOptions = [
  { value: "video", label: "Video session" },
  { value: "text", label: "Text consultation" },
  { value: "in-person", label: "In-person" },
];

const fieldClassName =
  "w-full rounded-xl border border-munity-input-border bg-white px-4 py-3 text-base text-munity-text outline-none transition placeholder:text-munity-muted focus:border-munity-green focus:shadow-[0_0_0_3px_rgba(62,82,25,0.12)]";

const labelClassName =
  "mb-2 block text-sm font-semibold uppercase tracking-[0.12em] text-munity-green";

interface NewSessionNoteViewProps {
  patient: PatientRecord;
}

export function NewSessionNoteView({ patient }: NewSessionNoteViewProps) {
  const router = useRouter();
  const { withLoading } = useLoading();
  const avatar = assets.avatars[patient.avatarKey];
  const notesHref = patientRoutes(patient.slug).clinicalNotes;

  const [title, setTitle] = useState("");
  const [sessionType, setSessionType] = useState("video");
  const [mood, setMood] = useState("fair");
  const [risk, setRisk] = useState("low");
  const [summary, setSummary] = useState("");
  const [observations, setObservations] = useState("");
  const [homework, setHomework] = useState<string[]>([""]);
  const [sessionDate, setSessionDate] = useState(new Date().toISOString().slice(0, 10));

  function updateHomework(index: number, value: string) {
    setHomework((prev) => prev.map((item, i) => (i === index ? value : item)));
  }

  function addHomework() {
    setHomework((prev) => [...prev, ""]);
  }

  function removeHomework(index: number) {
    setHomework((prev) => (prev.length === 1 ? [""] : prev.filter((_, i) => i !== index)));
  }

  async function handleSave() {
    await withLoading(async () => {
      const details = [
        summary.trim(),
        observations.trim() && `Clinical observations: ${observations.trim()}`,
        `Session type: ${sessionType}. Mood: ${mood}. Risk: ${risk}.`,
        homework.filter(Boolean).length &&
          `Next steps: ${homework.filter(Boolean).join("; ")}`,
      ]
        .filter(Boolean)
        .join("\n\n");
      mockStore.addSessionNote({
        patientSlug: patient.slug,
        patientName: patient.name,
        title: title.trim(),
        body: details,
        sessionDate,
      });
      await new Promise((resolve) => setTimeout(resolve, 900));
      router.push(notesHref);
    }, "Saving session note...");
  }

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
            mainClassName="px-10 pb-16 pt-6"
          >
            <AnimatedPage className="mx-auto flex w-full max-w-3xl flex-col gap-8">
              <header className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <Link
                    href={notesHref}
                    className="mb-3 inline-flex items-center gap-1.5 text-sm font-semibold text-munity-muted transition hover:text-munity-green"
                  >
                    <ArrowLeft className="size-4" />
                    Back to clinical notes
                  </Link>
                  <p className="text-sm font-semibold uppercase tracking-[0.14em] text-munity-muted">
                    Documentation
                  </p>
                  <h1 className="mt-2 text-3xl font-bold text-munity-text">New Session Note</h1>
                  <p className="mt-1 text-base text-munity-muted">
                    Record today’s session for {patient.name}
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button variant="outline" onClick={() => router.push(notesHref)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSave} disabled={!title.trim() || !summary.trim()}>
                    <Save className="size-4" />
                    Save note
                  </Button>
                </div>
              </header>

              <form
                className="flex flex-col gap-6"
                onSubmit={(event) => {
                  event.preventDefault();
                  void handleSave();
                }}
              >
                <section className="rounded-[20px] border border-munity-border bg-white p-6 shadow-[0_4px_10px_rgba(85,107,47,0.05)]">
                  <h2 className="text-lg font-semibold text-munity-text">Session details</h2>
                  <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <label htmlFor="session-title" className={labelClassName}>
                        Session title
                      </label>
                      <input
                        id="session-title"
                        type="text"
                        value={title}
                        onChange={(event) => setTitle(event.target.value)}
                        placeholder="e.g. Addressing workplace anxiety"
                        className={fieldClassName}
                        required
                      />
                    </div>
                    <div>
                      <Select
                        label="Session type"
                        options={modalityOptions}
                        value={sessionType}
                        onChange={setSessionType}
                      />
                    </div>
                    <div>
                      <label htmlFor="session-date" className={labelClassName}>
                        Session date
                      </label>
                      <input
                        id="session-date"
                        type="date"
                        value={sessionDate}
                        onChange={(event) => setSessionDate(event.target.value)}
                        className={fieldClassName}
                      />
                    </div>
                  </div>
                </section>

                <section className="rounded-[20px] border border-munity-border bg-white p-6 shadow-[0_4px_10px_rgba(85,107,47,0.05)]">
                  <label htmlFor="session-summary" className={labelClassName}>
                    Session summary
                  </label>
                  <textarea
                    id="session-summary"
                    value={summary}
                    onChange={(event) => setSummary(event.target.value)}
                    placeholder="What was covered in today’s session?"
                    rows={5}
                    className={`${fieldClassName} resize-y`}
                    required
                  />
                </section>

                <section className="rounded-[20px] border border-munity-border bg-white p-6 shadow-[0_4px_10px_rgba(85,107,47,0.05)]">
                  <h2 className="text-lg font-semibold text-munity-text">Clinical observations</h2>
                  <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <Select
                      label="Mood rating"
                      options={moodOptions}
                      value={mood}
                      onChange={setMood}
                    />
                    <Select
                      label="Risk assessment"
                      options={riskOptions}
                      value={risk}
                      onChange={setRisk}
                    />
                  </div>
                  <div className="mt-5">
                    <label htmlFor="clinical-observations" className={labelClassName}>
                      Notes
                    </label>
                    <textarea
                      id="clinical-observations"
                      value={observations}
                      onChange={(event) => setObservations(event.target.value)}
                      placeholder="Affect, cognition, risk indicators, interventions used…"
                      rows={5}
                      className={`${fieldClassName} resize-y`}
                    />
                  </div>
                </section>

                <section className="rounded-[20px] border border-munity-border bg-white p-6 shadow-[0_4px_10px_rgba(85,107,47,0.05)]">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h2 className="text-lg font-semibold text-munity-text">
                        Next steps &amp; homework
                      </h2>
                      <p className="mt-1 text-sm text-munity-muted">
                        Tasks for the patient before the next session
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={addHomework}
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-munity-green hover:underline"
                    >
                      <Plus className="size-4" />
                      Add task
                    </button>
                  </div>

                  <div className="mt-5 flex flex-col gap-3">
                    {homework.map((task, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={task}
                          onChange={(event) => updateHomework(index, event.target.value)}
                          placeholder={`Homework task ${index + 1}`}
                          className={fieldClassName}
                        />
                        <button
                          type="button"
                          onClick={() => removeHomework(index)}
                          className="rounded-xl p-3 text-munity-muted transition hover:bg-munity-sidebar hover:text-munity-text"
                          aria-label={`Remove task ${index + 1}`}
                        >
                          <X className="size-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </section>

                <div className="flex flex-wrap justify-end gap-3">
                  <Button type="button" variant="outline" onClick={() => router.push(notesHref)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={!title.trim() || !summary.trim()}>
                    <Save className="size-4" />
                    Save note
                  </Button>
                </div>
              </form>
            </AnimatedPage>
          </CollapsibleSidebarLayout>
        </div>
      </div>
    </SidebarProvider>
  );
}

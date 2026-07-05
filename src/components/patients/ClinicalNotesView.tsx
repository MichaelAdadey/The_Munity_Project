import Link from "next/link";
import {
  Bell,
  Check,
  Pencil,
  PlusCircle,
  Printer,
  Save,
  Search,
  Settings,
} from "lucide-react";
import { TopNav } from "@/components/layout/TopNav";
import { PatientSidebar } from "@/components/layout/Sidebars";
import { assets } from "@/lib/assets";
import type { PatientRecord } from "@/lib/routes";
import { patientNavHref, routes } from "@/lib/routes";

const sessions = [
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
  const avatar = assets.avatars[patient.avatarKey];
  const firstName = patient.name.split(" ")[0];

  return (
    <div className="min-h-screen bg-munity-bg">
      <TopNav active="Sessions" showSearch />

      <div className="flex w-full pt-16">
        <PatientSidebar
          active="Clinical Notes"
          patientSlug={patient.slug}
          patient={{
            name: patient.name,
            clientId: patient.clientId,
            avatar,
          }}
        />

        <div className="flex flex-1 flex-col">
          <header className="flex h-16 items-center justify-between border-b border-munity-input-border/30 bg-munity-bg/80 px-10 backdrop-blur-md">
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
            <div className="flex items-center gap-3">
              <button type="button" className="rounded-full p-2 text-munity-muted">
                <Bell className="size-4" />
              </button>
              <button type="button" className="rounded-full p-2 text-munity-muted">
                <Settings className="size-5" />
              </button>
            </div>
          </header>

          <div className="flex flex-1 gap-6 p-6">
            <aside className="flex w-72 shrink-0 flex-col gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-munity-muted" />
                <input
                  type="search"
                  placeholder="Search notes..."
                  className="w-full rounded-xl border border-munity-input-border bg-white py-3.5 pl-10 pr-4 text-base text-gray-500 outline-none"
                />
              </div>
              <div className="flex flex-col gap-3 overflow-auto">
                {sessions.map((session) => (
                  <article
                    key={session.id}
                    className={`rounded-[20px] border bg-white p-[18px] shadow-[0_4px_10px_rgba(85,107,47,0.05)] ${
                      session.active
                        ? "border-2 border-munity-green"
                        : "border-munity-input-border"
                    } ${session.faded ? "opacity-80" : ""}`}
                  >
                    <div className="flex items-center justify-between text-sm">
                      <span
                        className={`font-semibold tracking-wide ${
                          session.active ? "text-munity-green" : "text-munity-muted"
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
                  </article>
                ))}
              </div>
            </aside>

            <main className="flex flex-1 flex-col overflow-hidden rounded-[20px] border border-munity-input-border bg-white shadow-[0_4px_20px_rgba(85,107,47,0.05)]">
              <div className="flex items-center justify-between border-b border-munity-input-border bg-munity-bg px-8 py-5">
                <div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-semibold tracking-wide text-munity-green">Session #12</span>
                    <span className="text-munity-gray">•</span>
                    <span className="font-semibold tracking-wide text-munity-muted">Oct 24, 2023</span>
                  </div>
                  <h1 className="text-2xl font-semibold text-munity-text">
                    Addressing Anxiety Triggers
                  </h1>
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-munity-muted"
                  >
                    <Printer className="size-4" />
                    Export
                  </button>
                  <button
                    type="button"
                    className="flex items-center gap-2 rounded-xl bg-munity-green px-6 py-2 text-sm font-semibold text-white shadow-md"
                  >
                    <Save className="size-4" />
                    Save Changes
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-auto px-8 py-8">
                <div className="mx-auto max-w-3xl space-y-10">
                  <section>
                    <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-munity-green">
                      Session Summary
                    </h3>
                    <div className="mt-3 rounded-xl border border-munity-input-border/30 bg-munity-sidebar p-4 text-base leading-relaxed text-munity-text">
                      Patient presented with heightened autonomic arousal today, specifically citing a
                      recent restructuring at her firm. We spent the first 15 minutes of the session
                      grounding and practicing bilateral stimulation techniques. {firstName} expressed
                      concern about her performance despite positive feedback from peers.
                    </div>
                  </section>

                  <section>
                    <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-munity-green">
                      Clinical Observations
                    </h3>
                    <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <ObservationCard
                        label="Mood Rating"
                        badge="FAIR (6/10)"
                        badgeClass="bg-munity-lime text-munity-olive-text"
                      />
                      <ObservationCard
                        label="Risk Assessment"
                        badge="LOW RISK"
                        badgeClass="bg-munity-divider text-munity-muted"
                      />
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
                      <label className="flex items-center gap-3 rounded-xl border border-munity-input-border bg-white p-3">
                        <span className="flex size-[22px] items-center justify-center rounded bg-munity-green text-white">
                          <Check className="size-4" strokeWidth={3} />
                        </span>
                        <span className="text-base leading-relaxed">
                          Daily 5-minute boxed breathing during commute.
                        </span>
                      </label>
                      <label className="flex items-center gap-3 rounded-xl border border-munity-input-border bg-white p-3">
                        <span className="size-5 rounded border border-munity-input-border bg-white" />
                        <span className="text-base leading-relaxed">
                          Journaling identifying 3 &quot;Evidence Against&quot; a negative thought.
                        </span>
                      </label>
                      <button
                        type="button"
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
                    <Link href={routes.dashboard} className="font-semibold text-munity-green hover:underline">
                      Back to dashboard
                    </Link>
                  </p>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
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
      <div className="flex items-center gap-2">
        <span className={`rounded-full px-3 py-1 text-xs font-bold ${badgeClass}`}>{badge}</span>
        <Pencil className="size-[18px] text-munity-muted" />
      </div>
    </div>
  );
}

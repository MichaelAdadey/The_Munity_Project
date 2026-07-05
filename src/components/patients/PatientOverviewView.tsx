import Image from "next/image";
import Link from "next/link";
import { ChevronDown, Clock, MoreVertical, Video } from "lucide-react";
import { TopNav } from "@/components/layout/TopNav";
import { PatientSidebar } from "@/components/layout/Sidebars";
import { assets } from "@/lib/assets";
import type { PatientRecord } from "@/lib/routes";
import { patientNavHref } from "@/lib/routes";

const moodBars = [
  { height: "67%", opacity: "opacity-20" },
  { height: "75%", opacity: "opacity-30" },
  { height: "50%", opacity: "opacity-10" },
  { height: "83%", opacity: "opacity-40" },
  { height: "67%", opacity: "opacity-25" },
  { height: "80%", opacity: "opacity-35" },
  { height: "95%", opacity: "opacity-50" },
];

const activities = [
  {
    date: "TODAY",
    title: "Journal Entry Logged",
    detail: '"Feeling more grounded after the morning walk..."',
    italic: true,
    dot: "bg-munity-green",
  },
  {
    date: "YESTERDAY",
    title: "Completed Mood Check-in",
    detail: "Reported Mood: 8/10 (Stable)",
    dot: "bg-munity-green-dark",
  },
  {
    date: "MAR 12",
    title: "Goal Met: Social Engagement",
    detail: "Attended a community workshop",
    dot: "bg-munity-divider",
  },
];

interface PatientOverviewViewProps {
  patient: PatientRecord;
}

export function PatientOverviewView({ patient }: PatientOverviewViewProps) {
  const avatar = assets.avatars[patient.avatarKey];
  const clinicalNotesHref = patientNavHref(patient.slug, "Clinical Notes");

  return (
    <div className="min-h-screen bg-munity-bg">
      <TopNav active="Patients" />

      <div className="flex w-full pt-16">
        <PatientSidebar
          active="Overview"
          patientSlug={patient.slug}
          patient={{
            name: patient.name,
            clientId: patient.clientId,
            avatar,
          }}
        />

        <main className="relative flex-1 px-10 pb-16 pt-6">
          <section className="flex gap-8 rounded-[20px] border border-munity-border bg-white p-6 shadow-[0_4px_10px_rgba(85,107,47,0.05)]">
            <div className="relative size-32 shrink-0 overflow-hidden rounded-full shadow-[0_0_0_4px_rgba(214,231,161,0.3)]">
              <Image src={avatar} alt={patient.name} fill className="object-cover" />
            </div>
            <div className="flex flex-1 flex-col gap-4">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-base font-normal text-munity-text">{patient.name}</h1>
                  <div className="mt-1 flex gap-2">
                    <span className="rounded-full bg-munity-lime/50 px-3 py-1 text-xs font-semibold text-munity-olive-text">
                      Weekly Therapy
                    </span>
                    <span className="rounded-full bg-[#e4e4cc] px-3 py-1 text-xs font-semibold text-[#474836]">
                      Active Patient
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="rounded-xl bg-munity-green px-5 py-4 text-sm font-bold text-white"
                  >
                    Book Session
                  </button>
                  <button
                    type="button"
                    className="rounded-xl border border-munity-gray px-3 py-3 text-munity-gray"
                  >
                    <MoreVertical className="size-4" />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-4 border-t border-munity-border pt-6">
                {[
                  { label: "AGE", value: "28" },
                  { label: "GENDER", value: "Male" },
                  { label: "LOCATION", value: "Seattle, WA" },
                  { label: "MEMBERSHIP", value: "Oct 2023" },
                ].map((item) => (
                  <div key={item.label}>
                    <p className="text-base uppercase tracking-wider text-munity-muted">{item.label}</p>
                    <p className="text-base text-munity-text">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
            <section className="rounded-[20px] border border-munity-border bg-white p-8 shadow-[0_4px_10px_rgba(85,107,47,0.05)] lg:col-span-2">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-base text-munity-text">Mood Trends</h2>
                  <p className="text-base text-munity-muted">
                    Patient self-reported mood levels over the last 30 days
                  </p>
                </div>
                <button
                  type="button"
                  className="flex items-center gap-2 rounded-lg bg-[#efeded] px-4 py-2 text-base"
                >
                  Last 30 Days
                  <ChevronDown className="size-5" />
                </button>
              </div>
              <div className="relative mt-8 flex h-64 items-end justify-between gap-2 border-b border-l border-munity-input-border px-2 pb-4">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="pointer-events-none absolute inset-x-0 border-t border-dashed border-munity-input-border"
                    style={{ bottom: `${(i + 1) * 25}%` }}
                  />
                ))}
                {moodBars.map((bar, i) => (
                  <div
                    key={i}
                    className={`w-[70px] rounded-t-lg bg-munity-green ${bar.opacity}`}
                    style={{ height: bar.height }}
                  />
                ))}
              </div>
              <div className="mt-4 flex justify-between px-2 text-base text-munity-muted">
                {["Wk 1", "Wk 2", "Wk 3", "Wk 4"].map((w) => (
                  <span key={w}>{w}</span>
                ))}
              </div>
            </section>

            <section className="relative flex flex-col justify-between overflow-hidden rounded-[20px] bg-munity-green p-8 shadow-lg">
              <div>
                <p className="text-base uppercase tracking-[0.16em] text-munity-lime-light">
                  Upcoming Session
                </p>
                <h3 className="mt-4 text-base text-white">Tomorrow</h3>
                <p className="text-base text-white">10:30 AM — 11:30 AM</p>
              </div>
              <div className="mt-8 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-full bg-white/20">
                    <Video className="size-4 text-white" />
                  </div>
                  <p className="text-base text-white">
                    Virtual Meeting ID: 882-
                    <br />
                    019-331
                  </p>
                </div>
                <Link
                  href={clinicalNotesHref}
                  className="block w-full rounded-xl bg-munity-lime-light py-3 text-center text-base font-bold text-munity-green"
                >
                  Prepare Session Notes
                </Link>
              </div>
            </section>

            <section className="rounded-[20px] border border-munity-border bg-white p-8 shadow-[0_4px_10px_rgba(85,107,47,0.05)]">
              <div className="mb-8 flex items-center justify-between">
                <h2 className="text-base text-munity-text">Recent Activity</h2>
                <Clock className="size-[18px] text-munity-muted" />
              </div>
              <div className="relative space-y-8 pl-12">
                <div className="absolute bottom-2 left-4 top-2 w-0.5 bg-munity-input-border" />
                {activities.map((item) => (
                  <div key={item.date} className="relative">
                    <div
                      className={`absolute -left-8 top-1 size-4 rounded-full shadow-[0_0_0_4px_white] ${item.dot}`}
                    />
                    <p className="text-xs font-bold uppercase text-munity-muted">{item.date}</p>
                    <h4 className="mt-1 text-base font-bold text-munity-text">{item.title}</h4>
                    <p
                      className={`text-sm text-munity-muted ${item.italic ? "font-semibold italic" : "font-semibold"}`}
                    >
                      {item.detail}
                    </p>
                  </div>
                ))}
              </div>
              <Link
                href={patientNavHref(patient.slug, "Progress")}
                className="mt-8 block w-full text-center text-sm font-bold text-munity-green"
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
                placeholder="Start typing private observations or reminders for next session..."
                className="mt-6 w-full resize-none bg-transparent text-base text-munity-gray outline-none"
              />
              <div className="mt-6 flex justify-end gap-3">
                <button type="button" className="px-4 py-2 text-sm font-bold text-munity-muted">
                  Discard
                </button>
                <button
                  type="button"
                  className="rounded-xl bg-munity-green-dark px-6 py-2 text-sm font-bold text-white shadow-sm"
                >
                  Save Draft
                </button>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}

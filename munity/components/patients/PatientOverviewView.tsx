"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Clock, MoreVertical, Video } from "lucide-react";
import { TopNav } from "@/components/layout/TopNav";
import { PatientSidebar } from "@/components/layout/Sidebars";
import { AnimatedPage } from "@/components/ui/AnimatedPage";
import { Button } from "@/components/ui/AppButton";
import { DropdownMenu } from "@/components/ui/DropdownMenu";
import { useLoading } from "@/components/ui/LoadingProvider";
import { assets } from "@/lib/assets";
import type { PatientRecord } from "@/lib/routes";
import { patientNavHref } from "@/lib/routes";

const moodPeriods = ["Last 7 Days", "Last 30 Days", "Last 90 Days"];

const moodData: Record<string, { height: string; opacity: string }[]> = {
  "Last 7 Days": [
    { height: "55%", opacity: "opacity-30" },
    { height: "70%", opacity: "opacity-40" },
    { height: "62%", opacity: "opacity-35" },
    { height: "78%", opacity: "opacity-45" },
    { height: "85%", opacity: "opacity-50" },
    { height: "72%", opacity: "opacity-38" },
    { height: "90%", opacity: "opacity-55" },
  ],
  "Last 30 Days": [
    { height: "67%", opacity: "opacity-20" },
    { height: "75%", opacity: "opacity-30" },
    { height: "50%", opacity: "opacity-10" },
    { height: "83%", opacity: "opacity-40" },
    { height: "67%", opacity: "opacity-25" },
    { height: "80%", opacity: "opacity-35" },
    { height: "95%", opacity: "opacity-50" },
  ],
  "Last 90 Days": [
    { height: "45%", opacity: "opacity-15" },
    { height: "58%", opacity: "opacity-22" },
    { height: "62%", opacity: "opacity-28" },
    { height: "70%", opacity: "opacity-32" },
    { height: "76%", opacity: "opacity-36" },
    { height: "88%", opacity: "opacity-42" },
    { height: "92%", opacity: "opacity-48" },
  ],
};

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
  const router = useRouter();
  const { withLoading } = useLoading();
  const [moodPeriod, setMoodPeriod] = useState("Last 30 Days");
  const [notes, setNotes] = useState("");
  const [booked, setBooked] = useState(false);

  const avatar = assets.avatars[patient.avatarKey];
  const clinicalNotesHref = patientNavHref(patient.slug, "Clinical Notes");
  const moodBars = useMemo(() => moodData[moodPeriod], [moodPeriod]);

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

        <AnimatedPage className="relative flex-1 px-10 pb-16 pt-6">
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
                  <Button
                    className="px-5 py-4"
                    onClick={() =>
                      withLoading(async () => {
                        await new Promise((resolve) => setTimeout(resolve, 800));
                        setBooked(true);
                      }, "Booking session...")
                    }
                    disabled={booked}
                  >
                    {booked ? "Session Booked ✓" : "Book Session"}
                  </Button>
                  <Button variant="outline" className="px-3 py-3">
                    <MoreVertical className="size-4" />
                  </Button>
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
                    Patient self-reported mood levels over the selected period
                  </p>
                </div>
                <DropdownMenu value={moodPeriod} options={moodPeriods} onChange={setMoodPeriod} />
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
                  <motion.div
                    key={`${moodPeriod}-${i}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: bar.height, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 260, damping: 22, delay: i * 0.05 }}
                    className={`w-[70px] rounded-t-lg bg-munity-green ${bar.opacity}`}
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
              <div className="relative space-y-8 pl-12">
                <div className="absolute bottom-2 left-4 top-2 w-0.5 bg-munity-input-border" />
                {activities.map((item, i) => (
                  <motion.div
                    key={item.date}
                    className="relative"
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                  >
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
                  </motion.div>
                ))}
              </div>
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
                <Button variant="ghost" onClick={() => setNotes("")}>
                  Discard
                </Button>
                <Button
                  onClick={() =>
                    withLoading(async () => {
                      await new Promise((resolve) => setTimeout(resolve, 700));
                    }, "Saving draft...")
                  }
                  disabled={!notes.trim()}
                >
                  Save Draft
                </Button>
              </div>
            </section>
          </div>
        </AnimatedPage>
      </div>
    </div>
  );
}

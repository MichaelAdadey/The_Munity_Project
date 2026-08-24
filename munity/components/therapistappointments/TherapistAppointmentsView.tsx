"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
// import Link from "next/link";
import { Clock, MessageSquare, Search, Video } from "lucide-react";
import {
  TherapistSessionOverlays,
  type TherapistSessionKind,
  type TherapistSessionPatient,
} from "@/components/therapist/TherapistSessionOverlays";
import { TherapistAppShell } from "@/components/therapistlayout/TherapistAppShell";
import {
  LivePulse,
  LiveTicker,
  useLiveToast,
} from "@/components/live/LiveFeedback";
import { assets } from "@/lib/assets";
// import { patientRoutes } from "@/lib/routes";
import {
  AppointmentGroup,
  AppointmentItem,
} from "@/lib/therapist/appointments-queries";

// const appointments = [
//   {
//     day: "Today",
//     items: [
//       {
//         name: "Marcus Thorne",
//         patientId: "#MT-82",
//         type: "Video Session",
//         typeIcon: Video,
//         time: "02:00 PM – 02:50 PM",
//         action: "Join Session",
//         kind: "video" as const,
//         avatar: assets.avatars.alex,
//       },
//       {
//         name: "Sarah Jenkins",
//         patientId: "#SJ-41",
//         type: "Text Consultation",
//         typeIcon: MessageSquare,
//         time: "04:30 PM – 05:00 PM",
//         action: "Open Chat",
//         kind: "chat" as const,
//         avatar: assets.avatars.elena,
//       },
//     ],
//   },
//   {
//     day: "Tomorrow",
//     items: [
//       {
//         name: "Leo Richards",
//         patientId: "#LR-2847",
//         type: "Video Session",
//         typeIcon: Video,
//         time: "10:00 AM – 10:50 AM",
//         action: "Prepare Notes",
//         href: patientRoutes("leo-richards").clinicalNotes,
//         avatar: assets.avatars.leo,
//       },
//       {
//         name: "Elena Rodriguez",
//         patientId: "#ER-4421",
//         type: "Video Session",
//         typeIcon: Video,
//         time: "01:00 PM – 01:50 PM",
//         action: "Prepare Notes",
//         href: patientRoutes("elena-rodriguez").clinicalNotes,
//         avatar: assets.avatars.elena,
//       },
//     ],
//   },
// ] as const;

export function TherapistAppointmentsView({
  groups,
}: {
  groups: AppointmentGroup[];
}) {
  const { flash } = useLiveToast();
  const [activePatient, setActivePatient] =
    useState<TherapistSessionPatient | null>(null);
  const [activeKind, setActiveKind] = useState<TherapistSessionKind | null>(
    null,
  );

  // function startLiveSession(session: {
  //   name: string;
  //   patientId: string;
  //   avatar: string;
  //   time: string;
  //   type: string;
  //   kind: TherapistSessionKind;
  //   action: string;
  // }) {
  //   setActivePatient({
  //     patientUuid: session.patientId,
  //     name: session.name,
  //     patientId: session.patientId,
  //     avatar: session.avatar,
  //     time: session.time,
  //     type: session.type,
  //   });
  //   setActiveKind(session.kind);
  //   flash(
  //     session.kind === "video"
  //       ? `Joining video session with ${session.name}`
  //       : `Opening chat with ${session.name}`,
  //   );
  // }

  const startLiveSession = (item: AppointmentItem) => {
    setActivePatient({
      patientUuid: item.patientId,
      name: item.name,
      patientId: `#${item.patientId.slice(0, 6).toUpperCase()}`,
      avatar: assets.avatars.alex,
      time: item.time,
      type: item.type === "video" ? "Video Session" : "Text Consultation",
    });
    setActiveKind(item.type);
    flash(
      item.type === "video"
        ? `Joining video session with ${item.name}`
        : `Opening chat with ${item.name}`,
    );
  };

  const totalCount = groups.reduce((sum, g) => sum + g.items.length, 0);

  return (
    <TherapistAppShell
      active="Appointments"
      title="Appointments"
      subtitle="Upcoming sessions and consultations on your calendar."
      actions={
        <div className="relative w-full max-w-xs sm:w-64">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-munity-muted" />
          <input
            type="search"
            placeholder="Search appointments..."
            className="h-10 w-full rounded-full border border-munity-input-border bg-[#efeded] py-2 pl-10 pr-4 text-sm font-medium text-munity-text outline-none focus:border-munity-green"
          />
        </div>
      }
    >
      <LiveTicker
        items={[`${totalCount} upcoming appointments on your calendar.`]}
      />

      {groups.length === 0 ? (
        <div className="rounded-[20px] border border-munity-input-border bg-white p-10 text-center text-sm text-munity-muted shadow-[0_4px_20px_rgba(85,107,47,0.05)]">
          No upcoming appointments in the next two weeks.
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          {groups.map((group, groupIndex) => (
            <section
              key={group.day}
              className="overflow-hidden rounded-[20px] border border-munity-input-border bg-white shadow-[0_4px_20px_rgba(85,107,47,0.05)]"
            >
              <div className="border-b border-munity-input-border px-6 py-5">
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-semibold text-munity-text">
                    {group.day}
                  </h2>
                  <LivePulse label={`${group.items.length} sessions`} />
                </div>
              </div>
              <div>
                {group.items.map((item, index) => {
                  const TypeIcon =
                    item.type === "video" ? Video : MessageSquare;
                  return (
                    <motion.div
                      key={`${item.bookingId}`}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: groupIndex * 0.08 + index * 0.05 }}
                      className={`flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:gap-6 ${
                        index > 0 ? "border-t border-munity-input-border" : ""
                      }`}
                    >
                      <div className="flex min-w-50 items-center gap-4">
                        <div className="relative size-12 shrink-0 overflow-hidden rounded-full">
                          <Image
                            src={assets.avatars.alex}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="text-sm font-semibold tracking-wide text-munity-text">
                            {item.name}
                          </p>
                          <p className="text-xs font-medium text-munity-muted">
                            Patient ID: #
                            {item.patientId.slice(0, 6).toUpperCase()}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-1 flex-wrap items-center gap-6 sm:gap-8">
                        <div className="flex items-center gap-2 text-munity-muted">
                          <TypeIcon className="size-3.5 shrink-0" />
                          <span className="text-xs font-medium leading-snug">
                            {item.type === "video"
                              ? "Video Session"
                              : "Text Consultation"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="size-3.5 shrink-0 text-munity-muted" />
                          <span className="text-sm font-semibold tracking-wide text-munity-text">
                            {item.time}
                          </span>
                        </div>
                      </div>

                      {item.isToday ? (
                        <button
                          type="button"
                          onClick={() => startLiveSession(item)}
                          className="inline-flex shrink-0 items-center justify-center rounded-xl bg-munity-green px-6 py-2.5 text-sm font-semibold tracking-wide text-white transition hover:bg-munity-green-dark"
                        >
                          {item.type === "video" ? "Join Session" : "Open Chat"}
                        </button>
                      ) : (
                        // <Link
                        //   href={session.href}
                        //   onClick={() =>
                        //     flash(`${session.action} opened for ${session.name}`)
                        //   }
                        //   className="inline-flex shrink-0 items-center justify-center rounded-xl bg-munity-green px-6 py-2.5 text-sm font-semibold tracking-wide text-white transition hover:bg-munity-green-dark"
                        // >
                        //   {session.action}
                        // </Link>
                        <button
                          type="button"
                          onClick={() =>
                            flash("Patient profile pages are coming soon")
                          }
                          className="inline-flex shrink-0 items-center justify-center rounded-xl bg-munity-green px-6 py-2.5 text-sm font-semibold tracking-wide text-white transition hover:bg-munity-green-dark"
                        >
                          Prepare Notes
                        </button>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      )}
      <TherapistSessionOverlays
        patient={activePatient}
        kind={activeKind}
        onClose={() => {
          setActivePatient(null);
          setActiveKind(null);
        }}
      />
    </TherapistAppShell>
  );
}

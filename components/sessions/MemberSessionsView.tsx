"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Archive,
  ArchiveRestore,
  Calendar,
  Clock3,
  Flag,
  MessageCircle,
  Trash2,
} from "lucide-react";
import { MemberAppShell } from "@/components/memberlayout/MemberAppShell";
import { liveFadeUp, useLiveToast } from "@/components/live/LiveFeedback";
import { mockStore, useMockStore } from "@/lib/mock-store";
import type { Booking, BookingPriority } from "@/lib/mock-db";
import { messagesPath, routes, therapyPath } from "@/lib/routes";

type SessionTab = "upcoming" | "past" | "archived";

const priorityOptions: { value: BookingPriority; label: string }[] = [
  { value: "low", label: "Low" },
  { value: "normal", label: "Normal" },
  { value: "high", label: "High" },
  { value: "urgent", label: "Urgent" },
];

const priorityStyles: Record<BookingPriority, string> = {
  low: "bg-[#efeded] text-munity-muted",
  normal: "bg-munity-lime/50 text-munity-olive-text",
  high: "bg-[#ffe8cc] text-[#8a4b00]",
  urgent: "bg-[#ffdad6] text-[#93000a]",
};

const priorityRank: Record<BookingPriority, number> = {
  urgent: 0,
  high: 1,
  normal: 2,
  low: 3,
};

function isUpcoming(booking: Booking, now: number) {
  if (booking.archived) return false;
  if (booking.status === "completed" || booking.status === "cancelled") return false;
  return new Date(booking.scheduledAt).getTime() >= now;
}

function isPast(booking: Booking, now: number) {
  if (booking.archived) return false;
  if (booking.status === "completed" || booking.status === "cancelled") return true;
  return new Date(booking.scheduledAt).getTime() < now;
}

function SessionCard({
  booking,
  tab,
}: {
  booking: Booking;
  tab: SessionTab;
}) {
  const { flash } = useLiveToast();

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="rounded-[20px] border border-munity-border bg-white p-5 shadow-[0_4px_10px_rgba(85,107,47,0.04)]"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-lg font-semibold text-munity-text">{booking.therapistName}</p>
          <p className="mt-1 inline-flex items-center gap-2 text-sm text-munity-muted">
            <Clock3 className="size-3.5" />
            {booking.when}
          </p>
          <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-munity-muted">
            {booking.status}
          </p>
        </div>
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${priorityStyles[booking.priority]}`}
        >
          <Flag className="size-3" />
          {booking.priority}
        </span>
      </div>

      <div className="mt-5 flex flex-wrap items-end justify-between gap-3 border-t border-munity-border/70 pt-4">
        <label className="flex flex-col gap-1.5 text-xs font-semibold text-munity-muted">
          Session priority
          <select
            value={booking.priority}
            onChange={(event) => {
              const priority = event.target.value as BookingPriority;
              mockStore.setBookingPriority(booking.id, priority);
              flash(`Priority set to ${priority}`);
            }}
            className="h-10 min-w-[140px] rounded-xl border border-munity-input-border bg-munity-bg px-3 text-sm font-semibold text-munity-text outline-none focus:border-munity-green"
          >
            {priorityOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <div className="flex flex-wrap gap-2">
          <Link
            href={therapyPath(booking.therapistId)}
            className="rounded-xl border border-munity-border px-3 py-2 text-xs font-semibold text-munity-text transition hover:border-munity-green/40"
          >
            View therapist
          </Link>
          <Link
            href={messagesPath({ therapistId: booking.therapistId })}
            className="inline-flex items-center gap-1.5 rounded-xl border border-munity-green px-3 py-2 text-xs font-semibold text-munity-green transition hover:bg-munity-lime/30"
          >
            <MessageCircle className="size-3.5" />
            Message
          </Link>

          {tab === "past" ? (
            <button
              type="button"
              onClick={() => {
                mockStore.archiveBooking(booking.id);
                flash("Session archived");
              }}
              className="inline-flex items-center gap-1.5 rounded-xl border border-munity-border px-3 py-2 text-xs font-semibold text-munity-muted transition hover:border-munity-green/40 hover:text-munity-text"
            >
              <Archive className="size-3.5" />
              Archive
            </button>
          ) : null}

          {tab === "archived" ? (
            <button
              type="button"
              onClick={() => {
                mockStore.unarchiveBooking(booking.id);
                flash("Session restored from archive");
              }}
              className="inline-flex items-center gap-1.5 rounded-xl border border-munity-border px-3 py-2 text-xs font-semibold text-munity-muted transition hover:border-munity-green/40 hover:text-munity-text"
            >
              <ArchiveRestore className="size-3.5" />
              Restore
            </button>
          ) : null}

          {(tab === "past" || tab === "archived") && (
            <button
              type="button"
              onClick={() => {
                if (!window.confirm("Delete this session permanently?")) return;
                mockStore.deleteBooking(booking.id);
                flash("Session deleted");
              }}
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#ffdad6] bg-[#ffdad6]/40 px-3 py-2 text-xs font-semibold text-[#93000a] transition hover:brightness-95"
            >
              <Trash2 className="size-3.5" />
              Delete
            </button>
          )}

          {tab === "upcoming" ? (
            <button
              type="button"
              onClick={() => {
                if (!window.confirm("Cancel and remove this upcoming session?")) return;
                mockStore.deleteBooking(booking.id);
                flash("Upcoming session removed");
              }}
              className="inline-flex items-center gap-1.5 rounded-xl border border-munity-border px-3 py-2 text-xs font-semibold text-munity-muted transition hover:border-[#ffdad6] hover:text-[#93000a]"
            >
              <Trash2 className="size-3.5" />
              Cancel
            </button>
          ) : null}
        </div>
      </div>
    </motion.article>
  );
}

export function MemberSessionsView() {
  const store = useMockStore();
  const [tab, setTab] = useState<SessionTab>("upcoming");
  const now = Date.now();

  const lists = useMemo(() => {
    const upcoming = store.bookings
      .filter((booking) => isUpcoming(booking, now))
      .sort((a, b) => {
        const priorityDiff = priorityRank[a.priority] - priorityRank[b.priority];
        if (priorityDiff !== 0) return priorityDiff;
        return new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime();
      });
    const past = store.bookings
      .filter((booking) => isPast(booking, now))
      .sort(
        (a, b) =>
          new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime(),
      );
    const archived = store.bookings
      .filter((booking) => booking.archived)
      .sort(
        (a, b) =>
          new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime(),
      );
    return { upcoming, past, archived };
  }, [now, store.bookings]);

  const tabs: {
    id: SessionTab;
    label: string;
    count: number;
    description: string;
  }[] = [
    {
      id: "upcoming",
      label: "Upcoming",
      count: lists.upcoming.length,
      description: "Confirmed and pending sessions",
    },
    {
      id: "past",
      label: "Past",
      count: lists.past.length,
      description: "Completed or elapsed sessions",
    },
    {
      id: "archived",
      label: "Archived",
      count: lists.archived.length,
      description: "Sessions you’ve put aside",
    },
  ];

  const activeList = lists[tab];
  const activeMeta = tabs.find((item) => item.id === tab)!;

  return (
    <MemberAppShell>
      <motion.div
        initial="hidden"
        animate="show"
        variants={liveFadeUp}
        className="mx-auto flex max-w-6xl flex-col gap-6 lg:flex-row"
      >
        <aside className="w-full shrink-0 lg:w-64">
          <div className="rounded-[20px] border border-munity-border bg-white p-4 shadow-[0_4px_10px_rgba(85,107,47,0.04)] lg:sticky lg:top-24">
            <p className="px-2 text-xs font-semibold uppercase tracking-[0.14em] text-munity-muted">
              Your sessions
            </p>
            <nav className="mt-3 flex flex-col gap-1">
              {tabs.map((item) => {
                const active = tab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setTab(item.id)}
                    className={`flex items-center justify-between rounded-xl px-3 py-3 text-left transition ${
                      active
                        ? "bg-munity-lime text-munity-olive-text"
                        : "text-munity-muted hover:bg-munity-sidebar"
                    }`}
                  >
                    <span>
                      <span className="block text-sm font-semibold">{item.label}</span>
                      <span className="mt-0.5 block text-[11px] opacity-80">
                        {item.description}
                      </span>
                    </span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                        active ? "bg-white/70 text-munity-green" : "bg-munity-sidebar"
                      }`}
                    >
                      {item.count}
                    </span>
                  </button>
                );
              })}
            </nav>

            <Link
              href={routes.therapy}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-munity-green px-4 py-3 text-sm font-semibold text-white transition hover:bg-munity-green-dark"
            >
              <Calendar className="size-4" />
              Book a session
            </Link>
          </div>
        </aside>

        <section className="min-w-0 flex-1">
          <header className="mb-6">
            <h1 className="text-3xl font-bold text-munity-text">{activeMeta.label} sessions</h1>
            <p className="mt-1 text-sm text-munity-muted">{activeMeta.description}</p>
          </header>

          <AnimatePresence mode="popLayout">
            {activeList.length === 0 ? (
              <motion.div
                key={`${tab}-empty`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="rounded-[20px] border border-dashed border-munity-border bg-white/70 px-6 py-16 text-center"
              >
                <Calendar className="mx-auto size-10 text-munity-muted" />
                <p className="mt-4 text-base font-semibold text-munity-text">
                  No {activeMeta.label.toLowerCase()} sessions
                </p>
                <p className="mt-1 text-sm text-munity-muted">
                  {tab === "upcoming"
                    ? "Book a therapist to see your next session here."
                    : tab === "past"
                      ? "Finished sessions will show up here so you can archive or delete them."
                      : "Archive past sessions to keep this list tidy."}
                </p>
                {tab === "upcoming" ? (
                  <Link
                    href={routes.therapy}
                    className="mt-6 inline-flex rounded-xl bg-munity-green px-5 py-2.5 text-sm font-semibold text-white"
                  >
                    Find a therapist
                  </Link>
                ) : null}
              </motion.div>
            ) : (
              <div className="flex flex-col gap-4">
                {activeList.map((booking) => (
                  <SessionCard key={booking.id} booking={booking} tab={tab} />
                ))}
              </div>
            )}
          </AnimatePresence>
        </section>
      </motion.div>
    </MemberAppShell>
  );
}

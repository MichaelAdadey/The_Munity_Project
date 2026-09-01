"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  CalendarDays,
  Check,
  Clock,
  List,
  MessageSquare,
  Search,
  Video,
  X,
} from "lucide-react";
import {
  TherapistSessionOverlays,
  type TherapistSessionKind,
  type TherapistSessionPatient,
} from "@/components/therapist/TherapistSessionOverlays";
import { TherapistAppShell } from "@/components/therapistlayout/TherapistAppShell";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  LivePulse,
  LiveTicker,
  useLiveToast,
} from "@/components/live/LiveFeedback";
import { patientRoutes } from "@/lib/routes";
import {
  AppointmentGroup,
  AppointmentItem,
} from "@/lib/therapist/appointments-queries";
import {
  acceptBooking,
  cancelBooking,
  completeBooking,
  fetchAppointmentsForRange,
  rescheduleBooking,
} from "@/lib/therapist/appointments-actions";

type ViewMode = "list" | "calendar";

function toDatetimeLocalValue(iso: string) {
  const date = new Date(iso);
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function dateKey(iso: string) {
  const date = new Date(iso);
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

const statusDotClass: Record<AppointmentItem["status"], string> = {
  pending: "bg-[#c99a1a]",
  confirmed: "bg-munity-green",
  completed: "bg-munity-muted",
  cancelled: "bg-[#93000a]",
};

function AppointmentRow({
  item,
  busy,
  onAccept,
  onDecline,
  onComplete,
  onReschedule,
  onJoin,
}: {
  item: AppointmentItem;
  busy: boolean;
  onAccept: (item: AppointmentItem) => void;
  onDecline: (item: AppointmentItem) => void;
  onComplete: (item: AppointmentItem) => void;
  onReschedule: (item: AppointmentItem) => void;
  onJoin: (item: AppointmentItem) => void;
}) {
  const TypeIcon = item.type === "video" ? Video : MessageSquare;

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
      <div className="flex min-w-50 items-center gap-4">
        <div className="relative size-12 shrink-0 overflow-hidden rounded-full">
          <Image src={item.avatar} alt={item.name} fill className="object-cover" />
        </div>
        <div>
          <p className="text-sm font-semibold tracking-wide text-munity-text">{item.name}</p>
          <p className="text-xs font-medium text-munity-muted">
            Patient ID: #{item.patientId.slice(0, 6).toUpperCase()}
          </p>
        </div>
      </div>

      <div className="flex flex-1 flex-wrap items-center gap-6 sm:gap-8">
        <div className="flex items-center gap-2 text-munity-muted">
          <TypeIcon className="size-3.5 shrink-0" />
          <span className="text-xs font-medium leading-snug">
            {item.type === "video" ? "Video Session" : "Text Consultation"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="size-3.5 shrink-0 text-munity-muted" />
          <span className="text-sm font-semibold tracking-wide text-munity-text">{item.time}</span>
        </div>
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize ${
            item.status === "pending"
              ? "bg-[#fbeecb] text-[#8a6300]"
              : item.status === "confirmed"
                ? "bg-munity-lime/60 text-munity-olive-text"
                : item.status === "completed"
                  ? "bg-munity-sidebar text-munity-muted"
                  : "bg-[#ffdad6] text-[#93000a]"
          }`}
        >
          {item.status}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {item.status === "pending" ? (
          <>
            <button
              type="button"
              disabled={busy}
              onClick={() => onAccept(item)}
              className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-xl bg-munity-green px-5 py-2.5 text-sm font-semibold tracking-wide text-white transition hover:bg-munity-green-dark disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Check className="size-3.5" />
              Accept
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => onDecline(item)}
              className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-xl border border-munity-input-border px-4 py-2.5 text-sm font-semibold text-munity-muted transition hover:border-[#ffdad6] hover:text-[#93000a] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <X className="size-3.5" />
              Decline
            </button>
          </>
        ) : item.status === "confirmed" && item.isPast ? (
          <>
            <button
              type="button"
              disabled={busy}
              onClick={() => onComplete(item)}
              className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-xl bg-munity-green px-5 py-2.5 text-sm font-semibold tracking-wide text-white transition hover:bg-munity-green-dark disabled:cursor-not-allowed disabled:opacity-60"
            >
              Mark Complete
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => onDecline(item)}
              className="inline-flex shrink-0 items-center justify-center rounded-xl border border-munity-input-border px-4 py-2.5 text-xs font-semibold text-munity-muted transition hover:border-[#ffdad6] hover:text-[#93000a] disabled:cursor-not-allowed disabled:opacity-60"
            >
              Cancel
            </button>
          </>
        ) : item.status === "confirmed" && item.isToday ? (
          <>
            <button
              type="button"
              onClick={() => onJoin(item)}
              className="inline-flex shrink-0 items-center justify-center rounded-xl bg-munity-green px-5 py-2.5 text-sm font-semibold tracking-wide text-white transition hover:bg-munity-green-dark"
            >
              {item.type === "video" ? "Join Session" : "Open Chat"}
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => onReschedule(item)}
              className="inline-flex shrink-0 items-center justify-center rounded-xl border border-munity-input-border px-4 py-2.5 text-xs font-semibold text-munity-text transition hover:border-munity-green/40 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Reschedule
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => onDecline(item)}
              className="inline-flex shrink-0 items-center justify-center rounded-xl border border-munity-input-border px-4 py-2.5 text-xs font-semibold text-munity-muted transition hover:border-[#ffdad6] hover:text-[#93000a] disabled:cursor-not-allowed disabled:opacity-60"
            >
              Cancel
            </button>
          </>
        ) : item.status === "confirmed" ? (
          <>
            <Link
              href={patientRoutes(item.patientId).clinicalNotes}
              className="inline-flex shrink-0 items-center justify-center rounded-xl bg-munity-green px-5 py-2.5 text-sm font-semibold tracking-wide text-white transition hover:bg-munity-green-dark"
            >
              Prepare Notes
            </Link>
            <button
              type="button"
              disabled={busy}
              onClick={() => onReschedule(item)}
              className="inline-flex shrink-0 items-center justify-center rounded-xl border border-munity-input-border px-4 py-2.5 text-xs font-semibold text-munity-text transition hover:border-munity-green/40 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Reschedule
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => onDecline(item)}
              className="inline-flex shrink-0 items-center justify-center rounded-xl border border-munity-input-border px-4 py-2.5 text-xs font-semibold text-munity-muted transition hover:border-[#ffdad6] hover:text-[#93000a] disabled:cursor-not-allowed disabled:opacity-60"
            >
              Cancel
            </button>
          </>
        ) : null}
      </div>
    </div>
  );
}

export function TherapistAppointmentsView({
  groups,
}: {
  groups: AppointmentGroup[];
}) {
  const router = useRouter();
  const { flash } = useLiveToast();
  const [view, setView] = useState<ViewMode>("list");
  const [activePatient, setActivePatient] = useState<TherapistSessionPatient | null>(null);
  const [activeKind, setActiveKind] = useState<TherapistSessionKind | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [rescheduleTarget, setRescheduleTarget] = useState<AppointmentItem | null>(null);
  const [rescheduleValue, setRescheduleValue] = useState("");

  const [monthCursor, setMonthCursor] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [calendarItems, setCalendarItems] = useState<AppointmentItem[]>([]);
  const [calendarLoading, setCalendarLoading] = useState(false);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  const loadCalendar = useCallback(() => {
    const rangeStart = new Date(monthCursor.getFullYear(), monthCursor.getMonth(), 1);
    const rangeEnd = new Date(monthCursor.getFullYear(), monthCursor.getMonth() + 1, 0, 23, 59, 59, 999);
    setCalendarLoading(true);
    void (async () => {
      try {
        const data = await fetchAppointmentsForRange(rangeStart.toISOString(), rangeEnd.toISOString());
        setCalendarItems(data);
      } catch (error) {
        flash(error instanceof Error ? error.message : "Couldn't load the calendar");
      } finally {
        setCalendarLoading(false);
      }
    })();
  }, [monthCursor, flash]);

  useEffect(() => {
    if (view !== "calendar") return;
    const timer = window.setTimeout(() => {
      loadCalendar();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [view, loadCalendar]);

  function startLiveSession(item: AppointmentItem) {
    setActivePatient({
      patientUuid: item.patientId,
      name: item.name,
      patientId: `#${item.patientId.slice(0, 6).toUpperCase()}`,
      avatar: item.avatar,
      time: item.time,
      type: item.type === "video" ? "Video Session" : "Text Consultation",
    });
    setActiveKind(item.type);
    flash(
      item.type === "video"
        ? `Joining video session with ${item.name}`
        : `Opening chat with ${item.name}`,
    );
  }

  function refreshAfterMutation() {
    router.refresh();
    if (view === "calendar") loadCalendar();
  }

  async function handleAccept(item: AppointmentItem) {
    setBusyId(item.bookingId);
    try {
      await acceptBooking(item.bookingId);
      flash(`Accepted ${item.name}'s session request`);
      refreshAfterMutation();
    } catch (error) {
      flash(error instanceof Error ? error.message : "Couldn't accept that request");
    } finally {
      setBusyId(null);
    }
  }

  async function handleDecline(item: AppointmentItem) {
    const verb = item.status === "pending" ? "Decline" : "Cancel";
    if (!window.confirm(`${verb} the session with ${item.name}?`)) return;
    setBusyId(item.bookingId);
    try {
      await cancelBooking(item.bookingId);
      flash(`Session with ${item.name} ${verb.toLowerCase()}d`);
      refreshAfterMutation();
    } catch (error) {
      flash(error instanceof Error ? error.message : "Couldn't cancel that session");
    } finally {
      setBusyId(null);
    }
  }

  async function handleComplete(item: AppointmentItem) {
    setBusyId(item.bookingId);
    try {
      await completeBooking(item.bookingId);
      flash(`Session with ${item.name} marked complete`);
      refreshAfterMutation();
    } catch (error) {
      flash(error instanceof Error ? error.message : "Couldn't mark that session complete");
    } finally {
      setBusyId(null);
    }
  }

  function openReschedule(item: AppointmentItem) {
    setRescheduleTarget(item);
    setRescheduleValue(toDatetimeLocalValue(item.scheduledAt));
  }

  async function submitReschedule() {
    if (!rescheduleTarget || !rescheduleValue) return;
    const target = rescheduleTarget;
    setBusyId(target.bookingId);
    try {
      await rescheduleBooking(target.bookingId, new Date(rescheduleValue).toISOString());
      flash(`Session with ${target.name} rescheduled`);
      setRescheduleTarget(null);
      refreshAfterMutation();
    } catch (error) {
      flash(error instanceof Error ? error.message : "Couldn't reschedule that session");
    } finally {
      setBusyId(null);
    }
  }

  const totalCount = groups.reduce((sum, g) => sum + g.items.length, 0);

  // Calendar grid math
  const monthStart = monthCursor;
  const daysInMonth = new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 0).getDate();
  const leadingBlanks = monthStart.getDay();
  const itemsByDay = new Map<string, AppointmentItem[]>();
  for (const item of calendarItems) {
    const key = dateKey(item.scheduledAt);
    if (!itemsByDay.has(key)) itemsByDay.set(key, []);
    itemsByDay.get(key)!.push(item);
  }
  const statusPriority: AppointmentItem["status"][] = ["pending", "confirmed", "completed", "cancelled"];
  const selectedDayItems = selectedDay ? (itemsByDay.get(selectedDay) ?? []) : [];

  return (
    <TherapistAppShell
      active="Appointments"
      title="Appointments"
      subtitle="Upcoming sessions and consultations on your calendar."
      actions={
        <div className="flex w-full flex-wrap items-center gap-3 sm:w-auto">
          <div className="relative w-full max-w-xs sm:w-64">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-munity-muted" />
            <input
              type="search"
              placeholder="Search appointments..."
              className="h-10 w-full rounded-full border border-munity-input-border bg-[#efeded] py-2 pl-10 pr-4 text-sm font-medium text-munity-text outline-none focus:border-munity-green"
            />
          </div>
          <div className="flex shrink-0 items-center gap-1 rounded-full border border-munity-input-border bg-white p-1">
            <button
              type="button"
              onClick={() => setView("list")}
              className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                view === "list" ? "bg-munity-green text-white" : "text-munity-muted hover:text-munity-text"
              }`}
            >
              <List className="size-3.5" />
              List
            </button>
            <button
              type="button"
              onClick={() => setView("calendar")}
              className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                view === "calendar" ? "bg-munity-green text-white" : "text-munity-muted hover:text-munity-text"
              }`}
            >
              <CalendarDays className="size-3.5" />
              Calendar
            </button>
          </div>
        </div>
      }
    >
      {view === "list" ? (
        <>
          <LiveTicker items={[`${totalCount} upcoming appointments on your calendar.`]} />

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
                      <h2 className="text-xl font-semibold text-munity-text">{group.day}</h2>
                      <LivePulse label={`${group.items.length} sessions`} />
                    </div>
                  </div>
                  <div>
                    {group.items.map((item, index) => (
                      <motion.div
                        key={item.bookingId}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: groupIndex * 0.08 + index * 0.05 }}
                        className={`p-6 ${index > 0 ? "border-t border-munity-input-border" : ""}`}
                      >
                        <AppointmentRow
                          item={item}
                          busy={busyId === item.bookingId}
                          onAccept={handleAccept}
                          onDecline={handleDecline}
                          onComplete={handleComplete}
                          onReschedule={openReschedule}
                          onJoin={startLiveSession}
                        />
                      </motion.div>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="flex flex-col gap-6">
          <section className="rounded-[20px] border border-munity-input-border bg-white p-6 shadow-[0_4px_20px_rgba(85,107,47,0.05)]">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-munity-text">
                {monthStart.toLocaleDateString([], { month: "long", year: "numeric" })}
              </h2>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedDay(null);
                    setMonthCursor((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
                  }}
                  className="rounded-lg border border-munity-input-border px-3 py-1.5 text-sm font-semibold text-munity-text transition hover:border-munity-green/40"
                >
                  ←
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedDay(null);
                    setMonthCursor(() => {
                      const now = new Date();
                      return new Date(now.getFullYear(), now.getMonth(), 1);
                    });
                  }}
                  className="rounded-lg border border-munity-input-border px-3 py-1.5 text-xs font-semibold text-munity-muted transition hover:border-munity-green/40"
                >
                  Today
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedDay(null);
                    setMonthCursor((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
                  }}
                  className="rounded-lg border border-munity-input-border px-3 py-1.5 text-sm font-semibold text-munity-text transition hover:border-munity-green/40"
                >
                  →
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-2 text-center text-xs font-semibold text-munity-muted">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((label) => (
                <div key={label} className="py-1">
                  {label}
                </div>
              ))}
            </div>

            <div className={`mt-2 grid grid-cols-7 gap-2 ${calendarLoading ? "opacity-50" : ""}`}>
              {Array.from({ length: leadingBlanks }).map((_, i) => (
                <div key={`blank-${i}`} />
              ))}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const dayNum = i + 1;
                const cellDate = new Date(monthStart.getFullYear(), monthStart.getMonth(), dayNum);
                const key = dateKey(cellDate.toISOString());
                const dayItems = itemsByDay.get(key) ?? [];
                const dominant = statusPriority.find((s) => dayItems.some((it) => it.status === s));
                const isToday = key === dateKey(new Date().toISOString());
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setSelectedDay(key)}
                    className={`flex h-16 flex-col items-center justify-center gap-1 rounded-xl border text-sm font-semibold transition ${
                      selectedDay === key
                        ? "border-munity-green bg-munity-lime/50 text-munity-olive-text"
                        : isToday
                          ? "border-munity-green/50 bg-munity-bg text-munity-text"
                          : "border-munity-input-border bg-white text-munity-text hover:border-munity-green/30"
                    }`}
                  >
                    <span>{dayNum}</span>
                    {dayItems.length > 0 ? (
                      <span className="flex items-center gap-1 text-[10px] font-medium text-munity-muted">
                        <span className={`size-1.5 rounded-full ${dominant ? statusDotClass[dominant] : ""}`} />
                        {dayItems.length}
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>
          </section>

          <section className="rounded-[20px] border border-munity-input-border bg-white p-6 shadow-[0_4px_20px_rgba(85,107,47,0.05)]">
            <h3 className="mb-4 text-sm font-semibold text-munity-text">
              {selectedDay
                ? new Date(selectedDay).toLocaleDateString([], {
                    weekday: "long",
                    month: "short",
                    day: "numeric",
                  })
                : "Select a day to view its appointments"}
            </h3>
            {selectedDay && selectedDayItems.length === 0 ? (
              <p className="text-sm text-munity-muted">No appointments on this day.</p>
            ) : (
              <div className="flex flex-col divide-y divide-munity-input-border">
                {selectedDayItems.map((item) => (
                  <div key={item.bookingId} className="py-4 first:pt-0 last:pb-0">
                    <AppointmentRow
                      item={item}
                      busy={busyId === item.bookingId}
                      onAccept={handleAccept}
                      onDecline={handleDecline}
                      onComplete={handleComplete}
                      onReschedule={openReschedule}
                      onJoin={startLiveSession}
                    />
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      )}

      <Dialog
        open={!!rescheduleTarget}
        onOpenChange={(open) => {
          if (!open) setRescheduleTarget(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reschedule session</DialogTitle>
            <DialogDescription>
              {rescheduleTarget ? `Pick a new time for ${rescheduleTarget.name}'s session.` : ""}
            </DialogDescription>
          </DialogHeader>
          <input
            type="datetime-local"
            value={rescheduleValue}
            onChange={(e) => setRescheduleValue(e.target.value)}
            className="h-11 w-full rounded-xl border border-munity-input-border bg-munity-bg px-3 text-sm text-munity-text outline-none focus:border-munity-green"
          />
          <DialogFooter>
            <DialogClose
              render={
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-xl border border-munity-input-border px-4 py-2.5 text-sm font-semibold text-munity-text transition hover:bg-[#f3f4ee]"
                />
              }
            >
              Cancel
            </DialogClose>
            <button
              type="button"
              disabled={!rescheduleValue || busyId === rescheduleTarget?.bookingId}
              onClick={() => void submitReschedule()}
              className="inline-flex items-center justify-center rounded-xl bg-munity-green px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-munity-green-dark disabled:cursor-not-allowed disabled:opacity-60"
            >
              Save new time
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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

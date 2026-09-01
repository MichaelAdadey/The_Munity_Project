"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { CheckCheck, Filter } from "lucide-react";
import { MemberAppShell } from "@/components/memberlayout/MemberAppShell";
import { AdminAppShell } from "@/components/admin/AdminAppShell";
import { TherapistAppShell } from "@/components/therapistlayout/TherapistAppShell";
import { LivePulse, useLiveToast } from "@/components/live/LiveFeedback";
import {
  activityRouteForRole,
  notificationsByRole,
  toDisplayNotification,
  type NotificationRole,
} from "@/lib/notifications";
import type { RealNotification } from "@/lib/notifications-queries";
import { markAllNotificationsRead, markNotificationRead } from "@/lib/notifications-actions";

export function ActivityFeedView({
  role,
  adminName = "Munity Admin",
  notifications,
}: {
  role: NotificationRole;
  adminName?: string;
  /** Real, server-fetched notifications. Only passed for roles wired to a real backend (therapist). */
  notifications?: RealNotification[];
}) {
  const { flash } = useLiveToast();
  const isReal = notifications !== undefined;
  const [realItems, setRealItems] = useState(() => (notifications ?? []).map(toDisplayNotification));
  const items = isReal ? realItems : notificationsByRole[role];
  const categories = useMemo(
    () => ["All", ...Array.from(new Set(items.map((item) => item.category)))],
    [items],
  );
  const [filter, setFilter] = useState("All");
  const [readIds, setReadIds] = useState<string[]>([]);

  const visible = items.filter(
    (item) => filter === "All" || item.category === filter,
  );

  async function handleMarkAllRead() {
    if (isReal) {
      try {
        await markAllNotificationsRead();
        setRealItems((current) => current.map((item) => ({ ...item, unread: false })));
      } catch (error) {
        flash(error instanceof Error ? error.message : "Couldn't mark activity as read");
        return;
      }
    } else {
      setReadIds(items.map((item) => item.id));
    }
    flash("Marked all activity as read");
  }

  async function handleItemClick(id: string) {
    if (isReal) {
      try {
        await markNotificationRead(id);
        setRealItems((current) =>
          current.map((item) => (item.id === id ? { ...item, unread: false } : item)),
        );
      } catch {
        // Non-blocking — navigation still proceeds even if the read-receipt write fails.
      }
    } else {
      setReadIds((current) => [...new Set([...current, id])]);
    }
  }

  const content = (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-munity-muted">
            Inbox
          </p>
          <h1 className="mt-2 text-3xl font-bold text-munity-text">All activity</h1>
          <p className="mt-1 text-base text-munity-muted">
            Communities, messages, therapy, and platform updates in one place.
          </p>
          <div className="mt-3">
            <LivePulse
              label="Unread"
              count={items.filter((item) => item.unread && !readIds.includes(item.id)).length}
            />
          </div>
        </div>
        <button
          type="button"
          onClick={() => void handleMarkAllRead()}
          className="inline-flex items-center gap-2 rounded-full bg-munity-lime/60 px-4 py-2 text-sm font-semibold text-munity-olive-text"
        >
          <CheckCheck className="size-4" />
          Mark all read
        </button>
      </header>

      <div className="flex flex-wrap items-center gap-2">
        <Filter className="size-4 text-munity-muted" />
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => setFilter(category)}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
              filter === category
                ? "bg-munity-green text-white"
                : "bg-white text-munity-muted ring-1 ring-munity-border hover:bg-munity-lime/30"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <section className="overflow-hidden rounded-[20px] border border-munity-border bg-white shadow-[0_4px_10px_rgba(85,107,47,0.05)]">
        {visible.map((item, index) => {
          const Icon = item.icon;
          const unread = Boolean(item.unread) && !readIds.includes(item.id);
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              className="border-b border-munity-border last:border-0"
            >
              <Link
                href={item.href}
                onClick={() => void handleItemClick(item.id)}
                className="flex items-start gap-4 px-5 py-4 transition hover:bg-munity-lime/20"
              >
                <span className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-full bg-munity-lime/50 text-munity-green">
                  <Icon className="size-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-semibold text-munity-text">{item.title}</span>
                    <span className="rounded-full bg-[#f5f3f3] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-munity-muted">
                      {item.category}
                    </span>
                  </span>
                  <span className="mt-1 block text-sm leading-relaxed text-munity-muted">
                    {item.detail}
                  </span>
                  <span className="mt-2 block text-xs text-munity-muted">{item.time}</span>
                </span>
                {unread ? (
                  <span className="mt-2 size-2.5 shrink-0 rounded-full bg-munity-green" />
                ) : null}
              </Link>
            </motion.div>
          );
        })}
        {visible.length === 0 ? (
          <p className="px-5 py-10 text-center text-sm text-munity-muted">
            No activity in this category yet.
          </p>
        ) : null}
      </section>
    </div>
  );

  if (role === "admin") {
    return (
      <AdminAppShell adminName={adminName} title="Notifications">
        {content}
      </AdminAppShell>
    );
  }

  if (role === "therapist") {
    return (
      <TherapistAppShell
        active="Dashboard"
        title="Notifications"
        subtitle="Everything happening across your caseload and schedule."
      >
        {content}
      </TherapistAppShell>
    );
  }

  return <MemberAppShell>{content}</MemberAppShell>;
}

export { activityRouteForRole };

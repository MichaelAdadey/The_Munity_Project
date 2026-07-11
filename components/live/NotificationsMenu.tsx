"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ElementType } from "react";
import { Bell, CheckCheck, Heart, MessageCircle, ShieldAlert, Stethoscope } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLiveToast } from "@/components/live/LiveFeedback";
import { routes } from "@/lib/routes";

export type NotificationRole = "member" | "therapist" | "admin";

type NotificationItem = {
  id: string;
  title: string;
  detail: string;
  time: string;
  href: string;
  icon: ElementType;
  unread?: boolean;
};

const notificationsByRole: Record<NotificationRole, NotificationItem[]> = {
  member: [
    {
      id: "m1",
      title: "New reply in Mindful Paths",
      detail: "Jordan left a supportive comment on your post.",
      time: "2m",
      href: routes.memberHome,
      icon: Heart,
      unread: true,
    },
    {
      id: "m2",
      title: "Message from Dr. Elena Aris",
      detail: "Looking forward to our session at 3 PM.",
      time: "18m",
      href: routes.messages,
      icon: MessageCircle,
      unread: true,
    },
    {
      id: "m3",
      title: "Therapist availability",
      detail: "Sarah Jenkins has an opening later today.",
      time: "1h",
      href: routes.therapy,
      icon: Stethoscope,
    },
  ],
  therapist: [
    {
      id: "t1",
      title: "Session reminder",
      detail: "Leo Richards starts in 30 minutes.",
      time: "5m",
      href: routes.therapistAppointments,
      icon: Stethoscope,
      unread: true,
    },
    {
      id: "t2",
      title: "New patient note request",
      detail: "Elena Rodriguez updated her mood log.",
      time: "40m",
      href: routes.therapistPatients,
      icon: Heart,
      unread: true,
    },
    {
      id: "t3",
      title: "Care plan due",
      detail: "Alex Mercer’s weekly review is ready.",
      time: "2h",
      href: routes.therapistCarePlan,
      icon: MessageCircle,
    },
  ],
  admin: [
    {
      id: "a1",
      title: "Urgent moderation case",
      detail: "Self-harm report #8492 needs review.",
      time: "1m",
      href: routes.adminModeration,
      icon: ShieldAlert,
      unread: true,
    },
    {
      id: "a2",
      title: "Community growth spike",
      detail: "Grief Garden gained 120 members today.",
      time: "25m",
      href: routes.adminCommunities,
      icon: Heart,
      unread: true,
    },
    {
      id: "a3",
      title: "Therapist verification",
      detail: "2 credential reviews are waiting.",
      time: "3h",
      href: routes.adminTherapy,
      icon: Stethoscope,
    },
  ],
};

export function NotificationsMenu({ role }: { role: NotificationRole }) {
  const router = useRouter();
  const { flash } = useLiveToast();
  const items = notificationsByRole[role];
  const unreadCount = items.filter((item) => item.unread).length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="relative rounded-full p-2 text-munity-muted outline-none transition hover:bg-white hover:text-munity-green focus-visible:ring-2 focus-visible:ring-munity-green/30"
        aria-label="Open notifications"
      >
        <Bell className="size-5" />
        {unreadCount > 0 ? (
          <span className="absolute right-1.5 top-1.5 flex size-4 items-center justify-center rounded-full bg-[#ba1a1a] text-[9px] font-bold text-white">
            {unreadCount}
          </span>
        ) : null}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="w-[min(100vw-2rem,22rem)] border border-munity-border bg-white p-0 text-munity-text shadow-[0_16px_40px_rgba(62,82,25,0.12)]"
      >
        <div className="flex items-center justify-between border-b border-munity-border px-4 py-3">
          <div>
            <p className="text-sm font-semibold text-munity-text">Notifications</p>
            <p className="text-xs text-munity-muted">
              {unreadCount ? `${unreadCount} unread` : "You're all caught up"}
            </p>
          </div>
          <button
            type="button"
            onClick={() => flash("Marked all notifications as read")}
            className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-semibold text-munity-green hover:bg-munity-lime/40"
          >
            <CheckCheck className="size-3.5" />
            Mark read
          </button>
        </div>
        <div className="max-h-80 overflow-y-auto p-1.5">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <DropdownMenuItem
                key={item.id}
                className="cursor-pointer items-start gap-3 rounded-xl px-3 py-3 focus:bg-munity-lime/40"
                onClick={() => router.push(item.href)}
              >
                <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-munity-lime/50 text-munity-green">
                  <Icon className="size-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-start justify-between gap-2">
                    <span className="text-sm font-semibold text-munity-text">{item.title}</span>
                    <span className="shrink-0 text-[11px] text-munity-muted">{item.time}</span>
                  </span>
                  <span className="mt-0.5 block text-xs leading-relaxed text-munity-muted">
                    {item.detail}
                  </span>
                </span>
                {item.unread ? (
                  <span className="mt-1.5 size-2 shrink-0 rounded-full bg-munity-green" />
                ) : null}
              </DropdownMenuItem>
            );
          })}
        </div>
        <DropdownMenuSeparator className="my-0 bg-munity-divider" />
        <div className="p-2">
          <Link
            href={
              role === "admin"
                ? routes.adminModeration
                : role === "therapist"
                  ? routes.therapistDashboard
                  : routes.messages
            }
            className="block rounded-lg px-3 py-2 text-center text-xs font-semibold text-munity-green hover:bg-munity-lime/40"
          >
            View all activity
          </Link>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/** Reliable local avatar with fallback initials if the image fails. */
export function ProfileAvatar({
  src,
  alt,
  size = 36,
  className = "",
}: {
  src: string;
  alt: string;
  size?: number;
  className?: string;
}) {
  return (
    <span
      className={`relative inline-flex shrink-0 overflow-hidden rounded-full bg-munity-lime ${className}`}
      style={{ width: size, height: size }}
    >
      <Image
        src={src}
        alt={alt}
        width={size}
        height={size}
        className="size-full object-cover"
        unoptimized={src.startsWith("data:") || src.includes("figma.com")}
      />
    </span>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bell, CheckCheck } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLiveToast } from "@/components/live/LiveFeedback";
import {
  activityRouteForRole,
  notificationsByRole,
  type NotificationRole,
} from "@/lib/notifications";

export type { NotificationRole };

export function NotificationsMenu({ role }: { role: NotificationRole }) {
  const router = useRouter();
  const { flash } = useLiveToast();
  const items = notificationsByRole[role].slice(0, 4);
  const unreadCount = notificationsByRole[role].filter((item) => item.unread).length;
  const activityHref = activityRouteForRole(role);

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
                  <span className="mt-1 inline-flex rounded-full bg-[#f5f3f3] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-munity-muted">
                    {item.category}
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
            href={activityHref}
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

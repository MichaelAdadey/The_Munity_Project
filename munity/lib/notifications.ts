import type { ElementType } from "react";
import {
  Calendar,
  Heart,
  MessageCircle,
  ShieldAlert,
  Stethoscope,
  Users,
} from "lucide-react";
import { routes } from "@/lib/routes";

export type NotificationRole = "member" | "therapist" | "admin";

export type AppNotification = {
  id: string;
  title: string;
  detail: string;
  time: string;
  href: string;
  category: string;
  icon: ElementType;
  unread?: boolean;
};

export const notificationsByRole: Record<NotificationRole, AppNotification[]> = {
  member: [
    {
      id: "m1",
      title: "New reply in Mindful Paths",
      detail: "Jordan left a supportive comment on your post.",
      time: "2m ago",
      href: routes.memberHome,
      category: "Community",
      icon: Heart,
      unread: true,
    },
    {
      id: "m2",
      title: "Message from Dr. Elena Aris",
      detail: "Looking forward to our session at 3 PM.",
      time: "18m ago",
      href: routes.messages,
      category: "Messages",
      icon: MessageCircle,
      unread: true,
    },
    {
      id: "m3",
      title: "Therapist availability",
      detail: "Sarah Jenkins has an opening later today.",
      time: "1h ago",
      href: routes.therapy,
      category: "Therapy",
      icon: Stethoscope,
    },
    {
      id: "m4",
      title: "Campus Calm is live",
      detail: "A peer circle starts in 20 minutes.",
      time: "3h ago",
      href: routes.communities,
      category: "Community",
      icon: Users,
    },
    {
      id: "m5",
      title: "Mood streak reminder",
      detail: "Log today’s check-in to keep your 12-day streak.",
      time: "Yesterday",
      href: routes.memberHome,
      category: "Wellness",
      icon: Heart,
    },
    {
      id: "m6",
      title: "Saved resource update",
      detail: "A new guide was added near your bookmarked topics.",
      time: "2d ago",
      href: routes.resources,
      category: "Resources",
      icon: Calendar,
    },
  ],
  therapist: [
    {
      id: "t1",
      title: "Session reminder",
      detail: "Leo Richards starts in 30 minutes.",
      time: "5m ago",
      href: routes.therapistAppointments,
      category: "Appointments",
      icon: Stethoscope,
      unread: true,
    },
    {
      id: "t2",
      title: "New patient note request",
      detail: "Elena Rodriguez updated her mood log.",
      time: "40m ago",
      href: routes.therapistPatients,
      category: "Patients",
      icon: Heart,
      unread: true,
    },
    {
      id: "t4",
      title: "Availability gap",
      detail: "Thursday afternoon still has open slots.",
      time: "Yesterday",
      href: routes.therapistAvailability,
      category: "Schedule",
      icon: Calendar,
    },
  ],
  admin: [
    {
      id: "a1",
      title: "Urgent moderation case",
      detail: "Self-harm report #8492 needs review.",
      time: "1m ago",
      href: routes.adminModeration,
      category: "Moderation",
      icon: ShieldAlert,
      unread: true,
    },
    {
      id: "a2",
      title: "Community growth spike",
      detail: "Grief Garden gained 120 members today.",
      time: "25m ago",
      href: routes.adminCommunities,
      category: "Communities",
      icon: Users,
      unread: true,
    },
    {
      id: "a3",
      title: "Therapist verification",
      detail: "2 credential reviews are waiting.",
      time: "3h ago",
      href: routes.adminTherapy,
      category: "Therapy",
      icon: Stethoscope,
    },
    {
      id: "a4",
      title: "Platform health",
      detail: "Support wait time improved 12% this week.",
      time: "Yesterday",
      href: routes.adminGrowth,
      category: "Growth",
      icon: Heart,
    },
  ],
};

export function activityRouteForRole(role: NotificationRole) {
  switch (role) {
    case "admin":
      return routes.adminNotifications;
    case "therapist":
      return routes.therapistNotifications;
    default:
      return routes.notifications;
  }
}

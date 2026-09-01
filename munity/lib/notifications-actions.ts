"use client";

import { createClient } from "./supabase/client";
import type { RealNotification } from "./notifications-queries";

/** Fetches the signed-in user's notifications — used for the bell menu and full activity page. */
export const fetchNotifications = async (limit = 50): Promise<RealNotification[]> => {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("notifications")
    .select("id, type, title, body, href, read, created_at")
    .eq("recipient_id", user.id)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw new Error(error.message);

  return (data ?? []).map((row) => ({
    id: row.id as string,
    type: row.type as RealNotification["type"],
    title: row.title as string,
    body: row.body as string,
    href: row.href as string | null,
    read: row.read as boolean,
    createdAt: row.created_at as string,
  }));
};

export const markNotificationRead = async (id: string): Promise<void> => {
  const supabase = createClient();
  const { error } = await supabase.from("notifications").update({ read: true }).eq("id", id);
  if (error) throw new Error(error.message);
};

export const markAllNotificationsRead = async (): Promise<void> => {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const { error } = await supabase
    .from("notifications")
    .update({ read: true })
    .eq("recipient_id", user.id)
    .eq("read", false);

  if (error) throw new Error(error.message);
};

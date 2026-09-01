import { createClient } from "./supabase/server";

export type NotificationType =
  | "booking_request"
  | "verification_approved"
  | "verification_rejected";

export type RealNotification = {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  href: string | null;
  read: boolean;
  createdAt: string;
};

type NotificationRow = {
  id: string;
  type: string;
  title: string;
  body: string;
  href: string | null;
  read: boolean;
  created_at: string;
};

/** Real notifications for a signed-in user, most recent first. */
export async function getNotifications(
  userId: string,
  limit = 50,
): Promise<RealNotification[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("notifications")
    .select("id, type, title, body, href, read, created_at")
    .eq("recipient_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw new Error(error.message);

  return ((data ?? []) as NotificationRow[]).map((row) => ({
    id: row.id,
    type: row.type as NotificationType,
    title: row.title,
    body: row.body,
    href: row.href,
    read: row.read,
    createdAt: row.created_at,
  }));
}

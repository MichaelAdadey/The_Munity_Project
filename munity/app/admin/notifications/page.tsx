import { ActivityFeedView } from "@/components/activity/ActivityFeedView";
import { requireRole } from "@/lib/require-role";
import { routes } from "@/lib/routes";
import { getNotifications } from "@/lib/notifications-queries";

export default async function AdminNotificationsPage() {
  const { user, profile } = await requireRole(["admin"], routes.adminLogin);
  const notifications = await getNotifications(user.id);

  return (
    <ActivityFeedView
      role="admin"
      adminName={`${profile.first_name} ${profile.last_name}`.trim()}
      notifications={notifications}
    />
  );
}

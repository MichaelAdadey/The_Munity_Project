import { ActivityFeedView } from "@/components/activity/ActivityFeedView";
import { requireRole } from "@/lib/require-role";
import { routes } from "@/lib/routes";
import { getNotifications } from "@/lib/notifications-queries";

export default async function NotificationsPage() {
  const { user } = await requireRole(["patient"], routes.login);
  const notifications = await getNotifications(user.id);

  return <ActivityFeedView role="member" notifications={notifications} />;
}

import { ActivityFeedView } from "@/components/activity/ActivityFeedView";
import { requireRole } from "@/lib/require-role";
import { routes } from "@/lib/routes";
import { getNotifications } from "@/lib/notifications-queries";

export default async function TherapistNotificationsPage() {
  const { user } = await requireRole(["therapist"], routes.therapistLogin);
  const notifications = await getNotifications(user.id);

  return <ActivityFeedView role="therapist" notifications={notifications} />;
}

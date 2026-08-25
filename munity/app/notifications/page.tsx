import { ActivityFeedView } from "@/components/activity/ActivityFeedView";
import { requireRole } from "@/lib/require-role";
import { routes } from "@/lib/routes";

export default async function NotificationsPage() {
  await requireRole(["patient"], routes.login);
  return <ActivityFeedView role="member" />;
}

import { ActivityFeedView } from "@/components/activity/ActivityFeedView";
import { requireMockRole } from "@/lib/require-session";

export default async function NotificationsPage() {
  await requireMockRole("user");
  return <ActivityFeedView role="member" />;
}

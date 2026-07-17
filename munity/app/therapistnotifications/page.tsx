import { ActivityFeedView } from "@/components/activity/ActivityFeedView";
import { requireMockRole } from "@/lib/require-session";

export default async function TherapistNotificationsPage() {
  await requireMockRole("therapist");
  return <ActivityFeedView role="therapist" />;
}

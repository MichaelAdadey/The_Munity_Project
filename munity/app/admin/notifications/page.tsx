import { redirect } from "next/navigation";
import { ActivityFeedView } from "@/components/activity/ActivityFeedView";
import { getMockSession } from "@/lib/mock-session";
import { routes } from "@/lib/routes";

export default async function AdminNotificationsPage() {
  const session = await getMockSession();
  if (!session || session.role !== "admin") {
    redirect(routes.adminLogin);
  }
  return <ActivityFeedView role="admin" adminName={session.name} />;
}

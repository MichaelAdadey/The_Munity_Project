import { requireRole } from "@/lib/require-role";
import { routes } from "@/lib/routes";
import { AdminModeratorApplicationsView } from "@/components/admin/AdminModeratorApplicationsView";
import { getModeratorApplications } from "@/lib/admin/moderator-applications-queries";

export default async function AdminModeratorApplicationsPage() {
  const { profile } = await requireRole(["admin"], routes.adminLogin);
  const applications = await getModeratorApplications();

  return (
    <AdminModeratorApplicationsView
      adminName={`${profile.first_name} ${profile.last_name}`.trim()}
      applications={applications}
    />
  );
}

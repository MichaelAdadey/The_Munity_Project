import { requireRole } from "@/lib/require-role";
import { routes } from "@/lib/routes";
import { AdminResourcesView } from "@/components/admin/AdminResourcesView";
import { getAllResourcesForAdmin } from "@/lib/admin/resources-queries";

export default async function AdminResourcesPage() {
  const { profile } = await requireRole(["admin"], routes.adminLogin);
  const resources = await getAllResourcesForAdmin();

  return (
    <AdminResourcesView
      adminName={`${profile.first_name} ${profile.last_name}`.trim()}
      resources={resources}
    />
  );
}

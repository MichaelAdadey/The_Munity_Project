import { requireRole } from "@/lib/require-role";
import { routes } from "@/lib/routes";
import { AdminCommunitiesView } from "@/components/admin/AdminCommunitiesView";
import { getAllCommunitiesForAdmin } from "@/lib/admin/communities-queries";

export default async function AdminCommunitiesPage() {
  const { profile } = await requireRole(["admin"], routes.adminLogin);
  const communities = await getAllCommunitiesForAdmin();

  return (
    <AdminCommunitiesView
      adminName={`${profile.first_name} ${profile.last_name}`.trim()}
      communities={communities}
    />
  );
}

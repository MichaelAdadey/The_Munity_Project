import { requireRole } from "@/lib/require-role";
import { routes } from "@/lib/routes";
import { AdminModerationView } from "@/components/admin/AdminModerationView";
import { getReportsForAdmin } from "@/lib/admin/moderation-queries";

export default async function AdminModerationPage() {
  const { profile } = await requireRole(["admin"], routes.adminLogin);
  const reports = await getReportsForAdmin();

  return (
    <AdminModerationView
      adminName={`${profile.first_name} ${profile.last_name}`.trim()}
      reports={reports}
    />
  );
}

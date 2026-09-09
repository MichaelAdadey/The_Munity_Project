import { requireRole } from "@/lib/require-role";
import { routes } from "@/lib/routes";
import { AdminGrowthView } from "@/components/admin/AdminGrowthView";
import { getGrowthMetrics } from "@/lib/admin/growth-queries";

export default async function AdminGrowthPage() {
  const { profile } = await requireRole(["admin"], routes.adminLogin);
  const metrics = await getGrowthMetrics();

  return (
    <AdminGrowthView
      adminName={`${profile.first_name} ${profile.last_name}`.trim()}
      metrics={metrics}
    />
  );
}

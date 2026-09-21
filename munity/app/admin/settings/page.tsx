import { requireRole } from "@/lib/require-role";
import { routes } from "@/lib/routes";
import { AdminSettingsView } from "@/components/admin/AdminSettingsView";
import { getPlatformSettings } from "@/lib/admin/settings-queries";

export default async function AdminSettingsPage() {
  const { profile } = await requireRole(["admin"], routes.adminLogin);
  const settings = await getPlatformSettings();

  return (
    <AdminSettingsView
      adminName={`${profile.first_name} ${profile.last_name}`.trim()}
      settings={settings}
    />
  );
}

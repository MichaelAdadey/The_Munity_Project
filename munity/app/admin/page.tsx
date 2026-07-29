import { redirect } from "next/navigation";
import { AdminDashboardView } from "@/components/admin/AdminDashboardView";
import { routes } from "@/lib/routes";
import { createClient } from "@/lib/supabase/server";
import { USER_ROLES } from "@/lib/auth/roles";

export default async function AdminPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(routes.adminLogin);
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, first_name, last_name")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile || profile.role !== USER_ROLES.ADMIN) {
    redirect(routes.adminLogin);
  }

  const adminName = `${profile.first_name} ${profile.last_name}`.trim();

  return <AdminDashboardView adminName={adminName} />;
}

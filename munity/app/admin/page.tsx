import { redirect } from "next/navigation";
import { AdminDashboardView } from "@/components/admin/AdminDashboardView";
import { getMockSession } from "@/lib/mock-session";
import { routes } from "@/lib/routes";

export default async function AdminPage() {
  const session = await getMockSession();

  if (!session || session.role !== "admin") {
    redirect(routes.adminLogin);
  }

  return <AdminDashboardView adminName={session.name} />;
}

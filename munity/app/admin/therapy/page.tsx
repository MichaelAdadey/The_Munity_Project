import { redirect } from "next/navigation";
import { AdminSubpageView } from "@/components/admin/AdminSubpageView";
import { getMockSession } from "@/lib/mock-session";
import { routes } from "@/lib/routes";

export default async function AdminTherapyPage() {
  const session = await getMockSession();
  if (!session || session.role !== "admin") redirect(routes.adminLogin);
  return <AdminSubpageView adminName={session.name} section="therapy" />;
}

import { redirect } from "next/navigation";
import { AdminModerationView } from "@/components/admin/AdminModerationView";
import { getMockSession } from "@/lib/mock-session";
import { routes } from "@/lib/routes";

export default async function AdminModerationPage() {
  const session = await getMockSession();

  if (!session || session.role !== "admin") {
    redirect(routes.adminLogin);
  }

  return <AdminModerationView adminName={session.name} />;
}

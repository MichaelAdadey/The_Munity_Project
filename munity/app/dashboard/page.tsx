import { MemberDashboardView } from "@/components/dashboard/MemberDashboardView";
import { getDashboardBookingData } from "@/lib/dashboard/queries";
import { requireRole } from "@/lib/require-role";
import { routes } from "@/lib/routes";

export default async function MemberDashboardPage() {
  const { user } = await requireRole(["patient"], routes.login);
  const bookingData = await getDashboardBookingData(user.id);

  return <MemberDashboardView bookingData={bookingData} />;
}

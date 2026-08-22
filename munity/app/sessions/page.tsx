import { MemberSessionsView } from "@/components/sessions/MemberSessionsView";
import { requireRole } from "@/lib/require-role";
import { routes } from "@/lib/routes";
import { getMyBookings } from "@/lib/sessions/queries";

export default async function SessionsPage() {
  const { user } = await requireRole(["patient"], routes.login);
  const bookings = await getMyBookings(user.id);

  return <MemberSessionsView bookings={bookings} />;
}

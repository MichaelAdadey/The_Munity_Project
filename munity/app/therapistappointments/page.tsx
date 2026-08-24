import { TherapistAppointmentsView } from "@/components/therapistappointments/TherapistAppointmentsView";
import { requireRole } from "@/lib/require-role";
import { routes } from "@/lib/routes";
import { getAppointmentGroups } from "@/lib/therapist/appointments-queries";

export default async function TherapistAppointmentsPage() {
  const {user} = await requireRole(["therapist"], routes.therapistLogin)
  const groups = await getAppointmentGroups(user.id)

  return <TherapistAppointmentsView groups={groups} />;
}

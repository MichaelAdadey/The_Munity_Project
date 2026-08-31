import { requireRole } from "@/lib/require-role";
import { routes } from "@/lib/routes";
import { getTherapistPatients } from "@/lib/therapist/patients-queries";
import { TherapistCarePlanListView } from "@/components/therapistcareplan/TherapistCarePlanListView";

export default async function TherapistCarePlanPage() {
  const { user } = await requireRole(["therapist"], routes.therapistLogin);
  const patients = await getTherapistPatients(user.id);

  return <TherapistCarePlanListView patients={patients} />;
}

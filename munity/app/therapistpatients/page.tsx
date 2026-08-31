import { requireRole } from "@/lib/require-role";
import { routes } from "@/lib/routes";
import { getTherapistPatients } from "@/lib/therapist/patients-queries";
import { TherapistPatientsListView } from "@/components/therapistpatients/TherapistPatientsListView";

export default async function TherapistPatientsPage() {
  const { user } = await requireRole(["therapist"], routes.therapistLogin);
  const patients = await getTherapistPatients(user.id);

  return <TherapistPatientsListView patients={patients} />;
}

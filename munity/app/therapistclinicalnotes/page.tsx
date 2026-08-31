import { requireRole } from "@/lib/require-role";
import { routes } from "@/lib/routes";
import { getTherapistPatients } from "@/lib/therapist/patients-queries";
import { TherapistClinicalNotesListView } from "@/components/therapistclinicalnotes/TherapistClinicalNotesListView";

export default async function TherapistClinicalNotesPage() {
  const { user } = await requireRole(["therapist"], routes.therapistLogin);
  const patients = await getTherapistPatients(user.id);

  return <TherapistClinicalNotesListView patients={patients} />;
}

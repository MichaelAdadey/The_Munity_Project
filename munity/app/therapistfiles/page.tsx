import { requireRole } from "@/lib/require-role";
import { routes } from "@/lib/routes";
import { getTherapistPatients } from "@/lib/therapist/patients-queries";
import { TherapistFilesListView } from "@/components/therapistfiles/TherapistFilesListView";

export default async function TherapistFilesPage() {
  const { user } = await requireRole(["therapist"], routes.therapistLogin);
  const patients = await getTherapistPatients(user.id);

  return <TherapistFilesListView patients={patients} />;
}

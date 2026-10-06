import { requireRole } from "@/lib/require-role";
import { routes } from "@/lib/routes";
import { getTherapistPatients } from "@/lib/therapist/patients-queries";
import { getSessionNotesForTherapist } from "@/lib/therapist/session-notes-queries";
import { TherapistFilesListView } from "@/components/therapistfiles/TherapistFilesListView";

export default async function TherapistFilesPage() {
  const { user } = await requireRole(["therapist"], routes.therapistLogin);
  const [patients, notes] = await Promise.all([
    getTherapistPatients(user.id),
    getSessionNotesForTherapist(user.id),
  ]);

  return <TherapistFilesListView patients={patients} notes={notes} />;
}

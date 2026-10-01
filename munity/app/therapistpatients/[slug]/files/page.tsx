import { notFound } from "next/navigation";
import { PatientFilesView } from "@/components/therapistpatients/PatientFilesView";
import { requireRole } from "@/lib/require-role";
import { routes } from "@/lib/routes";
import { getTherapistPatientById } from "@/lib/therapist/patients-queries";
import { getSessionNotesForPatient } from "@/lib/therapist/session-notes-queries";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function PatientFilesPage({ params }: PageProps) {
  const { slug } = await params;
  const { user } = await requireRole(["therapist"], routes.therapistLogin);
  const patient = await getTherapistPatientById(user.id, slug);

  if (!patient) {
    notFound();
  }

  const notes = await getSessionNotesForPatient(user.id, patient.id);

  return <PatientFilesView patient={patient} notes={notes} />;
}

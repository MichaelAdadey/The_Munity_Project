import { notFound } from "next/navigation";
import { PatientOverviewView } from "@/components/therapistpatients/PatientOverviewView";
import { requireRole } from "@/lib/require-role";
import { routes } from "@/lib/routes";
import { getTherapistPatientById } from "@/lib/therapist/patients-queries";
import { getClinicianNoteForPatient } from "@/lib/therapist/clinician-notes-queries";
import { getMoodEntriesForPatient } from "@/lib/mood/mood-queries";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function PatientOverviewPage({ params }: PageProps) {
  const { slug } = await params;
  const { user } = await requireRole(["therapist"], routes.therapistLogin);
  const patient = await getTherapistPatientById(user.id, slug);

  if (!patient) {
    notFound();
  }

  const [clinicianNote, moodEntries] = await Promise.all([
    getClinicianNoteForPatient(user.id, patient.id),
    getMoodEntriesForPatient(patient.id, 30),
  ]);

  return (
    <PatientOverviewView
      patient={patient}
      therapistId={user.id}
      initialClinicianNote={clinicianNote?.body ?? ""}
      moodEntries={moodEntries}
    />
  );
}

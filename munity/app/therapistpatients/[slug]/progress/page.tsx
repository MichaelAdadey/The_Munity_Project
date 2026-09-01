import { notFound } from "next/navigation";
import { TherapeuticProgressView } from "@/components/therapistpatients/TherapeuticProgressView";
import { requireRole } from "@/lib/require-role";
import { routes } from "@/lib/routes";
import { getTherapistPatientById } from "@/lib/therapist/patients-queries";
import { getPatientProgress } from "@/lib/therapist/progress-queries";
import { getSessionNotesForPatient } from "@/lib/therapist/session-notes-queries";
import { resolveDateRange } from "@/lib/therapist/progress-shared";

const DEFAULT_RANGE = "Last 6 Months";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function PatientProgressPage({ params }: PageProps) {
  const { slug } = await params;
  const { user } = await requireRole(["therapist"], routes.therapistLogin);
  const patient = await getTherapistPatientById(user.id, slug);

  if (!patient) {
    notFound();
  }

  const { start, end } = resolveDateRange(DEFAULT_RANGE);
  const [progress, recentNotes] = await Promise.all([
    getPatientProgress(user.id, patient.id, start, end),
    getSessionNotesForPatient(user.id, patient.id),
  ]);

  return (
    <TherapeuticProgressView
      patient={patient}
      initialDateRange={DEFAULT_RANGE}
      initialProgress={progress}
      recentNotes={recentNotes.slice(0, 4)}
    />
  );
}

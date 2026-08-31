import { notFound } from "next/navigation";
import { ClinicalNotesView } from "@/components/therapistpatients/ClinicalNotesView";
import { requireRole } from "@/lib/require-role";
import { routes } from "@/lib/routes";
import { getTherapistPatientById } from "@/lib/therapist/patients-queries";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function PatientClinicalNotesPage({ params }: PageProps) {
  const { slug } = await params;
  const { user } = await requireRole(["therapist"], routes.therapistLogin);
  const patient = await getTherapistPatientById(user.id, slug);

  if (!patient) {
    notFound();
  }

  return <ClinicalNotesView patient={patient} />;
}

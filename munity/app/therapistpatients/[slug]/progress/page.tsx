import { notFound } from "next/navigation";
import { TherapeuticProgressView } from "@/components/therapistpatients/TherapeuticProgressView";
import { requireRole } from "@/lib/require-role";
import { routes } from "@/lib/routes";
import { getTherapistPatientById } from "@/lib/therapist/patients-queries";

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

  return <TherapeuticProgressView patient={patient} />;
}

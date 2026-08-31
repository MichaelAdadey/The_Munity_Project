import { notFound } from "next/navigation";
import { PatientOverviewView } from "@/components/therapistpatients/PatientOverviewView";
import { requireRole } from "@/lib/require-role";
import { routes } from "@/lib/routes";
import { getTherapistPatientById } from "@/lib/therapist/patients-queries";

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

  return <PatientOverviewView patient={patient} />;
}

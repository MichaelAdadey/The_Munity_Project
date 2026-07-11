import { notFound } from "next/navigation";
import { ClinicalNotesView } from "@/components/therapistpatients/ClinicalNotesView";
import { getPatient } from "@/lib/routes";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function PatientClinicalNotesPage({ params }: PageProps) {
  const { slug } = await params;
  const patient = getPatient(slug);

  if (!patient) {
    notFound();
  }

  return <ClinicalNotesView patient={patient} />;
}

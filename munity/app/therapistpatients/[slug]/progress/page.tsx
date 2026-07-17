import { notFound } from "next/navigation";
import { TherapeuticProgressView } from "@/components/therapistpatients/TherapeuticProgressView";
import { getPatient } from "@/lib/routes";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function PatientProgressPage({ params }: PageProps) {
  const { slug } = await params;
  const patient = getPatient(slug);

  if (!patient) {
    notFound();
  }

  return <TherapeuticProgressView patient={patient} />;
}

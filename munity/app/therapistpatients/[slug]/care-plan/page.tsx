import { notFound } from "next/navigation";
import { PatientCarePlanView } from "@/components/therapistpatients/PatientCarePlanView";
import { getPatient } from "@/lib/routes";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function PatientCarePlanPage({ params }: PageProps) {
  const { slug } = await params;
  const patient = getPatient(slug);

  if (!patient) {
    notFound();
  }

  return <PatientCarePlanView patient={patient} />;
}

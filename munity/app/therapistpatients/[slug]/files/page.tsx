import { notFound } from "next/navigation";
import { PatientFilesView } from "@/components/therapistpatients/PatientFilesView";
import { getPatient } from "@/lib/routes";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function PatientFilesPage({ params }: PageProps) {
  const { slug } = await params;
  const patient = getPatient(slug);

  if (!patient) {
    notFound();
  }

  return <PatientFilesView patient={patient} />;
}

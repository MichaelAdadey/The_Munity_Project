import { notFound } from "next/navigation";
import { PatientOverviewView } from "@/components/patients/PatientOverviewView";
import { getPatient } from "@/lib/routes";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function PatientOverviewPage({ params }: PageProps) {
  const { slug } = await params;
  const patient = getPatient(slug);

  if (!patient) {
    notFound();
  }

  return <PatientOverviewView patient={patient} />;
}

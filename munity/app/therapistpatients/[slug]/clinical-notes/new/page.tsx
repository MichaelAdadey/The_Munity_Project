import { notFound } from "next/navigation";
import { NewSessionNoteView } from "@/components/therapistpatients/NewSessionNoteView";
import { getPatient } from "@/lib/routes";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function NewSessionNotePage({ params }: PageProps) {
  const { slug } = await params;
  const patient = getPatient(slug);

  if (!patient) {
    notFound();
  }

  return <NewSessionNoteView patient={patient} />;
}

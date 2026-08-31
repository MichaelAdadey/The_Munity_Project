import { notFound } from "next/navigation";
import { NewSessionNoteView } from "@/components/therapistpatients/NewSessionNoteView";
import { requireRole } from "@/lib/require-role";
import { routes } from "@/lib/routes";
import { getTherapistPatientById } from "@/lib/therapist/patients-queries";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function NewSessionNotePage({ params }: PageProps) {
  const { slug } = await params;
  const { user } = await requireRole(["therapist"], routes.therapistLogin);
  const patient = await getTherapistPatientById(user.id, slug);

  if (!patient) {
    notFound();
  }

  return <NewSessionNoteView patient={patient} />;
}

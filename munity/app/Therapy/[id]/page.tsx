import { TherapistDetailView } from "@/components/therapy/TherapistDetailView";
import { getMemberLoggedIn } from "@/lib/member-auth";
import { getTherapistById } from "@/lib/therapy/queries";

export default async function TherapistDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const isLoggedIn = await getMemberLoggedIn();
  const therapist = await getTherapistById(id)

  return <TherapistDetailView therapist={therapist} isLoggedIn={isLoggedIn} />;
}

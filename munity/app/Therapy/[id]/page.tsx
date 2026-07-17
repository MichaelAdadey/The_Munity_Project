import { TherapistDetailView } from "@/components/therapy/TherapistDetailView";
import { getMemberLoggedIn } from "@/lib/member-auth";

export default async function TherapistDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const isLoggedIn = await getMemberLoggedIn();
  return <TherapistDetailView id={id} isLoggedIn={isLoggedIn} />;
}

import { TherapyView } from "@/components/therapy/TherapyView";
import { getMemberLoggedIn } from "@/lib/member-auth";
import { getTherapistDirectory } from "@/lib/therapy/queries";

export default async function TherapyPage() {
  const isLoggedIn = await getMemberLoggedIn()
  const therapists = await getTherapistDirectory();

  return <TherapyView isLoggedIn={isLoggedIn} therapists={therapists} />;
}

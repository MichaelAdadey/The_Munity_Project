import { TherapyView } from "@/components/therapy/TherapyView";
import { getMemberLoggedIn } from "@/lib/member-auth";

export default async function TherapyPage() {
  const isLoggedIn = await getMemberLoggedIn();
  return <TherapyView isLoggedIn={isLoggedIn} />;
}

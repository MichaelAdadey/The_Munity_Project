import { CommunitiesView } from "@/components/communities/CommunitiesView";
import { getMemberLoggedIn } from "@/lib/member-auth";

export default async function CommunitiesPage() {
  const isLoggedIn = await getMemberLoggedIn();
  return <CommunitiesView isLoggedIn={isLoggedIn} />;
}

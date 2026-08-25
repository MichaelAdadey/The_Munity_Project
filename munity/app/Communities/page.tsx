import { CommunitiesView } from "@/components/communities/CommunitiesView";
import { getCommunities, getMyMembershipIds } from "@/lib/communities/queries";
import { getMemberLoggedIn } from "@/lib/member-auth";

export default async function CommunitiesPage() {
  const isLoggedIn = await getMemberLoggedIn();
  const [communities, membershipIds] = await Promise.all([
    getCommunities(),
    getMyMembershipIds(),
  ]);
  return (
    <CommunitiesView
      isLoggedIn={isLoggedIn}
      communities={communities}
      initialMembershipIds={membershipIds}
    />
  );
}

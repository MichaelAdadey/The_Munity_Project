import { CommunityDetailView } from "@/components/communities/CommunityDetailView";
import {
  getCommunityBySlug,
  getCommunityPosts,
} from "@/lib/communities/detail-queries";
import { getMyMembershipIds } from "@/lib/communities/queries";
import { getMemberLoggedIn } from "@/lib/member-auth";

export default async function CommunityDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const isLoggedIn = await getMemberLoggedIn();
  const community = await getCommunityBySlug(slug);

  if (!community) {
    <CommunityDetailView
      community={null}
      posts={[]}
      isLoggedIn={isLoggedIn}
      isJoined={false}
    />;
  }

  const [posts, membershipIds] = await Promise.all([
    getCommunityPosts(community?.id ?? ""),
    getMyMembershipIds(),
  ]);

  return (
    <CommunityDetailView
      community={community}
      posts={posts}
      isLoggedIn={isLoggedIn}
      isJoined={membershipIds.includes(community?.id ?? "")}
    />
  );
}

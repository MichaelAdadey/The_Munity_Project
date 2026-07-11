import { CommunityDetailView } from "@/components/communities/CommunityDetailView";
import { getMemberLoggedIn } from "@/lib/member-auth";

export default async function CommunityDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const isLoggedIn = await getMemberLoggedIn();
  return <CommunityDetailView slug={slug} isLoggedIn={isLoggedIn} />;
}

import { createClient } from "../supabase/server";

export type CommunityListItem = {
  id: string;
  slug: string;
  name: string;
  tag: string | null;
  description: string | null;
  longDescription: string | null;
  category: string | null;
  image: string | null;
  verified: boolean;
  memberCount: number;
  membersLabel: string;
};

export const formatMemberCount = (count: number): string => {
  if (count >= 1000) return `${(count / 1000).toFixed(1)}k members`;
  return `${count} member${count === 1 ? "" : "s"}`;
};

export const getCommunities = async (): Promise<CommunityListItem[]> => {
  const supabase = await createClient();

  const [
    { data: communities, error: communitiesError },
    { data: counts, error: countsError },
  ] = await Promise.all([
    supabase
      .from("communities")
      .select("*")
      .order("created_at", { ascending: true }),
    supabase
      .from("community_member_counts")
      .select("community_id, member_count"),
  ]);

  if (communitiesError) throw new Error(communitiesError.message);
  if (countsError) throw new Error(countsError.message);

  const countById = new Map(
    (counts ?? []).map((c) => [
      c.community_id as string,
      c.member_count as number,
    ]),
  );

  return (communities ?? []).map((row) => {
    const memberCount = countById.get(row.id as string) ?? 0;
    return {
      id: row.id as string,
      slug: row.slug as string,
      name: row.name as string,
      tag: row.tag as string | null,
      description: row.description as string | null,
      longDescription: row.long_description as string | null,
      category: row.category as string | null,
      image: row.image_url as string | null,
      verified: row.verified as boolean,
      memberCount,
      membersLabel: formatMemberCount(memberCount),
    };
  });
};

export const getMyMembershipIds = async (): Promise<string[]> => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("community_members")
    .select("community_id")
    .eq("user_id", user.id);

  if (error) throw new Error(error.message);
  return (data ?? []).map((row) => row.community_id as string);
};

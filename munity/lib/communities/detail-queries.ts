import { MOOD_DB_TO_LABEL, PostMood } from "@/types/feed";
import { toFullName } from "../profile/display-name";
import { createClient } from "../supabase/server";
import { CommunityListItem, formatMemberCount } from "./queries";

export const getCommunityBySlug = async (
  slug: string,
): Promise<CommunityListItem | null> => {
  const supabase = await createClient();

  const { data: community, error } = await supabase
    .from("communities")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!community) return null;

  const { data: countRow } = await supabase
    .from("community_member_counts")
    .select("member_count")
    .eq("community_id", community.id)
    .maybeSingle();

  const memberCount = (countRow?.member_count as number | undefined) ?? 0;

  return {
    id: community.id as string,
    slug: community.slug as string,
    name: community.name as string,
    tag: community.tag as string | null,
    description: community.description as string | null,
    longDescription: community.long_description as string | null,
    category: community.category as string | null,
    image: community.image_url as string | null,
    verified: community.verified as boolean,
    memberCount,
    membersLabel: formatMemberCount(memberCount),
  };
};

export type CommunityPost = {
  id: string;
  author: string;
  time: string;
  feeling: string;
  content: string;
  supports: number;
  comments: number;
};

export const getCommunityPosts = async (
  communityId: string,
): Promise<CommunityPost[]> => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("posts")
    .select(
      `id,
       content,
       mood,
       is_anonymous,
       created_at,
       profiles!posts_author_id_fkey ( first_name, last_name ),
       post_supports ( user_id ),
       post_comments ( id )`,
    )
    .eq("community_id", communityId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  return (data ?? []).map((row) => {
    const profile = row.profiles as unknown as {
      first_name: string;
      last_name: string;
    } | null;
    const fullName = profile
      ? toFullName(profile.first_name, profile.last_name)
      : "Member";
    const moodLabel = MOOD_DB_TO_LABEL[row.mood as PostMood] ?? "Reflective";
    const supports = (row.post_supports as unknown[] | null) ?? [];
    const comments = (row.post_comments as unknown[] | null) ?? [];

    return {
      id: row.id as string,
      author: row.is_anonymous ? "Anonymous Member" : fullName,
      time: new Date(row.created_at as string).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      }),
      feeling: `Feeling ${moodLabel}`,
      content: row.content as string,
      supports: supports.length,
      comments: comments.length,
    };
  });
};

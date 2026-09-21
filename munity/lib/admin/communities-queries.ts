import { createClient } from "@/lib/supabase/server";

export type AdminCommunity = {
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
  createdAt: string;
};

export async function getAllCommunitiesForAdmin(): Promise<AdminCommunity[]> {
  const supabase = await createClient();

  const [{ data: communities, error }, { data: counts }] = await Promise.all([
    supabase
      .from("communities")
      .select("*")
      .order("created_at", { ascending: false }),
    supabase
      .from("community_member_counts")
      .select("community_id, member_count"),
  ]);

  if (error) throw new Error(error.message);

  const countById = new Map(
    (counts ?? []).map((c) => [
      c.community_id as string,
      c.member_count as number,
    ]),
  );

  return (communities ?? []).map((row) => ({
    id: row.id as string,
    slug: row.slug as string,
    name: row.name as string,
    tag: row.tag as string | null,
    description: row.description as string | null,
    longDescription: row.long_description as string | null,
    category: row.category as string | null,
    image: row.image_url as string | null,
    verified: row.verified as boolean,
    memberCount: countById.get(row.id as string) ?? 0,
    createdAt: row.created_at as string,
  }));
}

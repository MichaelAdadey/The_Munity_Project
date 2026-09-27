"use client";

import { createClient } from "@/lib/supabase/client";

export type SearchPost = {
  type: "post";
  id: string;
  content: string;
  authorName: string;
};
export type SearchPerson = {
  type: "therapist" | "patient";
  id: string;
  name: string;
  subtitle: string | null;
};
export type SearchCommunity = {
  type: "community";
  id: string;
  slug: string;
  name: string;
};
export type SearchResource = {
  type: "resource";
  id: string;
  title: string;
  category: string;
};

export type GlobalSearchResults = {
  posts: SearchPost[];
  people: SearchPerson[];
  communities: SearchCommunity[];
  resources: SearchResource[];
};

const EMPTY: GlobalSearchResults = {
  posts: [],
  people: [],
  communities: [],
  resources: [],
};

export async function globalSearch(
  query: string,
): Promise<GlobalSearchResults> {
  const trimmed = query.trim();
  if (trimmed.length < 2) return EMPTY;

  const supabase = createClient();
  const like = `%${trimmed}%`;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [
    postsRes,
    patientsRes,
    therapistProfilesRes,
    communitiesRes,
    resourcesRes,
  ] = await Promise.all([
    supabase
      .from("posts")
      .select(
        "id, content, is_anonymous, profiles!posts_author_id_fkey(first_name, last_name)",
      )
      .ilike("content", like)
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("profiles")
      .select("id, first_name, last_name")
      .eq("role", "patient")
      .neq("id", user?.id ?? "")
      .or(
        `first_name.ilike.${like},last_name.ilike.${like},username.ilike.${like}`,
      )
      .limit(5),
    supabase
      .from("profiles")
      .select("id, first_name, last_name")
      .eq("role", "therapist")
      .or(
        `first_name.ilike.${like},last_name.ilike.${like},username.ilike.${like}`,
      )
      .limit(10),
    supabase
      .from("communities")
      .select("id, slug, name")
      .or(`name.ilike.${like},description.ilike.${like}`)
      .limit(5),
    supabase
      .from("resources")
      .select("id, title, category")
      .eq("status", "published")
      .or(`title.ilike.${like},description.ilike.${like}`)
      .limit(5),
  ]);

  // Therapists need a second pass to confirm verification, since that lives
  // on therapist_details rather than profiles.
  const candidateIds = (therapistProfilesRes.data ?? []).map(
    (row) => row.id as string,
  );
  const { data: verifiedDetails } =
    candidateIds.length > 0
      ? await supabase
          .from("therapist_details")
          .select("profile_id, professional_title, title")
          .in("profile_id", candidateIds)
          .eq("verification_status", "verified")
      : {
          data: [] as {
            profile_id: string;
            professional_title: string | null;
            title: string | null;
          }[],
        };

  const detailsById = new Map(
    (verifiedDetails ?? []).map((d) => [d.profile_id, d]),
  );
  const profileById = new Map(
    (therapistProfilesRes.data ?? []).map((p) => [p.id as string, p]),
  );

  const posts: SearchPost[] = (postsRes.data ?? []).map((row) => {
    const profile = row.profiles as unknown as {
      first_name: string;
      last_name: string;
    } | null;
    const name = profile
      ? `${profile.first_name} ${profile.last_name}`.trim()
      : "Member";
    return {
      type: "post",
      id: row.id as string,
      content: row.content as string,
      authorName: row.is_anonymous ? "Anonymous Member" : name,
    };
  });

  const people: SearchPerson[] = [
    ...Array.from(detailsById.entries()).map(([id, details]) => {
      const profile = profileById.get(id);
      return {
        type: "therapist" as const,
        id,
        name: profile
          ? `${profile.first_name} ${profile.last_name}`.trim()
          : "Therapist",
        subtitle: details.professional_title || details.title || "Therapist",
      };
    }),
    ...(patientsRes.data ?? []).map((row) => ({
      type: "patient" as const,
      id: row.id as string,
      name: `${row.first_name} ${row.last_name}`.trim(),
      subtitle: null,
    })),
  ];

  const communities: SearchCommunity[] = (communitiesRes.data ?? []).map(
    (row) => ({
      type: "community",
      id: row.id as string,
      slug: row.slug as string,
      name: row.name as string,
    }),
  );

  const resources: SearchResource[] = (resourcesRes.data ?? []).map((row) => ({
    type: "resource",
    id: row.id as string,
    title: row.title as string,
    category: row.category as string,
  }));

  return { posts, people, communities, resources };
}

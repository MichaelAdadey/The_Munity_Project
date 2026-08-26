"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "../supabase/client";

export type CommunityOption = {
  id: string;
  name: string;
  slug: string;
};

const formatMemberCount = (count: number): string => {
  if (count >= 1000) return `${(count / 1000).toFixed(1)}k members`;
  return `${count} member${count === 1 ? "" : "s"}`;
};

export const fetchCommunityOptions = async (): Promise<CommunityOption[]> => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("communities")
    .select("id, name, slug")
    .order("name", { ascending: true });

  if (error) throw new Error(error.message);

  return (data ?? []).map((row) => ({
    id: row.id as string,
    name: row.name as string,
    slug: row.slug as string,
  }));
};

export const useCommunityOptions = (flash: (message: string) => void) => {
  const [options, setOptions] = useState<CommunityOption[]>([]);

  const load = useCallback(() => {
    void (async () => {
      try {
        const data = await fetchCommunityOptions();
        setOptions(data);
      } catch (error) {
        flash(
          error instanceof Error ? error.message : "Couldn't load communities",
        );
      }
    })();
  }, [flash]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      load();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [load]);

  return options;
};

export type CommunitySummary = {
  id: string;
  slug: string;
  name: string;
  membersLabel: string;
};

export const fetchCommunitiesWithCounts = async (): Promise<
  CommunitySummary[]
> => {
  const supabase = createClient();
  const [
    { data: communities, error: communitiesError },
    { data: counts, error: countsError },
  ] = await Promise.all([
    supabase
      .from("communities")
      .select("id, slug, name")
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

  return (communities ?? []).map((row) => ({
    id: row.id as string,
    name: row.name as string,
    slug: row.slug as string,
    membersLabel: formatMemberCount(countById.get(row.id as string) ?? 0),
  }));
};

export const fetchMyMembershipIds = async (): Promise<string[]> => {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("community_members")
    .select("community_id")
    .eq("user_id", user.id);
  if (error) throw new Error(error.message);
  return (data ?? []).map((r) => r.community_id as string);
};

export const useMyCommunities = (flash: (message: string) => void) => {
  const [communities, setCommunities] = useState<CommunitySummary[]>([]);
  const [membershipIds, setMembershipIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    void (async () => {
      try {
        const [communities, ids] = await Promise.all([
          fetchCommunitiesWithCounts(),
          fetchMyMembershipIds(),
        ]);
        setCommunities(communities);
        setMembershipIds(ids);
      } catch (error) {
        flash(
          error instanceof Error ? error.message : "Couldn't load communities",
        );
      } finally {
        setLoading(false);
      }
    })();
  }, [flash]);

  useEffect(() => {
    const timer = window.setTimeout(load, 0);
    return () => window.clearTimeout(timer);
  }, [load]);

  return {
    joined: communities.filter((c) => membershipIds.includes(c.id)),
    suggested: communities.filter((c) => !membershipIds.includes(c.id)),
    loading,
    refresh: load,
  };
};

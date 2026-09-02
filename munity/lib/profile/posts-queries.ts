"use client";

import { MOOD_DB_TO_LABEL, type PostMood } from "@/types/feed";
import { createClient } from "../supabase/client";
import { formatRelativeTime } from "../feed/time";
import { useCallback, useEffect, useState } from "react";

export type MyPostSummary = {
  id: string;
  content: string;
  feeling: string;
  communityName: string | null;
  time: string;
  supports: number;
  comments: number;
};

export const fetchMyPosts = async (): Promise<MyPostSummary[]> => {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("posts")
    .select(
      `id,
       content,
       mood,
       created_at,
       communities ( name ),
       post_supports ( user_id ),
       post_comments ( id )`,
    )
    .eq("author_id", user.id)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  return (data ?? []).map((row) => {
    const community = row.communities as unknown as { name: string } | null;
    const supports = (row.post_supports as unknown[] | null) ?? [];
    const comments = (row.post_comments as unknown[] | null) ?? [];

    return {
      id: row.id as string,
      content: row.content as string,
      feeling: `Feeling ${MOOD_DB_TO_LABEL[row.mood as PostMood] ?? "Reflective"}`,
      communityName: community?.name ?? null,
      time: formatRelativeTime(row.created_at as string),
      supports: supports.length,
      comments: comments.length,
    };
  });
};

export function useMyPosts(flash: (message: string) => void) {
  const [posts, setPosts] = useState<MyPostSummary[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    void (async () => {
      try {
        const data = await fetchMyPosts();
        setPosts(data);
      } catch (err) {
        flash(err instanceof Error ? err.message : "Couldn't load your posts");
      } finally {
        setLoading(false);
      }
    })();
  }, [flash]);

  useEffect(() => {
    const timer = window.setTimeout(load, 0);
    return () => window.clearTimeout(timer);
  }, [load]);

  return { posts, loading, refresh: load };
}

/**
 * Load the home feed from Supabase (client-side).
 */

"use client";

import { formatRelativeTime } from "@/lib/feed/time";
import { toFullName } from "@/lib/profile/display-name";
import { createClient } from "@/lib/supabase/client";
import {
  FeedComment,
  FeedPost,
  MOOD_DB_TO_LABEL,
  PostMood,
} from "@/types/feed";
import { startTransition, useCallback, useEffect, useState } from "react";

type FeedState = {
  posts: FeedPost[];
  commentsByPost: Record<string, FeedComment[]>;
  loading: boolean;
  error: string | null;
  refresh: () => void;
};

type PostRow = {
  id: string;
  author_id: string;
  content: string;
  image_url: string;
  mood: PostMood;
  is_anonymous: boolean;
  created_at: string;
  profiles: { first_name: string; last_name: string } | null;
  post_supports: { user_id: string }[] | null;
  post_comments:
    | {
        id: string;
        post_id: string;
        author_id: string;
        content: string;
        created_at: string;
        profiles: { first_name: string; last_name: string } | null;
      }[]
    | null;
  saved_posts: { user_id: string }[] | null;
};

type FeedPayload = {
  posts: FeedPost[];
  commentsByPost: Record<string, FeedComment[]>;
};

const fetchFeed = async (): Promise<FeedPayload> => {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Nested selects need FK relationships (created by our migration)
  const { data, error: queryError } = await supabase
    .from("posts")
    .select(
      `id,
        author_id,
        content,
        image_url,
        mood,
        is_anonymous,
        created_at,
        profiles!posts_author_id_fkey ( first_name, last_name ),
        post_supports ( user_id ),
        post_comments (
          id,
          post_id,
          author_id,
          content,
          created_at,
          profiles!post_comments_author_id_fkey ( first_name, last_name )
        ),
        saved_posts ( user_id )`,
    )
    .order("created_at", { ascending: false });

  if (queryError) {
    throw new Error(queryError.message);
  }

  const me = user?.id ?? null;
  const commentsByPost: Record<string, FeedComment[]> = {};
  const posts: FeedPost[] = ((data ?? []) as unknown as PostRow[]).map(
    (row) => {
      const fullName = row.profiles
        ? toFullName(row.profiles.first_name, row.profiles.last_name)
        : "Member";
      const supports = row.post_supports ?? [];
      const comments = row.post_comments ?? [];
      const saves = row.saved_posts ?? [];

      commentsByPost[row.id] = comments
        .slice()
        .sort(
          (a, b) =>
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
        )
        .map((c) => ({
          id: c.id,
          postId: c.post_id,
          authorId: c.author_id,
          author: c.profiles
            ? toFullName(c.profiles.first_name, c.profiles.last_name)
            : "Member",
          content: c.content,
          createdAt: c.created_at,
        }));

      const moodLabel = MOOD_DB_TO_LABEL[row.mood];

      return {
        id: row.id,
        authorId: row.author_id,
        content: row.content,
        imageUrl: row.image_url,
        mood: row.mood,
        feeling: `Feeling ${moodLabel}`,
        isAnonymous: row.is_anonymous,
        createdAt: row.created_at,
        author: row.is_anonymous ? "Anonymous Member" : fullName,
        avatarUrl: null, // wire later when avatars live in profiles
        supportCount: supports.length,
        commentCount: comments.length,
        supportedByMe: me ? supports.some((s) => s.user_id === me) : false,
        // saved_posts RLS only returns *my* rows, so any row means saved
        savedByMe: saves.length > 0,
        isMine: me === row.author_id,
      };
    },
  );

  return { posts, commentsByPost };
};

export const useFeed = (): FeedState => {
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [commentsByPost, setCommentsByPost] = useState<
    Record<string, FeedComment[]>
  >({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /** Safe to call from click handlers (Post, Support, etc.) */
  const refresh = useCallback(() => {
    // Event-handler / deferred path — not sync inside an effect body
    void (async () => {
      try {
        const payload = await fetchFeed();
        startTransition(() => {
          setPosts(payload.posts);
          setCommentsByPost(payload.commentsByPost);
          setError(null);
          setLoading(false);
        });
      } catch (error) {
        startTransition(() => {
          setError(
            error instanceof Error ? error.message : "Failed to load feed",
          );
          setPosts([]);
          setCommentsByPost({});
          setLoading(false);
        });
      }
    });
  }, []);

  useEffect(() => {
    let cancelled = false;

    // Defer so setState is NOT synchronous in the effect (satisfies the lint)
    const timer = window.setTimeout(() => {
      void (async () => {
        try {
          const payload = await fetchFeed();
          if (cancelled) return;
          startTransition(() => {
            setPosts(payload.posts);
            setCommentsByPost(payload.commentsByPost);
            setError(null);
            setLoading(false);
          });
        } catch (error) {
          if (cancelled) return;
          startTransition(() => {
            setError(
              error instanceof Error ? error.message : "Failed to load feed",
            );
            setPosts([]);
            setCommentsByPost({});
            setLoading(false);
          });
        }
      })();
    }, 0);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, []);

  return { posts, commentsByPost, loading, error, refresh };
};

/** Re-export time helper for post cards: formatRelativeTime(post.createdAt) */
export { formatRelativeTime };

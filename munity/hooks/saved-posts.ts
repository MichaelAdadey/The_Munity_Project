"use client";

import { toFullName } from "@/lib/profile/display-name";
import { createClient } from "@/lib/supabase/client";
import {
  FeedComment,
  FeedPost,
  MOOD_DB_TO_LABEL,
  PostMood,
} from "@/types/feed";
import { startTransition, useCallback, useEffect, useState } from "react";
import { formatRelativeTime } from "./use-feed";

type FeedState = {
  posts: FeedPost[];
  commentsByPost: Record<string, FeedComment[]>;
  loading: boolean;
  error: string | null;
  refresh: () => void;
};

type SavedPostRow = {
  post_id: string;
  created_at: string;
  posts: {
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
  } | null;
};

type FeedPayLoad = {
  posts: FeedPost[];
  commentsByPost: Record<string, FeedComment[]>;
};

const fetchSavedPosts = async (): Promise<FeedPayLoad> => {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { posts: [], commentsByPost: {} };
  }

  const { data, error: querryError } = await supabase
    .from("saved_posts")
    .select(
      `post_id,
        created_at,
        posts:post_id (
          id,
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
          )
        )`,
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (querryError) {
    throw new Error(querryError.message);
  }

  const me = user.id;
  const commentsByPost: Record<string, FeedComment[]> = {};

  const posts: FeedPost[] = ((data ?? []) as unknown as SavedPostRow[])
    // guard against a post being deleted while still referenced in saved_posts
    .filter((row) => row.posts !== null)
    .map((row) => {
      const post = row.posts!;
      const fullName = post.profiles
        ? toFullName(post.profiles.first_name, post.profiles.last_name)
        : "Member";
      const supports = post.post_supports ?? [];
      const comments = post.post_comments ?? [];

      commentsByPost[post.id] = comments
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

      const moodLabel = MOOD_DB_TO_LABEL[post.mood];

      return {
        id: post.id,
        authorId: post.author_id,
        content: post.content,
        imageUrl: post.image_url,
        mood: post.mood,
        feeling: `Feeling ${moodLabel}`,
        isAnonymous: post.is_anonymous,
        createdAt: post.created_at,
        author: post.is_anonymous ? "Anonymous Member" : fullName,
        avatarUrl: null,
        supportCount: supports.length,
        commentCount: comments.length,
        supportedByMe: supports.some((s) => s.user_id === me),
        savedByMe: true, // it's in this list, so it's saved
        isMine: me === post.author_id,
      };
    });

  return { posts, commentsByPost };
};

export const useSavedPosts = (): FeedState => {
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [commentsByPost, setCommentsByPost] = useState<
    Record<string, FeedComment[]>
  >({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    void (async () => {
      try {
        const payLoad = await fetchSavedPosts();
        startTransition(() => {
          setPosts(payLoad.posts);
          setCommentsByPost(payLoad.commentsByPost);
          setError(null);
          setLoading(false);
        });
      } catch (error) {
        startTransition(() => {
          setError(
            error instanceof Error
              ? error.message
              : "Failed to load saved posts",
          );
          setPosts([]);
          setCommentsByPost({});
          setLoading(false);
        });
      }
    })();
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { posts, commentsByPost, loading, error, refresh: load };
};

export { formatRelativeTime };

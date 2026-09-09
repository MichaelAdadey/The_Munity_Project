/**
 * Feed Server Actions — replace mockStore.createPost / toggleSupport / etc.
 */

"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "../supabase/server";
import {
  commentSchema,
  createPostSchema,
  postMoodSchema,
} from "../validations/feed";

export type FeedActionState = {
  error?: string;
  success?: string;
};

/** Create a text or text+photo post with a required mood */
export const createPost = async (input: {
  content: string;
  mood: string;
  isAnonymous?: boolean;
  imageUrl?: string | null;
  communityId?: string | null;
}): Promise<FeedActionState> => {
  const parsed = createPostSchema.safeParse({
    content: input.content,
    mood: input.mood,
    isAnonymous: input.isAnonymous ?? false,
    imageUrl: input.imageUrl ?? null,
    communityId: input.communityId ?? null,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be signed in to post." };
  }

  const { error } = await supabase.from("posts").insert({
    author_id: user.id,
    content: parsed.data.content,
    mood: parsed.data.mood,
    is_anonymous: parsed.data.isAnonymous,
    image_url: parsed.data.imageUrl,
    community_id: parsed.data.communityId,
  });

  if (error) return { error: error.message };

  revalidatePath("/home");
  if (parsed.data.communityId) {
    revalidatePath("/Communities/[slug]", "page")
  }
  return { success: "Posted" };
};

export const updatePost = async (input: {
  postId: string;
  content: string;
  imageUrl?: string | null;
}): Promise<FeedActionState> => {
  const content = input.content.trim();
  if (content.length === 0 && !input.imageUrl) {
    return { error: "Add text or a photo before saving." };
  }
  if (content.length > 2000) {
    return { error: "Post is too long." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You must be signed in." };

  const { error } = await supabase
    .from("posts")
    .update({
      content,
      image_url: input.imageUrl ?? null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", input.postId)
    .eq("author_id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/home");
  return { success: "Post updated" };
};

export const deletePost = async (postId: string): Promise<FeedActionState> => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be signed in." };
  }

  const { error } = await supabase
    .from("posts")
    .delete()
    .eq("id", postId)
    .eq("author_id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/home");
  return { success: "Post deleted" };
};

export const toggleSupport = async (
  postId: string,
): Promise<FeedActionState> => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "You are not signed in." };

  const { data: existing } = await supabase
    .from("post_supports")
    .select("post_id")
    .eq("post_id", postId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase
      .from("post_supports")
      .delete()
      .eq("post_id", postId)
      .eq("user_id", user.id);
    if (error) return { error: error.message };
  } else {
    const { error } = await supabase.from("post_supports").insert({
      post_id: postId,
      user_id: user.id,
    });
    if (error) return { error: error.message };
  }

  revalidatePath("/home");
  return { success: "ok" };
};

export const toggleSavePost = async (
  postId: string,
): Promise<FeedActionState> => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "You are not signed in." };

  const { data: existing } = await supabase
    .from("saved_posts")
    .select("post_id")
    .eq("post_id", postId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase
      .from("saved_posts")
      .delete()
      .eq("post_id", postId)
      .eq("user_id", user.id);
    if (error) return { error: error.message };
  } else {
    const { error } = await supabase.from("saved_posts").insert({
      post_id: postId,
      user_id: user.id,
    });
    if (error) return { error: error.message };
  }

  revalidatePath("/home");
  return { success: "ok" };
};

export const addComment = async (
  postId: string,
  content: string,
): Promise<FeedActionState> => {
  const parsed = commentSchema.safeParse({ postId, content });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid comment" };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "You are not signed in." };

  const { error } = await supabase.from("post_comments").insert({
    post_id: parsed.data.postId,
    author_id: user.id,
    content: parsed.data.content,
  });

  if (error) return { error: error.message };

  revalidatePath("/home");
  return { success: "Comment added" };
};

/** Validate mood string from the UI before createPost */
export const parsedMood = async (mood: string) => {
  return postMoodSchema.safeParse(mood.toLowerCase());
};

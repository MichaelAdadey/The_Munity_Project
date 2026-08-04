/**
 * Feed / post domain types (home feed).
 * DB stores mood lowercase; UI often shows "Happy", "Calm", etc.
 */

export type PostMood = "happy" | "calm" | "stressed" | "sad" | "anxious";

/** UI mood labels used by MoodIcons / HomeFeedView */
export type MoodLabel = "Happy" | "Calm" | "Stressed" | "Sad" | "Anxious";

export const MOOD_LABEL_TO_DB: Record<MoodLabel, PostMood> = {
  Happy: "happy",
  Calm: "calm",
  Stressed: "stressed",
  Sad: "sad",
  Anxious: "anxious",
};

export const MOOD_DB_TO_LABEL: Record<PostMood, MoodLabel> = {
  happy: "Happy",
  calm: "Calm",
  stressed: "Stressed",
  sad: "Sad",
  anxious: "Anxious",
};

/** One row in public.posts (+ fields the feed card needs) */
export type FeedPost = {
  id: string;
  authorId: string;
  content: string;
  imageUrl: string | null;
  mood: PostMood;
  /** Display string e.g. "Feeling Calm" */
  feeling: string;
  isAnonymous: boolean;
  createdAt: string;
  /** Display author name (or "Anonymous Member") */
  author: string;
  avatarUrl: string | null;
  supportCount: number;
  commentCount: number;
  supportedByMe: boolean;
  savedByMe: boolean;
  /** True when the signed-in user owns this post (show Delete) */
  isMine: boolean;
};

export type FeedComment = {
  id: string;
  postId: string;
  authorId: string;
  author: string;
  content: string;
  createdAt: string;
};

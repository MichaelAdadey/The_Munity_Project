/**
 * Zod schemas for feed mutations.
 */

import { z } from "zod";

export const postMoodSchema = z.enum([
  "happy",
  "calm",
  "stressed",
  "sad",
  "anxious",
]);

export const createPostSchema = z
  .object({
    content: z.string().trim().max(2000, "Post is too long"),
    mood: postMoodSchema,
    isAnonymous: z.boolean().default(false),
    // Public URL after upload to storage (optional)
    imageUrl: z.url().nullable().optional(),
    communityId: z.uuid().nullable().optional()
  })
  .refine((data) => data.content.length > 0 || Boolean(data.imageUrl), {
    error: "Add text or a photo before posting",
    path: ["content"],
  });

export const commentSchema = z.object({
  postId: z.uuid(),
  content: z.string().trim().min(1, "Comment cannot be empty").max(1000),
});

export type CreatePostInput = z.infer<typeof createPostSchema>;

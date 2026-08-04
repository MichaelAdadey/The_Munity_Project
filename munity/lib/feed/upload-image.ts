/**
 * Upload a post photo to Supabase Storage, return the public URL.
 * Call from the client before createPost({ imageUrl }).
 *
 * Storage path: post-images/{userId}/{timestamp}-{filename}
 */

import { createClient } from "../supabase/client";

export const uploadPostImage = async (
  file: File,
): Promise<{ url: string } | { error: string }> => {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be signed in to upload." };
  }

  if (!file.type.startsWith("image/")) {
    return { error: "Please choose an image file." };
  }

  const ext = file.name.split(".").pop() || "jpg";
  const path = `${user.id}/${Date.now()}.${ext}`;

  const { error } = await supabase.storage
    .from("post-images")
    .upload(path, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type,
    });

  if (error) {
    return { error: error.message };
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("post-images").getPublicUrl(path);

  return { url: publicUrl };
};

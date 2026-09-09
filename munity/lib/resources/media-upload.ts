"use client";

import { createClient } from "@/lib/supabase/client";

export async function uploadResourceMedia(
  file: File,
  kind: "image" | "video",
): Promise<{ url: string } | { error: string }> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "You must be signed in to upload." };

  const expectedPrefix = kind === "image" ? "image/" : "video/";
  if (!file.type.startsWith(expectedPrefix)) {
    return { error: `Please choose a ${kind} file.` };
  }

  const ext = file.name.split(".").pop() || (kind === "image" ? "jpg" : "mp4");
  const path = `${kind}s/${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${ext}`;

  const { error } = await supabase.storage
    .from("resource-media")
    .upload(path, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type,
    });

  if (error) return { error: error.message };

  const {
    data: { publicUrl },
  } = supabase.storage.from("resource-media").getPublicUrl(path);

  return { url: publicUrl };
}

import { createClient } from "../supabase/client";

type UploadTarget = "avatar" | "cover";

/**
 * Extracts the storage path from a Supabase public URL, e.g.
 * "https://xyz.supabase.co/storage/v1/object/public/avatars/abc/123.jpg"
 * -> "abc/123.jpg"
 * Returns null if the URL isn't one of our own bucket's public URLs
 * (e.g. it's a demo/local image path like "/images/profile/avatar.jpg").
 */

const extractStoragePath = (
  url: string | null,
  bucket: string,
): string | null => {
  if (!url) return null;
  const marker = `/storage/v1/object/public/${bucket}/`;
  const index = url.indexOf(marker);
  if (index === -1) return null;
  return url.slice(index + marker.length);
};

export const uploadProfileImage = async (
  file: File,
  target: UploadTarget,
): Promise<{ url: string } | { error: string }> => {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be signed in to upload" };
  }

  if (!file.type.startsWith("image/")) {
    return { error: "Please choose an image file." };
  }

  const bucket = target === "avatar" ? "avatars" : "covers";

  // Grab the current URL before we overwrite it, so we know what to clean up after.
  const { data: currentProfile } = await supabase
    .from("profiles")
    .select("avatar_url, cover_url")
    .eq("id", user.id)
    .single();

  const previousUrl: string | null =
    target === "avatar"
      ? ((currentProfile?.avatar_url as string | null) ?? null)
      : ((currentProfile?.cover_url as string | null) ?? null);

  const ext = file.name.split("").pop() || "jpg";
  const path = `${user.id}/${Date.now()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type,
    });

  if (uploadError) {
    return { error: uploadError.message };
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(bucket).getPublicUrl(path);

  const { error: updateError } = await supabase
    .from("profiles")
    .update(
      target === "avatar"
        ? { avatar_url: publicUrl }
        : { cover_url: publicUrl },
    )
    .eq("id", user.id);

  if (updateError) {
    await supabase.storage.from(bucket).remove([path]);
    return { error: updateError.message };
  }

  const previousPath = extractStoragePath(previousUrl, bucket);
  if (previousPath) {
    await supabase.storage.from(bucket).remove([previousPath]);
  }

  return { url: publicUrl };
};

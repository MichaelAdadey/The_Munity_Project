"use client";

import { createClient } from "../supabase/client";

const BUCKET = "credential-documents";

export type CredentialUploadResult = { path: string; displayName: string } | { error: string };

/**
 * Uploads a therapist's license/certification document to private Storage during
 * onboarding. Requires the `credential-documents` bucket — see supabase/manual-setup.sql.
 */
export const uploadCredentialDocument = async (file: File): Promise<CredentialUploadResult> => {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be signed in to upload a document." };
  }

  const path = `${user.id}/${crypto.randomUUID()}-${file.name}`;

  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
    contentType: file.type || undefined,
  });

  if (error) {
    return { error: error.message };
  }

  return { path, displayName: file.name };
};

/** Best-effort cleanup of a previously uploaded document (e.g. when it's replaced). */
export const removeCredentialDocument = async (path: string): Promise<void> => {
  const supabase = createClient();
  await supabase.storage.from(BUCKET).remove([path]);
};

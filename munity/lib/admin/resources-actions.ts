"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

async function assertAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not signed in.");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "admin") {
    throw new Error("Not authorized.");
  }

  return supabase;
}

export type ResourceInput = {
  id?: string; // present when editing, absent when creating
  title: string;
  description: string;
  category: string;
  type: "Article" | "Video" | "Guide" | "Exercise";
  duration: string;
  imageUrl: string | null;
  cta: string;
  isFeatured: boolean;
  featuredBadge: string | null;
  bodyParagraphs: string[];
  videoUrl: string | null;
  captions: { start: number; end: number; text: string }[];
  status: "draft" | "published";
};

function slugify(title: string) {
  return `res-${title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")}`;
}

export async function saveResource(
  input: ResourceInput,
): Promise<{ error?: string; id?: string }> {
  const supabase = await assertAdmin();

  const id = input.id ?? slugify(input.title);

  const row = {
    id,
    title: input.title,
    description: input.description,
    category: input.category,
    type: input.type,
    duration: input.duration,
    image_url: input.imageUrl,
    cta: input.cta,
    is_featured: input.isFeatured,
    featured_badge: input.featuredBadge,
    body_paragraphs: input.bodyParagraphs,
    video_url: input.videoUrl,
    captions: input.captions,
    status: input.status,
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase
    .from("resources")
    .upsert(row, { onConflict: "id" });
  if (error) return { error: error.message };

  revalidatePath("/admin/resources");
  revalidatePath("/resources");
  return { id };
}

export async function deleteResource(id: string): Promise<{ error?: string }> {
  const supabase = await assertAdmin();

  const { error } = await supabase.from("resources").delete().eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/admin/resources");
  revalidatePath("/resources");
  return {};
}

export async function setResourceStatus(
  id: string,
  status: "draft" | "published",
): Promise<{ error?: string }> {
  const supabase = await assertAdmin();

  const { error } = await supabase
    .from("resources")
    .update({ status })
    .eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/admin/resources");
  revalidatePath("/resources");
  return {};
}

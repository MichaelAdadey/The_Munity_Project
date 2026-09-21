import { createClient } from "@/lib/supabase/server";
import type { DbResource } from "@/lib/resources/queries";

export type AdminResource = DbResource & { status: "draft" | "published" };

export async function getAllResourcesForAdmin(): Promise<AdminResource[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("resources")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  return (data ?? []).map((row) => ({
    id: row.id as string,
    title: row.title as string,
    description: row.description as string,
    category: row.category as string,
    type: row.type as DbResource["type"],
    duration: row.duration as string,
    imageUrl: row.image_url as string | null,
    cta: row.cta as string,
    isFeatured: row.is_featured as boolean,
    featuredBadge: row.featured_badge as string | null,
    bodyParagraphs: (row.body_paragraphs as string[] | null) ?? [],
    videoUrl: row.video_url as string | null,
    captions: (row.captions as DbResource["captions"] | null) ?? [],
    viewCount: (row.view_count as number | null) ?? 0,
    status: row.status as "draft" | "published",
  }));
}

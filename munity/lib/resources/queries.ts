import { createClient } from "@/lib/supabase/server";

export type DbResource = {
  id: string;
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
  viewCount: number;
};

function mapRow(row: Record<string, unknown>): DbResource {
  return {
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
  };
}

export async function getPublishedResources(): Promise<DbResource[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("resources")
    .select("*")
    .eq("status", "published")
    .order("created_at", { ascending: true });

  if (error) throw new Error(error.message);
  return (data ?? []).map(mapRow);
}

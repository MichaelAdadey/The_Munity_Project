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
  if (!profile || profile.role !== "admin") throw new Error("Not authorized.");

  return { supabase, adminId: user.id };
}

function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export type CommunityInput = {
  name: string;
  tag: string;
  description: string;
  longDescription: string;
  category: string;
  imageUrl: string | null;
};

export async function createCommunity(
  input: CommunityInput,
): Promise<{ error?: string; slug?: string }> {
  const { supabase, adminId } = await assertAdmin();

  if (!input.name.trim()) return { error: "Name is required." };

  const slug = slugify(input.name);

  const { error } = await supabase.from("communities").insert({
    slug,
    name: input.name.trim(),
    tag: input.tag.trim() || null,
    description: input.description.trim() || null,
    long_description: input.longDescription.trim() || null,
    category: input.category.trim() || null,
    image_url: input.imageUrl,
    verified: false,
    created_by: adminId,
  });

  if (error) {
    if (error.code === "23505")
      return { error: "A community with a similar name already exists." };
    return { error: error.message };
  }

  revalidatePath("/admin/communities");
  revalidatePath("/Communities");
  return { slug };
}

export async function setCommunityVerified(
  id: string,
  verified: boolean,
): Promise<{ error?: string }> {
  const { supabase } = await assertAdmin();

  const { error } = await supabase
    .from("communities")
    .update({ verified })
    .eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/admin/communities");
  revalidatePath("/Communities");
  return {};
}

export async function deleteCommunity(id: string): Promise<{ error?: string }> {
  const { supabase } = await assertAdmin();

  const { error } = await supabase.from("communities").delete().eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/admin/communities");
  revalidatePath("/Communities");
  return {};
}

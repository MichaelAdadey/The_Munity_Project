"use client";

import { createClient } from "@/lib/supabase/client";

export async function trackResourceView(resourceId: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.rpc("increment_resource_view", {
    p_resource_id: resourceId,
  });
  if (error) console.error("Couldn't record resource view:", error.message);
}

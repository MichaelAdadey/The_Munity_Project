"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

async function fetchIds(table: "saved_resources" | "resource_completions"): Promise<string[]> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase.from(table).select("resource_id").eq("user_id", user.id);
  if (error) throw new Error(error.message);
  return (data ?? []).map((row) => row.resource_id as string);
}

export function useSavedResourceIds(flash: (message: string) => void) {
  const [ids, setIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    void (async () => {
      try {
        setIds(await fetchIds("saved_resources"));
      } catch (err) {
        flash(err instanceof Error ? err.message : "Couldn't load saved resources");
      } finally {
        setLoading(false);
      }
    })();
  }, [flash]);

  useEffect(() => {
    const timer = window.setTimeout(load, 0);
    return () => window.clearTimeout(timer);
  }, [load]);

  return { ids, loading, refresh: load };
}

export function useCompletedResourceIds(flash: (message: string) => void) {
  const [ids, setIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    void (async () => {
      try {
        setIds(await fetchIds("resource_completions"));
      } catch (err) {
        flash(err instanceof Error ? err.message : "Couldn't load completed resources");
      } finally {
        setLoading(false);
      }
    })();
  }, [flash]);

  useEffect(() => {
    const timer = window.setTimeout(load, 0);
    return () => window.clearTimeout(timer);
  }, [load]);

  return { ids, loading, refresh: load };
}

export async function toggleSavedResource(resourceId: string, currentlySaved: boolean): Promise<void> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("You must be signed in to save resources");

  if (currentlySaved) {
    const { error } = await supabase
      .from("saved_resources")
      .delete()
      .eq("user_id", user.id)
      .eq("resource_id", resourceId);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase
      .from("saved_resources")
      .insert({ user_id: user.id, resource_id: resourceId });
    if (error) throw new Error(error.message);
  }
}

export async function toggleResourceCompletion(resourceId: string, currentlyComplete: boolean): Promise<void> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("You must be signed in to track progress");

  if (currentlyComplete) {
    const { error } = await supabase
      .from("resource_completions")
      .delete()
      .eq("user_id", user.id)
      .eq("resource_id", resourceId);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase
      .from("resource_completions")
      .insert({ user_id: user.id, resource_id: resourceId });
    if (error) throw new Error(error.message);
  }
}
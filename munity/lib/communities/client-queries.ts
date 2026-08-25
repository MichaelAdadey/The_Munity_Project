"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "../supabase/client";

export type CommunuityOption = {
  id: string;
  name: string;
  slug: string;
};

export const fetchCommunityOptions = async (): Promise<CommunuityOption[]> => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("communities")
    .select("id, name, slug")
    .order("name", { ascending: true });

  if (error) throw new Error(error.message);

  return (data ?? []).map((row) => ({
    id: row.id as string,
    name: row.name as string,
    slug: row.slug as string,
  }));
};

export const useCommunityOptions = (flash: (message: string) => void) => {
  const [options, setOptions] = useState<CommunuityOption[]>([]);

  const load = useCallback(() => {
    void (async () => {
      try {
        const data = await fetchCommunityOptions();
        setOptions(data);
      } catch (error) {
        flash(
          error instanceof Error ? error.message : "Couldn't load communities",
        );
      }
    })();
  }, [flash]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      load();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [load]);

  return options;
};

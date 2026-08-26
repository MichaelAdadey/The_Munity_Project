"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "../supabase/client";

export type TherapistSummary = {
  id: string;
  name: string;
  credentials: string;
  specialties: string[];
};

export const fetchVerifiedTherapists = async (): Promise<
  TherapistSummary[]
> => {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("therapist_details")
    .select(
      `profile_id,
       professional_title,
       title,
       specialties,
       profiles!therapist_details_profile_id_fkey ( first_name, last_name )`,
    )
    .eq("verification_status", "verified");

  if (error) throw new Error(error.message);

  return (data ?? []).map((row) => {
    const profile = row.profiles as unknown as {
      first_name: string;
      last_name: string;
    } | null;
    const name = profile
      ? `${profile.first_name} ${profile.last_name}`.trim()
      : "Therapist";

    return {
      id: row.profile_id as string,
      name: name || "Therapist",
      credentials:
        (row.professional_title as string | null) ||
        (row.title as string | null) ||
        "Therapist",
      specialties: (row.specialties as string[] | null) ?? [],
    };
  });
};

export const useVerifiedTherapists = (flash: (message: string) => void) => {
  const [therapists, setTherapists] = useState<TherapistSummary[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    void (async () => {
      try {
        const data = await fetchVerifiedTherapists();
        setTherapists(data);
      } catch (error) {
        flash(
          error instanceof Error ? error.message : "Couldn't load therapists",
        );
      } finally {
        setLoading(false);
      }
    })();
  }, [flash]);

  useEffect(() => {
    const timer = window.setTimeout(load, 0);
    return () => window.clearTimeout(timer);
  }, [load]);

  return {
    therapists,
    loading,
  };
};

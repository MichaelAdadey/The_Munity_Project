/**
 * Client hook: load the signed-in user's row from public.profiles.
 *
 * Use this in patient UI (e.g. MemberAvatarMenu) instead of useMockStore().profile
 * for name / username. Keep mock store for feed/bookings until those are wired up.
 */

"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/types/auth";
import { toUsername, toFullName } from "@/lib/profile/display-name";

export type CurrentMemberProfile = {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  username: string;
  email: string;
  avatarUrl: string | null;
};

/** Dispatch after writing profiles.avatar_url so every mounted useCurrentProfile() re-fetches. */
export const PROFILE_UPDATED_EVENT = "munity:profile-updated";

type State = {
  profile: CurrentMemberProfile | null;
  loading: boolean;
  error: string | null;
};

const mapProfile = (row: Profile): CurrentMemberProfile => {
  return {
    id: row.id,
    firstName: row.first_name,
    lastName: row.last_name,
    fullName: toFullName(row.first_name, row.last_name),
    username: toUsername(row.first_name, row.last_name),
    email: row.email,
    avatarUrl: row.avatar_url,
  };
};

export const useCurrentProfile = () => {
  const [state, setState] = useState<State>({
    profile: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const supabase = createClient();
    let cancelled = false;

    const load = async () => {
      // 1) Who is signed in?
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (cancelled) return;

      if (userError || !user) {
        setState({
          profile: null,
          loading: false,
          error: userError?.message ?? null,
        });
        return;
      }

      // 2) Their profiles row (RLS: only own row is readable)
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      if (cancelled) return;

      if (error || !data) {
        setState({
          profile: null,
          loading: false,
          error: error?.message ?? "Profile  ot found",
        });
      }

      setState({
        profile: mapProfile(data as Profile),
        loading: false,
        error: null,
      });
    };

    load();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      void load();
    });

    const onProfileUpdated = () => void load();
    window.addEventListener(PROFILE_UPDATED_EVENT, onProfileUpdated);

    return () => {
      cancelled = true;
      subscription.unsubscribe();
      window.removeEventListener(PROFILE_UPDATED_EVENT, onProfileUpdated);
    };
  }, []);

  return state;
};

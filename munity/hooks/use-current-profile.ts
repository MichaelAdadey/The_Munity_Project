/**
 * Client hook: load the signed-in user's row from public.profiles.
 *
 * Use this in patient UI (e.g. MemberAvatarMenu) instead of useMockStore().profile
 * for name / username. Keep mock store for feed/bookings until those are wired up.
 */

"use client";

import { useCallback, useEffect, useState } from "react";
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
  title: string;
  bio: string;
  avatarUrl: string | null;
  coverUrl: string | null;
  dailyReflection: string | null;
};

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
    username: row.username ?? toUsername(row.first_name, row.last_name),
    email: row.email,
    title: row.title ?? "",
    bio: row.bio ?? "",
    avatarUrl: row.avatar_url ?? null,
    coverUrl: row.cover_url ?? null,
    dailyReflection: row.daily_reflection ?? null,
  };
};

export const useCurrentProfile = () => {
  const [state, setState] = useState<State>({
    profile: null,
    loading: true,
    error: null,
  });

  const load = useCallback(async () => {
    const supabase = createClient();
    // 1) Who is signed in?
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

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

    if (error || !data) {
      setState({
        profile: null,
        loading: false,
        error: error?.message ?? "Profile not found",
      });
      return;
    }

    setState({
      profile: mapProfile(data as Profile),
      loading: false,
      error: null,
    });
  }, []);

  useEffect(() => {
    let cancelled = false;
    const supabase = createClient();

    void (async () => {
      if (!cancelled) await load();
    })();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      if (!cancelled) void load();
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, [load]);

  return { ...state, refresh: load };
};

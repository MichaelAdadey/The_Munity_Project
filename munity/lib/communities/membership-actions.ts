"use client";

import { createClient } from "../supabase/client";

export const joinCommunity = async (communityId: string): Promise<void> => {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("You must be signed in to join a community");

  const { error } = await supabase
    .from("community_members")
    .insert({ community_id: communityId, user_id: user.id });
  if (error) throw new Error(error.message);
};

export const leaveCommunity = async (communityId: string): Promise<void> => {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("You must be signed in to leave a community");

  const { error } = await supabase
    .from("community_members")
    .delete()
    .eq("community_id", communityId)
    .eq("user_id", user.id);
  if (error) throw new Error(error.message);
};

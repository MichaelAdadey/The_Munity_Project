import { createClient } from "../supabase/server";

export type TherapyListItem = {
  id: string;
  name: string;
  credentials: string;
  rating: number;
  reviewCount: number;
  specialties: string[];
  bio: string;
  rate: number | null;
  location: string | null;
  verificationStatus: string | null;
  avatarUrl: string | null;
};

export const getTherapistDirectory = async (): Promise<TherapyListItem[]> => {
  const supabase = await createClient();

  const { data, error } = await supabase.from("therapist_details").select(
    `profile_id,
     professional_title,
     title,
     bio,
     rate,
     rating,
     review_count,
     specialties,
     practice_location,
     verification_status,
     profiles!therapist_details_profile_id_fkey ( first_name, last_name, avatar_url )`,
  );

  if (error) throw new Error(error.message);

  return (data ?? []).map((row) => {
    const profile = row.profiles as unknown as {
      first_name: string;
      last_name: string;
      avatar_url: string | null;
    } | null;
    // const profile = profileRow?.[0] ?? null;
    const name = profile
      ? `${profile.first_name} ${profile.last_name}`.trim()
      : "";

    return {
      id: row.profile_id as string,
      name: name || "Therapist",
      credentials:
        (row.professional_title as string | null) ||
        (row.title as string | null) ||
        "Therapist",

      rating: (row.rating as number | null) ?? 0,
      reviewCount: (row.review_count as number | null) ?? 0,
      specialties: (row.specialties as string[] | null) ?? [],
      bio: (row.bio as string | null) ?? "",
      rate: (row.rate as number | null) ?? null,
      location: (row.practice_location as string | null) ?? null,
      verificationStatus: (row.verification_status as string | null) ?? null,
      avatarUrl: profile?.avatar_url ?? null,
    };
  });
};

export const getTherapistById = async (
  id: string,
): Promise<TherapyListItem | null> => {
  const supabase = await createClient();

  const { data: row, error } = await supabase
    .from("therapist_details")
    .select(
      `profile_id,
       professional_title,
       title,
       bio,
       rate,
       rating,
       review_count,
       specialties,
       practice_location,
       verification_status,
       profiles!therapist_details_profile_id_fkey ( first_name, last_name, avatar_url )`,
    )
    .eq("profile_id", id)
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!row) return null;

  const profile = row.profiles as unknown as {
    first_name: string;
    last_name: string;
    avatar_url: string | null;
  } | null;
  const name = profile
    ? `${profile.first_name} ${profile.last_name}`.trim()
    : "";

  return {
    id: row.profile_id as string,
    name: name || "Therapist",
    credentials:
      (row.professional_title as string | null) ||
      (row.title as string | null) ||
      "Therapist",
    rating: (row.rating as number | null) ?? 0,
    reviewCount: (row.review_count as number | null) ?? 0,
    specialties: (row.specialties as string[] | null) ?? [],
    bio: (row.bio as string | null) ?? "",
    rate: (row.rate as number | null) ?? null,
    location: (row.practice_location as string | null) ?? null,
    verificationStatus: (row.verification_status as string | null) ?? null,
    avatarUrl: profile?.avatar_url ?? null,
  };
};

"use server";

import { createClient } from "@/lib/supabase/server";
import type { TherapistProfile } from "@/lib/therapist-profile";

export type UpdateProfileResult = { error?: string; success?: boolean };

export async function updateTherapistProfile(
  profile: TherapistProfile,
): Promise<UpdateProfileResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "You must be signed in." };

  const { error: profileError } = await supabase
    .from("profiles")
    .update({
      first_name: profile.firstName,
      last_name: profile.lastName,
    })
    .eq("id", user.id);

  if (profileError) return { error: profileError.message };

  // licenseExpiry arrives as a display string (e.g. "Dec 2026"); only write it
  // back if it actually parses to a real date, otherwise leave the DB value alone.
  let licenseExpiry: string | null = null;
  if (profile.licenseExpiry) {
    const parsed = new Date(profile.licenseExpiry);
    if (!Number.isNaN(parsed.getTime())) {
      licenseExpiry = parsed.toISOString().slice(0, 10);
    }
  }

  const { error: detailsError } = await supabase
    .from("therapist_details")
    .update({
      title: profile.title,
      gender: profile.gender,
      professional_title: profile.professionalTitle,
      phone: profile.phone,
      practice_location: profile.practiceLocation,
      bio: profile.bio,
      licensing_body: profile.licensingBody,
      license_type: profile.licenseType,
      license_number: profile.licenseNumber,
      ...(licenseExpiry ? { license_expiry: licenseExpiry } : {}),
      specialties: profile.specialties,
      payout_methods: profile.payoutMethods,
      mobile_money_network: profile.mobileMoneyNetwork || null,
      mobile_money_number: profile.mobileMoneyNumber || null,
      bank_name: profile.bankName || null,
      bank_account_last4: profile.bankAccountLast4 || null,
    })
    .eq("profile_id", user.id);

  if (detailsError) return { error: detailsError.message };

  return { success: true };
}

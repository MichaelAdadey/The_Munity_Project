"use server";

import { createClient } from "@/lib/supabase/server";
import type {
  BasicInfoData,
  CredentialsData,
  SpecialtiesData,
  PayoutData,
} from "@/lib/onboarding-data";

export type SubmitOnboardingResult = { error?: string; success?: boolean };

/**
 * Called from the payout step's onBeforeContinue, once the therapist clicks
 * "Submit Application". Takes everything collected across all 4 onboarding
 * steps and writes it into Supabase (profiles + therapist_details).
 */
export async function submitTherapistOnboarding(payload: {
  basicInfo: BasicInfoData;
  credentials: CredentialsData;
  specialties: SpecialtiesData;
  payout: PayoutData;
}): Promise<SubmitOnboardingResult> {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "You must be signed in to submit your application." };
  }

  const { basicInfo, credentials, specialties, payout } = payload;

  // 1. Update the shared profiles row with the therapist's real name.
  // (created automatically at signup by the on_auth_user_created trigger,
  // but first/last name were blank until now)
  const { error: profileError } = await supabase
    .from("profiles")
    .update({
      first_name: basicInfo.firstName,
      last_name: basicInfo.lastName,
    })
    .eq("id", user.id);

  if (profileError) {
    return { error: `Could not save profile: ${profileError.message}` };
  }

  // 2. Upsert therapist_details with everything from all 4 steps.
  // We keep both the full bank account number (needed to actually pay them)
  // and a last-4 version (safe to show in the UI without re-reading the full number).
  const bankAccountNumber = payout.bankAccountNumber || null;
  const bankAccountLast4 = bankAccountNumber ? bankAccountNumber.slice(-4) : null;

  const { error: detailsError } = await supabase.from("therapist_details").upsert(
    {
      profile_id: user.id,
      title: basicInfo.title,
      gender: basicInfo.gender,
      professional_title: basicInfo.professionalTitle,
      phone: basicInfo.phone,
      practice_location: basicInfo.practiceLocation,
      licensing_body: credentials.licensingBody,
      license_type: credentials.licenseType,
      license_number: credentials.registrationNumber,
      region_of_issue: credentials.regionOfIssue,
      years_of_experience: credentials.yearsOfExperience,
      license_document_name: credentials.documentName,
      specialties: specialties.specialties,
      payout_methods: payout.payoutMethods,
      mobile_money_network: payout.mobileMoneyNetwork,
      mobile_money_number: payout.momoNumber,
      mobile_money_account_name: payout.momoAccountName,
      bank_name: payout.bankName,
      bank_account_name: payout.bankAccountName,
      bank_account_number: bankAccountNumber,
      bank_account_last4: bankAccountLast4,
      verification_status: "in-review",
    },
    { onConflict: "profile_id" },
  );

  if (detailsError) {
    return { error: `Could not save therapist details: ${detailsError.message}` };
  }

  return { success: true };
}
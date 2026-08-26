import { requireRole } from "@/lib/require-role";
import { createClient } from "@/lib/supabase/server";
import { routes } from "@/lib/routes";
import { TherapistProfileView } from "@/components/therapistprofile/TherapistProfileView";
import type { TherapistProfile } from "@/lib/therapist-profile";

export default async function TherapistProfilePage() {
  const { user, profile } = await requireRole(["therapist"], routes.therapistLogin);
  const supabase = await createClient();

  const { data: details } = await supabase
    .from("therapist_details")
    .select("*")
    .eq("profile_id", user.id)
    .single();

  const initialProfile: TherapistProfile = {
    title: details?.title ?? "",
    gender: details?.gender ?? "",
    firstName: profile.first_name,
    lastName: profile.last_name,
    professionalTitle: details?.professional_title ?? "",
    phone: details?.phone ?? "",
    practiceLocation: details?.practice_location ?? "",
    email: user.email ?? "",
    bio: details?.bio ?? "",
    licensingBody: details?.licensing_body ?? "",
    licenseType: details?.license_type ?? "",
    licenseNumber: details?.license_number ?? "",
    licenseExpiry: details?.license_expiry
      ? new Date(details.license_expiry).toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        })
      : "",
    verificationStatus:
      (details?.verification_status as TherapistProfile["verificationStatus"]) ?? "pending",
    specialties: details?.specialties ?? [],
    payoutMethods: details?.payout_methods ?? [],
    mobileMoneyNetwork: details?.mobile_money_network ?? "",
    mobileMoneyNumber: details?.mobile_money_number ?? "",
    bankName: details?.bank_name ?? "",
    bankAccountLast4: details?.bank_account_last4 ?? "",
    avatarUrl: profile.avatar_url ?? "",
    memberSince: profile.created_at
      ? new Date(profile.created_at).toLocaleDateString("en-US", {
          month: "long",
          year: "numeric",
        })
      : "",
  };

  return <TherapistProfileView initialProfile={initialProfile} userId={user.id} />;
}

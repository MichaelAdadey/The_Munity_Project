import { requireRole } from "@/lib/require-role";
import { createClient } from "@/lib/supabase/server";
import { routes } from "@/lib/routes";
import { AdminTherapyReviewView } from "@/components/admin/AdminTherapyReviewView";

export default async function AdminTherapyPage() {
  const { profile } = await requireRole(["admin"], routes.adminLogin);

  const supabase = await createClient();
  const { data: pendingTherapists } = await supabase
    .from("therapist_details")
    .select(
      `
      profile_id,
      professional_title,
      licensing_body,
      license_number,
      years_of_experience,
      verification_status,
      specialties,
      profiles ( first_name, last_name, email )
    `,
    )
    .in("verification_status", ["pending", "in-review"])
    .order("profile_id");

  return (
    <AdminTherapyReviewView
      adminName={`${profile.first_name} ${profile.last_name}`}
      // @ts-expect-error - Supabase's typed join comes back as an object here, not an array
      therapists={pendingTherapists ?? []}
    />
  );
}

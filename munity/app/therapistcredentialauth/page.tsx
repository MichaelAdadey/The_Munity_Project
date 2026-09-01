import { requireRole } from "@/lib/require-role";
import { routes } from "@/lib/routes";
import { getCredentialStatus } from "@/lib/therapist/credential-status-queries";
import { CredentialAuthenticationView } from "@/components/therapistcredentialauth/CredentialAuthenticationView";

export default async function TherapistCredentialAuthPage() {
  const { user, profile } = await requireRole(["therapist"], routes.therapistLogin);
  const { status, submittedAt } = await getCredentialStatus(user.id);

  return (
    <CredentialAuthenticationView
      status={status}
      submittedAt={submittedAt}
      applicantName={`${profile.first_name} ${profile.last_name}`.trim() || null}
    />
  );
}

import { TherapistMessagesView } from "@/components/therapistmessages/TherapistMessagesView";
import { requireRole } from "@/lib/require-role";
import { routes } from "@/lib/routes";

export default async function TherapistMessagesPage() {
  await requireRole(["therapist"], routes.therapistLogin);
  return <TherapistMessagesView />;
}

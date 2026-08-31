import { requireRole } from "@/lib/require-role";
import { routes } from "@/lib/routes";
import { getTherapistPatients } from "@/lib/therapist/patients-queries";
import { TherapistAnalyticsListView } from "@/components/therapistanalytics/TherapistAnalyticsListView";

export default async function TherapistAnalyticsPage() {
  const { user } = await requireRole(["therapist"], routes.therapistLogin);
  const patients = await getTherapistPatients(user.id);

  return <TherapistAnalyticsListView patients={patients} />;
}

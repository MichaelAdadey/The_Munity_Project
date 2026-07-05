import { redirect } from "next/navigation";
import { defaultPatientSlug, patientRoutes } from "@/lib/routes";

export default function DashboardPage() {
  redirect(patientRoutes(defaultPatientSlug).overview);
}

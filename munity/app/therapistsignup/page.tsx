import { redirect } from "next/navigation";
import { routes } from "@/lib/routes";

/** Therapist join now starts at onboarding (account + basic info). */
export default function TherapistSignupPage() {
  redirect(routes.therapistOnboarding.basicInfo);
}

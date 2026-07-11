import {
  LandingPage,
  type LandingPageProps,
} from "@/components/therapistlanding/LandingPage";
import { getMockSession } from "@/lib/mock-session";

export default async function HomePage() {
  const session = await getMockSession();

  const landingSession: LandingPageProps["session"] = session
    ? {
        name: session.name,
        role: session.role,
        redirectTo: session.redirectTo,
      }
    : null;

  return <LandingPage session={landingSession} />;
}

import { ResourcesView } from "@/components/resources/ResourcesView";
import { getMemberLoggedIn } from "@/lib/member-auth";

export default async function ResourcesPage() {
  const isLoggedIn = await getMemberLoggedIn();
  return <ResourcesView isLoggedIn={isLoggedIn} />;
}

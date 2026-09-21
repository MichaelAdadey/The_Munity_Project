import { ResourcesView } from "@/components/resources/ResourcesView";
import { getMemberLoggedIn } from "@/lib/member-auth";
import { getPublishedResources } from "@/lib/resources/queries";

export default async function ResourcesPage() {
  const isLoggedIn = await getMemberLoggedIn();
  const resources = await getPublishedResources();
  return <ResourcesView isLoggedIn={isLoggedIn} resources={resources} />;
}

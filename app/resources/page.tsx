import { ResourcesView } from "@/components/resources/ResourcesView";
import { getMockSession } from "@/lib/mock-session";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { createClient } from "@/lib/supabase/server";

export default async function ResourcesPage() {
  let isLoggedIn = false;

  const mockSession = await getMockSession();
  if (mockSession?.role === "user") {
    isLoggedIn = true;
  } else if (isSupabaseConfigured()) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    isLoggedIn = Boolean(user);
  }

  return <ResourcesView isLoggedIn={isLoggedIn} />;
}

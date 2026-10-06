import { createClient } from "@/lib/supabase/server";
import { HomeFeedView } from "@/components/home/HomeFeedView";
import { TherapistFeedView } from "@/components/therapistfeed/TherapistFeedView";

/**
 * Shared community feed.
 * - Therapists get TherapistFeedView (therapist app shell) so they can post,
 *   support, comment, and save alongside members.
 * - Members and guests get HomeFeedView (member app shell), unchanged.
 */
export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let isTherapist = false;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();
    isTherapist = profile?.role === "therapist";
  }

  return isTherapist ? <TherapistFeedView /> : <HomeFeedView />;
}

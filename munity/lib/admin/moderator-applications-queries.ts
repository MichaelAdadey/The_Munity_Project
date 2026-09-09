import { createClient } from "@/lib/supabase/server";

export type AdminModeratorApplication = {
  id: string;
  applicantId: string;
  applicantName: string;
  applicantEmail: string;
  focus: string;
  why: string | null;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
};

export async function getModeratorApplications(): Promise<
  AdminModeratorApplication[]
> {
  const supabase = await createClient();

  const { data: applications, error } = await supabase
    .from("moderator_applications")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  if (!applications || applications.length === 0) return [];

  const applicantIds = Array.from(
    new Set(applications.map((a) => a.applicant_id as string)),
  );
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, first_name, last_name, email")
    .in("id", applicantIds);

  const profileById = new Map((profiles ?? []).map((p) => [p.id, p]));

  return applications.map((a) => {
    const profile = profileById.get(a.applicant_id as string);
    return {
      id: a.id as string,
      applicantId: a.applicant_id as string,
      applicantName: profile
        ? `${profile.first_name} ${profile.last_name}`.trim()
        : "Unknown",
      applicantEmail: profile?.email ?? "",
      focus: a.focus as string,
      why: a.why as string | null,
      status: a.status as "pending" | "approved" | "rejected",
      createdAt: a.created_at as string,
    };
  });
}

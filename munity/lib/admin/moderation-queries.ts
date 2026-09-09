import { createClient } from "@/lib/supabase/server";

export type AdminReportRow = {
  id: string;
  reporterName: string;
  reporterInitials: string;
  targetType: "post" | "comment";
  targetAuthorName: string;
  targetSnippet: string;
  caseContent: string;
  contentDeleted: boolean;
  reason: string;
  reasonDetails: string | null;
  status: "pending" | "in_review" | "resolved";
  severity: "CRITICAL" | "MEDIUM" | "LOW";
  urgent: boolean;
  resolution: string | null;
  resolvedAt: string | null;
  postedIn: string;
  createdAt: string;
};

function severityForReason(reason: string): "CRITICAL" | "MEDIUM" | "LOW" {
  if (reason === "Self-Harm") return "CRITICAL";
  if (reason === "Harassment" || reason === "Hate Speech") return "MEDIUM";
  return "LOW"; // Spam, Misinformation, Other
}

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export async function getReportsForAdmin(): Promise<AdminReportRow[]> {
  const supabase = await createClient();

  const { data: reports, error } = await supabase
    .from("reports")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  if (!reports || reports.length === 0) return [];

  const postIds = reports
    .filter((r) => r.target_type === "post")
    .map((r) => r.target_id as string);
  const commentIds = reports
    .filter((r) => r.target_type === "comment")
    .map((r) => r.target_id as string);

  const [{ data: posts }, { data: comments }] = await Promise.all([
    postIds.length > 0
      ? supabase
          .from("posts")
          .select("id, content, author_id, community_id")
          .in("id", postIds)
      : Promise.resolve({
          data: [] as {
            id: string;
            content: string;
            author_id: string;
            community_id: string | null;
          }[],
        }),
    commentIds.length > 0
      ? supabase
          .from("post_comments")
          .select("id, content, author_id, post_id")
          .in("id", commentIds)
      : Promise.resolve({
          data: [] as {
            id: string;
            content: string;
            author_id: string;
            post_id: string;
          }[],
        }),
  ]);

  const postById = new Map((posts ?? []).map((p) => [p.id, p]));
  const commentById = new Map((comments ?? []).map((c) => [c.id, c]));

  // Comments need their parent post's community too, for "posted in"
  const parentPostIds = (comments ?? []).map((c) => c.post_id);
  const { data: parentPosts } =
    parentPostIds.length > 0
      ? await supabase
          .from("posts")
          .select("id, community_id")
          .in("id", parentPostIds)
      : { data: [] as { id: string; community_id: string | null }[] };
  const parentPostById = new Map((parentPosts ?? []).map((p) => [p.id, p]));

  const communityIds = new Set<string>();
  postById.forEach((p) => p.community_id && communityIds.add(p.community_id));
  parentPostById.forEach(
    (p) => p.community_id && communityIds.add(p.community_id),
  );

  const authorIds = new Set<string>();
  postById.forEach((p) => authorIds.add(p.author_id));
  commentById.forEach((c) => authorIds.add(c.author_id));
  reports.forEach((r) => authorIds.add(r.reporter_id));

  const [{ data: communities }, { data: profiles }] = await Promise.all([
    communityIds.size > 0
      ? supabase
          .from("communities")
          .select("id, name")
          .in("id", Array.from(communityIds))
      : Promise.resolve({ data: [] as { id: string; name: string }[] }),
    supabase
      .from("profiles")
      .select("id, first_name, last_name")
      .in("id", Array.from(authorIds)),
  ]);

  const communityNameById = new Map(
    (communities ?? []).map((c) => [c.id, c.name]),
  );
  const nameById = new Map(
    (profiles ?? []).map((p) => [
      p.id,
      `${p.first_name} ${p.last_name}`.trim(),
    ]),
  );

  return reports.map((r) => {
    const severity = severityForReason(r.reason as string);
    let targetAuthorName = "Unknown";
    let targetSnippet = "[content removed]";
    let caseContent = "[content removed]";
    let postedIn = "Munity";
    let contentDeleted = true;

    if (r.target_type === "post") {
      const post = postById.get(r.target_id as string);
      if (post) {
        contentDeleted = false;
        targetAuthorName = nameById.get(post.author_id) ?? "Unknown";
        caseContent = post.content;
        targetSnippet = `Post: "${post.content.slice(0, 60)}${post.content.length > 60 ? "..." : ""}"`;
        postedIn = post.community_id
          ? (communityNameById.get(post.community_id) ?? "a community")
          : "Home feed";
      }
    } else {
      const comment = commentById.get(r.target_id as string);
      if (comment) {
        contentDeleted = false;
        targetAuthorName = nameById.get(comment.author_id) ?? "Unknown";
        caseContent = comment.content;
        targetSnippet = `Comment: "${comment.content.slice(0, 60)}${comment.content.length > 60 ? "..." : ""}"`;
        const parentPost = parentPostById.get(comment.post_id);
        postedIn = parentPost?.community_id
          ? (communityNameById.get(parentPost.community_id) ?? "a community")
          : "Home feed";
      }
    }

    return {
      id: r.id as string,
      reporterName: nameById.get(r.reporter_id as string) ?? "Unknown",
      reporterInitials: initials(nameById.get(r.reporter_id as string) ?? "?"),
      targetType: r.target_type as "post" | "comment",
      targetAuthorName,
      targetSnippet,
      caseContent,
      contentDeleted,
      reason: r.reason as string,
      reasonDetails: r.reason_details as string | null,
      status: r.status as AdminReportRow["status"],
      severity,
      urgent: severity === "CRITICAL" && r.status !== "resolved",
      resolution: r.resolution as string | null,
      resolvedAt: r.resolved_at as string | null,
      postedIn,
      createdAt: r.created_at as string,
    };
  });
}

"use client";

import { useSyncExternalStore } from "react";
import {
  seedBookings,
  seedChats,
  seedCommunities,
  seedFeedPosts,
  seedMemberProfile,
  seedMemberships,
  seedMessages,
  seedReports,
  seedSavedPostIds,
  seedSavedResourceIds,
  seedSessionNotes,
  seedSettings,
  seedSupportedPostIds,
  seedTherapists,
  type Booking,
  type BookingPriority,
  type ChatMessage,
  type ChatThread,
  type CommunityRecord,
  type FeedPost,
  type MemberProfile,
  type MemberSettingsState,
  type ModerationReport,
  type SessionNoteRecord,
  type TherapistRecord,
} from "@/lib/mock-db";

const STORAGE_KEY = "munity-mock-store-v3";

function normalizeBooking(booking: Booking): Booking {
  return {
    ...booking,
    scheduledAt:
      booking.scheduledAt ||
      booking.createdAt ||
      new Date().toISOString(),
    priority: booking.priority ?? "normal",
    archived: Boolean(booking.archived),
  };
}

function mergeBookings(stored?: Booking[]): Booking[] {
  if (!stored?.length) return structuredClone(seedBookings).map(normalizeBooking);
  return stored.map(normalizeBooking);
}

function mergeReports(stored?: ModerationReport[]): ModerationReport[] {
  const byId = new Map((stored ?? []).map((report) => [report.id, report]));
  const merged = seedReports.map((seed) => {
    const existing = byId.get(seed.id);
    if (!existing) return structuredClone(seed);
    return {
      ...seed,
      ...existing,
      caseContent: existing.caseContent ?? seed.caseContent,
      postedIn: existing.postedIn ?? seed.postedIn,
      postedAgo: existing.postedAgo ?? seed.postedAgo,
      sentiment: existing.sentiment ?? seed.sentiment,
      prevFlags: existing.prevFlags ?? seed.prevFlags,
      reporterTrust: existing.reporterTrust ?? seed.reporterTrust,
      createdAt: existing.createdAt ?? seed.createdAt,
    };
  });

  for (const report of stored ?? []) {
    if (seedReports.some((seed) => seed.id === report.id)) continue;
    merged.push({
      ...report,
      caseContent: report.caseContent ?? report.targetSnippet,
      postedIn: report.postedIn ?? "Community feed",
      postedAgo: report.postedAgo ?? "Recently",
      sentiment: report.sentiment ?? "Under review",
      prevFlags: report.prevFlags ?? 0,
      reporterTrust: report.reporterTrust ?? 90,
      createdAt: report.createdAt ?? new Date().toISOString(),
    });
  }

  return merged;
}

export type FeedComment = {
  id: string;
  postId: string;
  author: string;
  content: string;
  time: string;
};

export type MockStoreState = {
  profile: MemberProfile;
  posts: FeedPost[];
  communities: CommunityRecord[];
  memberships: string[];
  therapists: TherapistRecord[];
  bookings: Booking[];
  chats: ChatThread[];
  messages: Record<string, ChatMessage[]>;
  reports: ModerationReport[];
  sessionNotes: SessionNoteRecord[];
  savedPostIds: string[];
  savedResourceIds: string[];
  supportedPostIds: string[];
  commentsByPost: Record<string, FeedComment[]>;
  moodToday: string | null;
  dailyReflection: string | null;
  settings: MemberSettingsState;
};

function createSeedState(): MockStoreState {
  return {
    profile: { ...seedMemberProfile },
    posts: structuredClone(seedFeedPosts),
    communities: structuredClone(seedCommunities),
    memberships: [...seedMemberships],
    therapists: structuredClone(seedTherapists),
    bookings: structuredClone(seedBookings),
    chats: structuredClone(seedChats),
    messages: structuredClone(seedMessages),
    reports: structuredClone(seedReports),
    sessionNotes: structuredClone(seedSessionNotes),
    savedPostIds: [...seedSavedPostIds],
    savedResourceIds: [...seedSavedResourceIds],
    supportedPostIds: [...seedSupportedPostIds],
    commentsByPost: {
      p1: [
        {
          id: "c-p1-1",
          postId: "p1",
          author: "Jordan Lee",
          content: "5-4-3-2-1 saved me in a grocery store last week. Proud of you.",
          time: "1h ago",
        },
        {
          id: "c-p1-2",
          postId: "p1",
          author: "Priya Nair",
          content: "Progress on hard days counts twice. Sending calm your way.",
          time: "45m ago",
        },
      ],
      p2: [
        {
          id: "c-p2-1",
          postId: "p2",
          author: "Alex Rivera",
          content: "Trying this tomorrow morning — phone stays in the kitchen.",
          time: "3h ago",
        },
      ],
    },
    moodToday: null,
    dailyReflection: null,
    settings: { ...seedSettings },
  };
}

let state: MockStoreState = createSeedState();
let hydrated = false;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

function persist() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore quota errors in preview
  }
}

function hydrate() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw) as Partial<MockStoreState>;
    state = {
      ...createSeedState(),
      ...parsed,
      communities: seedCommunities,
      therapists: seedTherapists,
      reports: mergeReports(parsed.reports),
      bookings: mergeBookings(parsed.bookings),
      profile: { ...seedMemberProfile, ...(parsed.profile ?? {}), cover: parsed.profile?.cover ?? seedMemberProfile.cover, avatar: parsed.profile?.avatar ?? seedMemberProfile.avatar },
      settings: { ...seedSettings, ...(parsed.settings ?? {}) },
      commentsByPost: parsed.commentsByPost ?? createSeedState().commentsByPost,
    };
  } catch {
    state = createSeedState();
  }
}

function setState(updater: (prev: MockStoreState) => MockStoreState) {
  hydrate();
  state = updater(state);
  persist();
  emit();
}

function getSnapshot(): MockStoreState {
  hydrate();
  return state;
}

/** Must be a stable reference — React will loop if getServerSnapshot returns a new object each call. */
const serverSnapshot: MockStoreState = createSeedState();

function getServerSnapshot(): MockStoreState {
  return serverSnapshot;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useMockStore(): MockStoreState {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export const mockStore = {
  getState: getSnapshot,
  reset() {
    state = createSeedState();
    persist();
    emit();
  },
  setMood(mood: string | null) {
    setState((prev) => ({ ...prev, moodToday: mood }));
  },
  saveDailyReflection(content: string) {
    const trimmed = content.trim();
    setState((prev) => ({
      ...prev,
      dailyReflection: trimmed || null,
    }));
  },
  createPost(input: {
    content: string;
    anonymous?: boolean;
    feeling?: string;
    communityId?: string | null;
    image?: string | null;
  }) {
    const community = input.communityId
      ? state.communities.find((c) => c.id === input.communityId)
      : null;
    const post: FeedPost = {
      id: `p-${Date.now()}`,
      anonymous: Boolean(input.anonymous),
      author: input.anonymous ? "Anonymous Member" : state.profile.fullName,
      authorId: "me",
      avatar: input.anonymous ? undefined : state.profile.avatar,
      time: "Just now",
      feeling: input.feeling ?? "Feeling Open",
      content: input.content.trim() || (input.image ? "Shared a moment." : ""),
      supports: 0,
      comments: 0,
      image: input.image ?? null,
      communityId: community?.id ?? null,
      communityName: community?.name ?? null,
      accent: Boolean(input.anonymous),
      createdAt: new Date().toISOString(),
    };
    setState((prev) => ({ ...prev, posts: [post, ...prev.posts] }));
    return post;
  },
  toggleSupport(postId: string) {
    setState((prev) => {
      const supported = prev.supportedPostIds.includes(postId);
      return {
        ...prev,
        supportedPostIds: supported
          ? prev.supportedPostIds.filter((id) => id !== postId)
          : [...prev.supportedPostIds, postId],
        posts: prev.posts.map((post) =>
          post.id === postId
            ? {
                ...post,
                supports: Math.max(0, post.supports + (supported ? -1 : 1)),
              }
            : post,
        ),
      };
    });
  },
  addComment(postId: string, content: string) {
    const trimmed = content.trim();
    if (!trimmed) return;
    const comment: FeedComment = {
      id: `c-${Date.now()}`,
      postId,
      author: state.profile.fullName,
      content: trimmed,
      time: "Just now",
    };
    setState((prev) => ({
      ...prev,
      commentsByPost: {
        ...prev.commentsByPost,
        [postId]: [...(prev.commentsByPost[postId] ?? []), comment],
      },
      posts: prev.posts.map((post) =>
        post.id === postId
          ? { ...post, comments: post.comments + 1 }
          : post,
      ),
    }));
  },
  toggleSavedPost(postId: string) {
    setState((prev) => ({
      ...prev,
      savedPostIds: prev.savedPostIds.includes(postId)
        ? prev.savedPostIds.filter((id) => id !== postId)
        : [...prev.savedPostIds, postId],
    }));
  },
  toggleSavedResource(resourceId: string) {
    setState((prev) => ({
      ...prev,
      savedResourceIds: prev.savedResourceIds.includes(resourceId)
        ? prev.savedResourceIds.filter((id) => id !== resourceId)
        : [...prev.savedResourceIds, resourceId],
    }));
  },
  toggleMembership(communityId: string) {
    setState((prev) => {
      const joined = prev.memberships.includes(communityId);
      const communities = prev.communities.map((community) => {
        if (community.id !== communityId) return community;
        const memberCount = community.memberCount + (joined ? -1 : 1);
        return {
          ...community,
          memberCount,
          membersLabel: formatMemberCount(memberCount),
        };
      });
      return {
        ...prev,
        communities,
        memberships: joined
          ? prev.memberships.filter((id) => id !== communityId)
          : [...prev.memberships, communityId],
        profile: {
          ...prev.profile,
          groupCount: Math.max(
            0,
            prev.profile.groupCount + (joined ? -1 : 1),
          ),
        },
      };
    });
  },
  createCommunity(input: {
    name: string;
    description: string;
    filter: CommunityRecord["filter"];
    tag?: string;
  }) {
    const name = input.name.trim();
    if (!name) return null;
    const slugBase = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    const slug = `${slugBase || "community"}-${Date.now().toString().slice(-4)}`;
    const community: CommunityRecord = {
      id: `c-${Date.now()}`,
      slug,
      name,
      tag: input.tag?.trim() || input.filter,
      description:
        input.description.trim() ||
        "A new peer space for shared support and gentle check-ins.",
      longDescription:
        input.description.trim() ||
        "Created in the Munity preview. Members can join, share posts, and grow this space together.",
      membersLabel: "1 member",
      memberCount: 1,
      image: "/images/communities/mindful-paths.png",
      filter: input.filter,
      verified: false,
    };
    setState((prev) => ({
      ...prev,
      communities: [community, ...prev.communities],
      memberships: [...prev.memberships, community.id],
      profile: {
        ...prev.profile,
        groupCount: prev.profile.groupCount + 1,
      },
    }));
    return community;
  },
  bookSession(
    therapistId: string,
    when?: string,
    options?: { scheduledAt?: string; priority?: BookingPriority },
  ) {
    const therapist = state.therapists.find((t) => t.id === therapistId);
    if (!therapist) return null;
    const booking: Booking = {
      id: `b-${Date.now()}`,
      therapistId,
      therapistName: therapist.name,
      when: when ?? therapist.nextAvailable,
      scheduledAt: options?.scheduledAt ?? new Date().toISOString(),
      status: "confirmed",
      priority: options?.priority ?? "normal",
      archived: false,
      createdAt: new Date().toISOString(),
    };
    setState((prev) => ({ ...prev, bookings: [booking, ...prev.bookings] }));
    return booking;
  },
  setBookingPriority(bookingId: string, priority: BookingPriority) {
    setState((prev) => ({
      ...prev,
      bookings: prev.bookings.map((booking) =>
        booking.id === bookingId ? { ...booking, priority } : booking,
      ),
    }));
  },
  archiveBooking(bookingId: string) {
    setState((prev) => ({
      ...prev,
      bookings: prev.bookings.map((booking) =>
        booking.id === bookingId
          ? { ...booking, archived: true, status: booking.status === "confirmed" || booking.status === "pending" ? "completed" : booking.status }
          : booking,
      ),
    }));
  },
  unarchiveBooking(bookingId: string) {
    setState((prev) => ({
      ...prev,
      bookings: prev.bookings.map((booking) =>
        booking.id === bookingId ? { ...booking, archived: false } : booking,
      ),
    }));
  },
  deleteBooking(bookingId: string) {
    setState((prev) => ({
      ...prev,
      bookings: prev.bookings.filter((booking) => booking.id !== bookingId),
    }));
  },
  ensureTherapistChat(therapistId: string) {
    const legacyChatIds: Record<string, string> = {
      "sarah-jenkins": "sarah",
      "elena-aris": "elena",
    };
    const legacyId = legacyChatIds[therapistId];
    const existing = state.chats.find(
      (chat) =>
        chat.therapistId === therapistId ||
        chat.id === therapistId ||
        (legacyId != null && chat.id === legacyId),
    );
    if (existing) {
      if (!existing.therapistId) {
        setState((prev) => ({
          ...prev,
          chats: prev.chats.map((chat) =>
            chat.id === existing.id ? { ...chat, therapistId } : chat,
          ),
        }));
      }
      return existing.id;
    }

    const therapist = state.therapists.find((item) => item.id === therapistId);
    if (!therapist) return null;

    const chatId = `therapist-${therapistId}`;
    const displayName = therapist.name.startsWith("Dr.")
      ? therapist.name
      : therapist.credentials.toLowerCase().includes("md") ||
          therapist.credentials.toLowerCase().includes("phd")
        ? `Dr. ${therapist.name}`
        : therapist.name;

    const chat: ChatThread = {
      id: chatId,
      name: displayName,
      preview: "Say hello to start the conversation.",
      time: "now",
      avatar: therapist.image,
      filter: "Therapists",
      therapistId,
      online: true,
    };

    const intro: ChatMessage[] = [
      { id: `d-${chatId}`, kind: "date", label: "Today" },
      {
        id: `m-${chatId}-intro`,
        kind: "text",
        from: "them",
        content: `Hi, I'm ${displayName}. Feel free to share what's on your mind — we can go at your pace.`,
        time: new Date().toLocaleTimeString([], {
          hour: "numeric",
          minute: "2-digit",
        }),
      },
    ];

    setState((prev) => ({
      ...prev,
      chats: [chat, ...prev.chats.filter((item) => item.id !== chatId)],
      messages: {
        ...prev.messages,
        [chatId]: prev.messages[chatId] ?? intro,
      },
    }));
    return chatId;
  },
  sendMessage(chatId: string, content: string) {
    const trimmed = content.trim();
    if (!trimmed) return;
    const message: ChatMessage = {
      id: `m-${Date.now()}`,
      kind: "text",
      from: "me",
      content: trimmed,
      time: new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }),
    };
    setState((prev) => {
      const thread = prev.messages[chatId] ?? [];
      return {
        ...prev,
        messages: { ...prev.messages, [chatId]: [...thread, message] },
        chats: prev.chats.map((chat) =>
          chat.id === chatId
            ? { ...chat, preview: trimmed, time: "now", unread: false }
            : chat,
        ),
      };
    });
  },
  markChatRead(chatId: string) {
    setState((prev) => ({
      ...prev,
      chats: prev.chats.map((chat) =>
        chat.id === chatId ? { ...chat, unread: false } : chat,
      ),
    }));
  },
  resolveReport(
    reportId: string,
    resolution: string,
    nextStatus: ModerationReport["status"] = "Resolved",
  ) {
    setState((prev) => ({
      ...prev,
      reports: prev.reports.map((report) =>
        report.id === reportId
          ? {
              ...report,
              status: nextStatus,
              resolution,
              resolvedAt: new Date().toISOString(),
              urgent: false,
            }
          : report,
      ),
    }));
  },
  updateReportStatus(reportId: string, status: ModerationReport["status"]) {
    setState((prev) => ({
      ...prev,
      reports: prev.reports.map((report) =>
        report.id === reportId
          ? { ...report, status, urgent: status === "Pending Urgent" }
          : report,
      ),
    }));
  },
  initiateWellnessCheck(reportId: string) {
    setState((prev) => ({
      ...prev,
      reports: prev.reports.map((report) =>
        report.id === reportId
          ? {
              ...report,
              status: "In Review" as const,
              urgent: report.severity === "CRITICAL",
              resolution: "Wellness check initiated",
            }
          : report,
      ),
    }));
  },
  addSessionNote(note: Omit<SessionNoteRecord, "id" | "createdAt">) {
    const record: SessionNoteRecord = {
      ...note,
      id: `n-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setState((prev) => ({
      ...prev,
      sessionNotes: [record, ...prev.sessionNotes],
    }));
    return record;
  },
  updateSettings(patch: Partial<MemberSettingsState>) {
    setState((prev) => ({
      ...prev,
      settings: { ...prev.settings, ...patch },
      profile:
        patch.displayName !== undefined
          ? { ...prev.profile, fullName: patch.displayName }
          : prev.profile,
    }));
  },
  updateProfile(patch: Partial<MemberProfile>) {
    setState((prev) => ({
      ...prev,
      profile: { ...prev.profile, ...patch },
    }));
  },
};

function formatMemberCount(count: number) {
  if (count >= 1000) {
    const value = count / 1000;
    return `${value % 1 === 0 ? value.toFixed(0) : value.toFixed(1)}k members`;
  }
  return `${count} members`;
}

export function getCommunityBySlug(slug: string) {
  return getSnapshot().communities.find((c) => c.slug === slug) ?? null;
}

export function getTherapistById(id: string) {
  return getSnapshot().therapists.find((t) => t.id === id) ?? null;
}

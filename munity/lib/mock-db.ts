/**
 * Preview seed data for the interactive mock backend.
 * Backend engineers: replace getters/mutations in `lib/mock-store.ts`
 * with API calls — shapes here mirror intended domain models.
 */

export type FeedPost = {
  id: string;
  anonymous: boolean;
  author: string;
  authorId: string;
  avatar?: string;
  time: string;
  feeling: string;
  content: string;
  supports: number;
  comments: number;
  image: string | null;
  communityId: string | null;
  communityName: string | null;
  accent?: boolean;
  createdAt: string;
};

export type CommunityRecord = {
  id: string;
  slug: string;
  name: string;
  tag: string;
  description: string;
  longDescription: string;
  membersLabel: string;
  memberCount: number;
  image: string;
  filter:
    | "Anxiety"
    | "Depression"
    | "Student Support"
    | "Grief"
    | "Neurodiversity"
    | "Workplace Stress"
    | "Mindfulness";
  verified: boolean;
};

export type TherapistRecord = {
  id: string;
  name: string;
  credentials: string;
  rating: number;
  reviewCount: number;
  tags: string[];
  quote: string;
  bio: string;
  nextAvailable: string;
  rate: number;
  image: string;
  specializations: Array<
    "Anxiety & Stress" | "Depression" | "CBT Therapy" | "Family Issues"
  >;
  language: string;
  languages: string[];
  availability: Array<"Today" | "This Week" | "Weekend">;
  sessionTypes: string[];
  location: string;
};

export type ChatThread = {
  id: string;
  name: string;
  preview: string;
  time: string;
  avatar: string;
  filter: "Therapists" | "Groups";
  therapistId?: string;
  online?: boolean;
  unread?: boolean;
};

export type ChatMessage =
  | { id: string; kind: "date"; label: string }
  | {
      id: string;
      kind: "text";
      from: "them" | "me";
      content: string;
      time: string;
    }
  | {
      id: string;
      kind: "image";
      from: "me";
      image: string;
      caption: string;
      time: string;
    };

export type Booking = {
  id: string;
  therapistId: string;
  therapistName: string;
  when: string;
  status: "confirmed" | "pending" | "completed" | "cancelled";
  createdAt: string;
};

export type ModerationReport = {
  id: string;
  reporter: string;
  reporterInitials: string;
  target: string;
  targetSnippet: string;
  reason: string;
  reasonTone: "danger" | "lime" | "neutral";
  status: "Pending Urgent" | "Pending" | "In Review" | "Resolved";
  severity: "CRITICAL" | "MEDIUM" | "LOW";
  urgent?: boolean;
  resolution?: string;
  resolvedAt?: string;
};

export type SessionNoteRecord = {
  id: string;
  patientSlug: string;
  patientName: string;
  title: string;
  body: string;
  sessionDate: string;
  createdAt: string;
};

export type MemberProfile = {
  fullName: string;
  username: string;
  title: string;
  bio: string;
  avatar: string;
  email: string;
  dayStreak: number;
  groupCount: number;
};

export const seedMemberProfile: MemberProfile = {
  fullName: "Alex Rivera",
  username: "arivera_mindful",
  title: "Daily Mindful Warrior",
  bio: "Navigating the journey to nurtured stability. Passionate about peer support, cognitive wellness, and early morning meditation.",
  avatar: "/images/profile/avatar.jpg",
  email: "alex.rivera@munity.app",
  dayStreak: 12,
  groupCount: 4,
};

export const seedCommunities: CommunityRecord[] = [
  {
    id: "c1",
    slug: "mindful-paths",
    name: "Mindful Paths",
    tag: "General",
    description: "A safe space for those exploring mindfulness and anxiety…",
    longDescription:
      "Share daily intentions, grounding techniques, and gentle check-ins. Moderators keep the space calm and judgment-free.",
    membersLabel: "12.4k members",
    memberCount: 12400,
    image: "/images/communities/mindful-paths.png",
    filter: "Anxiety",
    verified: true,
  },
  {
    id: "c2",
    slug: "campus-calm",
    name: "Campus Calm",
    tag: "Student",
    description: "Supporting students through exam stress, social anxiety, and…",
    longDescription:
      "Exam weeks, roommate conflict, and first-year nerves — peer support from people who get campus life.",
    membersLabel: "8.2k members",
    memberCount: 8200,
    image: "/images/communities/campus-calm.png",
    filter: "Student Support",
    verified: true,
  },
  {
    id: "c3",
    slug: "career-care",
    name: "Career Care",
    tag: "Work",
    description: "Navigating the complexities of mental health in the professional…",
    longDescription:
      "Burnout, imposter syndrome, and boundary-setting at work. Practical peer advice and weekly prompts.",
    membersLabel: "15.1k members",
    memberCount: 15100,
    image: "/images/communities/career-care.png",
    filter: "Workplace Stress",
    verified: false,
  },
  {
    id: "c4",
    slug: "sun-rises",
    name: "The Sun Also Rises",
    tag: "Depression",
    description: "A lighthouse for those in dark seasons. Finding small victories…",
    longDescription:
      "Small wins, soft mornings, and hope without toxic positivity. Crisis resources are pinned at the top.",
    membersLabel: "24.5k members",
    memberCount: 24500,
    image: "/images/communities/sun-rises.png",
    filter: "Depression",
    verified: true,
  },
  {
    id: "c5",
    slug: "neuro-nook",
    name: "Neuro-Nook",
    tag: "Neurodiverse",
    description: "Community for ADHD, autism, and sensory-friendly peer support…",
    longDescription:
      "Celebrate unique brains. Tips for executive function, sensory overload, and self-advocacy.",
    membersLabel: "9.8k members",
    memberCount: 9800,
    image: "/images/communities/neuro-nook.png",
    filter: "Neurodiversity",
    verified: true,
  },
  {
    id: "c6",
    slug: "grief-garden",
    name: "Grief Garden",
    tag: "Grief",
    description: "A quiet place to remember, mourn, and grow after loss…",
    longDescription:
      "Loss of people, pets, relationships, or identity. No timelines — just presence and shared rituals.",
    membersLabel: "6.3k members",
    memberCount: 6300,
    image: "/images/communities/sun-rises.png",
    filter: "Grief",
    verified: true,
  },
  {
    id: "c7",
    slug: "sleep-hygiene",
    name: "Sleep Hygiene",
    tag: "Rest",
    description: "Wind-down routines, insomnia tips, and night-owl solidarity…",
    longDescription:
      "Share what actually helps you sleep — without shame about screens, meds, or racing thoughts.",
    membersLabel: "2.4k members",
    memberCount: 2400,
    image: "/images/communities/mindful-paths.png",
    filter: "Mindfulness",
    verified: false,
  },
];

export const seedMemberships = ["c1", "c4", "c5", "c7"];

export const seedFeedPosts: FeedPost[] = [
  {
    id: "p1",
    anonymous: true,
    author: "Anonymous Warrior",
    authorId: "u-anon-1",
    time: "2h ago",
    feeling: "Feeling Anxious",
    content:
      "Today was tough. I felt like I couldn't breathe during my meeting, but I remembered the grounding technique I learned here last week. 5-4-3-2-1. It actually worked. Just wanted to share that progress is possible even on hard days.",
    supports: 42,
    comments: 8,
    image: null,
    communityId: "c1",
    communityName: "Mindful Paths",
    accent: true,
    createdAt: "2026-07-11T01:00:00Z",
  },
  {
    id: "p2",
    anonymous: false,
    author: "Jordan Lee",
    authorId: "u-jordan",
    avatar: "/images/home-feed/mark.jpg",
    time: "5h ago",
    feeling: "Feeling Calm",
    content:
      "Finally took a morning walk without my phone. The silence was intimidating at first, but then it became peaceful. Highly recommend a digital detox for just 30 minutes.",
    supports: 128,
    comments: 24,
    image: "/images/home-feed/forest-walk.png",
    communityId: "c7",
    communityName: "Sleep Hygiene",
    accent: false,
    createdAt: "2026-07-10T22:00:00Z",
  },
  {
    id: "p3",
    anonymous: false,
    author: "Priya Nair",
    authorId: "u-priya",
    time: "8h ago",
    feeling: "Feeling Optimistic",
    content:
      "Week 3 of CBT homework and I finally caught a thought spiral mid-way. Wrote it down, challenged it, moved on. Small, but it felt huge.",
    supports: 67,
    comments: 11,
    image: null,
    communityId: "c4",
    communityName: "The Sun Also Rises",
    accent: false,
    createdAt: "2026-07-10T19:00:00Z",
  },
  {
    id: "p4",
    anonymous: true,
    author: "Anonymous Member",
    authorId: "u-anon-2",
    time: "1d ago",
    feeling: "Feeling Tired",
    content:
      "Grief is weird. Some days I laugh at old jokes, then cry in the grocery aisle. Grateful this community doesn't rush me.",
    supports: 203,
    comments: 41,
    image: null,
    communityId: "c6",
    communityName: "Grief Garden",
    accent: true,
    createdAt: "2026-07-10T03:00:00Z",
  },
  {
    id: "p5",
    anonymous: false,
    author: "Alex Rivera",
    authorId: "me",
    avatar: "/images/home-feed/alex.jpg",
    time: "2d ago",
    feeling: "Feeling Calm",
    content:
      "Today I found peace in the simplest routine. Meditation for 10 minutes changed my entire outlook on a stressful morning. Remind yourself to breathe.",
    supports: 24,
    comments: 8,
    image: "/images/dewy-leaves.png",
    communityId: "c1",
    communityName: "Mindful Paths",
    accent: false,
    createdAt: "2026-07-09T08:00:00Z",
  },
];

export const seedTherapists: TherapistRecord[] = [
  {
    id: "elena-vance",
    name: "Dr. Elena Vance",
    credentials: "PsyD, Clinical Psychologist",
    rating: 4.9,
    reviewCount: 128,
    tags: ["Anxiety", "LGBTQ+", "Trauma"],
    quote: "I specialize in helping individuals navigate complex life transitions",
    bio: "Clinical psychologist with 12 years of experience in anxiety, trauma-informed care, and LGBTQ+ affirming therapy. Sessions are collaborative and paced to your nervous system.",
    nextAvailable: "Tomorrow, 10:00 AM",
    rate: 150,
    image: "/images/therapy/elena-vance.jpg",
    specializations: ["Anxiety & Stress", "CBT Therapy", "Depression"],
    language: "English",
    languages: ["English", "Spanish"],
    availability: ["Today", "This Week", "Weekend"],
    sessionTypes: ["Video", "Chat"],
    location: "Remote",
  },
  {
    id: "marcus-thorne",
    name: "Marcus Thorne",
    credentials: "LCSW, Master of Social Work",
    rating: 4.8,
    reviewCount: 96,
    tags: ["Depression", "Family", "Grief"],
    quote: "Passionate about family dynamics and supporting those…",
    bio: "Licensed clinical social worker focused on depression recovery, grief, and family systems. Offers group and individual formats.",
    nextAvailable: "Monday, 2:00 PM",
    rate: 120,
    image: "/images/therapy/marcus-thorne.png",
    specializations: ["Depression", "Family Issues"],
    language: "English",
    languages: ["English"],
    availability: ["Today", "This Week", "Weekend"],
    sessionTypes: ["Video", "In-person"],
    location: "Brooklyn, NY",
  },
  {
    id: "sarah-jenkins",
    name: "Sarah Jenkins",
    credentials: "LMFT, Marriage & Family",
    rating: 5.0,
    reviewCount: 154,
    tags: ["Relationships", "Adolescents"],
    quote: "Providing a safe space for couples and families to rebuild…",
    bio: "Marriage and family therapist helping couples and teens rebuild trust and communication. Warm, structured, and culturally curious.",
    nextAvailable: "Today, 4:30 PM",
    rate: 180,
    image: "/images/therapy/sarah-jenkins.jpg",
    specializations: ["Depression", "Family Issues", "Anxiety & Stress"],
    language: "English",
    languages: ["English", "Spanish"],
    availability: ["Today", "This Week", "Weekend"],
    sessionTypes: ["Video", "Chat"],
    location: "Seattle, WA",
  },
  {
    id: "james-wilson",
    name: "Dr. James Wilson",
    credentials: "MD, Psychiatrist",
    rating: 4.7,
    reviewCount: 73,
    tags: ["Medication", "Bipolar", "PTSD"],
    quote: "Focusing on the biological and psychological intersection of…",
    bio: "Board-certified psychiatrist offering collaborative medication management alongside therapy referrals for PTSD and bipolar care.",
    nextAvailable: "In 2 days, 9:00 AM",
    rate: 250,
    image: "/images/therapy/james-wilson.jpg",
    specializations: ["Depression", "Anxiety & Stress", "CBT Therapy"],
    language: "English",
    languages: ["English"],
    availability: ["Today", "This Week"],
    sessionTypes: ["Video"],
    location: "Remote",
  },
  {
    id: "elena-aris",
    name: "Dr. Elena Aris",
    credentials: "PhD, Clinical Psychologist",
    rating: 4.95,
    reviewCount: 210,
    tags: ["Anxiety", "CBT", "Adults"],
    quote: "Evidence-based care with warmth — progress at a human pace.",
    bio: "Munity network therapist (demo account). Specializes in CBT for anxiety and life transitions. Based in Accra with remote sessions worldwide.",
    nextAvailable: "Today, 3:00 PM",
    rate: 135,
    image: "/images/home-feed/elena.jpg",
    specializations: ["Anxiety & Stress", "CBT Therapy", "Depression"],
    language: "English",
    languages: ["English", "Twi"],
    availability: ["Today", "This Week", "Weekend"],
    sessionTypes: ["Video", "Chat"],
    location: "Accra · Remote",
  },
  {
    id: "ama-okai",
    name: "Ama Okai",
    credentials: "LPC, Counselor",
    rating: 4.6,
    reviewCount: 58,
    tags: ["Students", "Stress", "Identity"],
    quote: "A steady presence for young adults finding their footing.",
    bio: "Counselor supporting students and early-career adults with identity, stress, and belonging.",
    nextAvailable: "Weekend, 11:00 AM",
    rate: 95,
    image: "/images/therapy/marcus-thorne.png",
    specializations: ["Anxiety & Stress", "Family Issues"],
    language: "English",
    languages: ["English", "French"],
    availability: ["This Week", "Weekend"],
    sessionTypes: ["Video", "Chat"],
    location: "Remote",
  },
];

export const seedChats: ChatThread[] = [
  {
    id: "sarah",
    name: "Dr. Sarah Jenkins",
    preview: "That sounds like a great breakthrough. Let's discuss it...",
    time: "2m",
    avatar: "/images/messages/sarah-list.jpg",
    filter: "Therapists",
    therapistId: "sarah-jenkins",
    online: true,
  },
  {
    id: "anxiety",
    name: "Anxiety Peer Support",
    preview: "Mark sent a new message",
    time: "15m",
    avatar: "/images/messages/anxiety-group.jpg",
    filter: "Groups",
    unread: true,
  },
  {
    id: "mindfulness",
    name: "Daily Mindfulness",
    preview: "New reflection prompt: What are you grateful for today?",
    time: "1h",
    avatar: "/images/messages/mindfulness.jpg",
    filter: "Groups",
  },
  {
    id: "elena",
    name: "Dr. Elena Aris",
    preview: "I'll be available for our session at 3 PM.",
    time: "4h",
    avatar: "/images/messages/elena.jpg",
    filter: "Therapists",
    therapistId: "elena-aris",
  },
  {
    id: "jordan",
    name: "Jordan Lee",
    preview: "Thanks for the resource link! It really helped.",
    time: "1d",
    avatar: "/images/home-feed/mark.jpg",
    filter: "Groups",
  },
];

export const seedMessages: Record<string, ChatMessage[]> = {
  sarah: [
    { id: "d1", kind: "date", label: "Monday, Oct 21" },
    {
      id: "m1",
      kind: "text",
      from: "them",
      content:
        "Hello! How have you been feeling since our last session? I noticed your mood tracker showed some spikes in anxiety yesterday evening.",
      time: "10:02 AM",
    },
    {
      id: "m2",
      kind: "text",
      from: "me",
      content:
        "Hi Dr. Jenkins. It was a bit rough. I tried the breathing exercises we discussed — they helped a little, but work still feels overwhelming.",
      time: "10:05 AM",
    },
    {
      id: "m3",
      kind: "text",
      from: "them",
      content:
        "That sounds like a great breakthrough using the exercises. Let's discuss what felt hardest and build a smaller plan for this week.",
      time: "10:08 AM",
    },
  ],
  anxiety: [
    { id: "d2", kind: "date", label: "Today" },
    {
      id: "m4",
      kind: "text",
      from: "them",
      content: "I tried that breathing exercise today and it really helped. Thank you all.",
      time: "9:12 AM",
    },
    {
      id: "m5",
      kind: "text",
      from: "me",
      content: "Proud of you for trying it in the moment. The 4-7-8 one is my go-to.",
      time: "9:18 AM",
    },
  ],
  mindfulness: [
    { id: "d3", kind: "date", label: "Today" },
    {
      id: "m6",
      kind: "text",
      from: "them",
      content: "New reflection prompt: What are you grateful for today?",
      time: "8:00 AM",
    },
  ],
  elena: [
    { id: "d4", kind: "date", label: "Yesterday" },
    {
      id: "m7",
      kind: "text",
      from: "them",
      content: "I'll be available for our session at 3 PM. Bring one win and one challenge from the week.",
      time: "4:00 PM",
    },
    {
      id: "m8",
      kind: "text",
      from: "me",
      content: "Sounds good — see you then.",
      time: "4:12 PM",
    },
  ],
  jordan: [
    { id: "d5", kind: "date", label: "Yesterday" },
    {
      id: "m9",
      kind: "text",
      from: "them",
      content: "Thanks for the resource link! It really helped me out.",
      time: "6:00 PM",
    },
  ],
};

export const seedBookings: Booking[] = [
  {
    id: "b1",
    therapistId: "elena-aris",
    therapistName: "Dr. Elena Aris",
    when: "Today, 3:00 PM",
    status: "confirmed",
    createdAt: "2026-07-09T12:00:00Z",
  },
  {
    id: "b2",
    therapistId: "sarah-jenkins",
    therapistName: "Sarah Jenkins",
    when: "Monday, 4:30 PM",
    status: "pending",
    createdAt: "2026-07-10T09:00:00Z",
  },
];

export const seedReports: ModerationReport[] = [
  {
    id: "8492",
    reporter: "Jane_Doe",
    reporterInitials: "JD",
    target: "@Alex_Care",
    targetSnippet: 'Post: "Feeling hopeless today..."',
    reason: "Self-Harm",
    reasonTone: "danger",
    status: "Pending Urgent",
    severity: "CRITICAL",
    urgent: true,
  },
  {
    id: "8491",
    reporter: "Mike_L",
    reporterInitials: "ML",
    target: "@CryptoBot23",
    targetSnippet: 'Comment: "Check my link for..."',
    reason: "Spam",
    reasonTone: "lime",
    status: "In Review",
    severity: "LOW",
  },
  {
    id: "8490",
    reporter: "Sarah_K",
    reporterInitials: "SK",
    target: "@User_Anon",
    targetSnippet: "Direct Message",
    reason: "Harassment",
    reasonTone: "neutral",
    status: "Pending",
    severity: "MEDIUM",
  },
  {
    id: "8489",
    reporter: "Priya_N",
    reporterInitials: "PN",
    target: "@NightOwl99",
    targetSnippet: 'Post: "You people are so dramatic..."',
    reason: "Hate Speech",
    reasonTone: "danger",
    status: "Pending",
    severity: "MEDIUM",
  },
  {
    id: "8488",
    reporter: "ModBot",
    reporterInitials: "MB",
    target: "@PromoFlood",
    targetSnippet: "Repeated unsolicited DMs",
    reason: "Spam",
    reasonTone: "lime",
    status: "Resolved",
    severity: "LOW",
    resolution: "Warned",
    resolvedAt: "2026-07-08T16:00:00Z",
  },
];

export const seedSessionNotes: SessionNoteRecord[] = [
  {
    id: "n1",
    patientSlug: "leo-richards",
    patientName: "Leo Richards",
    title: "Session 12 — Sleep & rumination",
    body: "Client reported improved sleep latency after stimulus-control homework. Continued CBT for rumination; assigned thought record for next week.",
    sessionDate: "2026-07-08",
    createdAt: "2026-07-08T15:30:00Z",
  },
  {
    id: "n2",
    patientSlug: "elena-rodriguez",
    patientName: "Elena Rodriguez",
    title: "Intake follow-up",
    body: "Reviewed goals: reduce panic frequency, rebuild social routine. Safety plan reviewed; no SI/HI.",
    sessionDate: "2026-07-07",
    createdAt: "2026-07-07T11:00:00Z",
  },
];

export const seedSavedPostIds = ["p2", "p5"];
export const seedSavedResourceIds = [
  "res-morning-routine-for-mental-clarity",
  "res-cognitive-reframing-workbook",
];
export const seedSupportedPostIds = ["p2"];

export type MemberSettingsState = {
  emailNotifications: boolean;
  pushNotifications: boolean;
  weeklyDigest: boolean;
  showOnlineStatus: boolean;
  anonymousDefault: boolean;
  displayName: string;
};

export const seedSettings: MemberSettingsState = {
  emailNotifications: true,
  pushNotifications: true,
  weeklyDigest: false,
  showOnlineStatus: true,
  anonymousDefault: false,
  displayName: "Alex Rivera",
};

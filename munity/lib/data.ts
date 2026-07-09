import type {
  Community,
  Conversation,
  Message,
  MoodEntry,
  Post,
  Profile,
  Resource,
  Therapist,
} from './types'

/**
 * Seed data for Munity.
 *
 * This is the single source of truth the UI renders from while you have
 * not connected Supabase yet. Once your tables (see `supabase/schema.sql`)
 * are populated, replace the getter functions at the bottom of this file
 * with real Supabase queries — the return shapes already match the table
 * rows, so your components won't need to change.
 */

export const currentUser: Profile = {
  id: 'me',
  full_name: 'Alex Rivera',
  username: 'arivera_mindful',
  avatar_url: null,
  bio: 'Navigating the journey to nurtured stability. Passionate about peer support, cognitive wellness, and early morning meditation.',
  created_at: '2024-01-12T08:00:00Z',
}

export const communities: Community[] = [
  {
    id: 'c1',
    slug: 'mindful-paths',
    name: 'Mindful Paths',
    description:
      'A safe space for those exploring mindfulness and anxiety. Share daily intentions and grounding techniques.',
    category: 'Anxiety',
    member_count: 1200,
    image_url: '/images/forest-path.png',
    verified: true,
  },
  {
    id: 'c2',
    slug: 'campus-calm',
    name: 'Campus Calm',
    description:
      'Supporting students through exam stress, social anxiety, and the pressures of academic life.',
    category: 'Student Support',
    member_count: 4500,
    image_url: '/images/campus-calm.png',
    verified: true,
  },
  {
    id: 'c3',
    slug: 'career-care',
    name: 'Career Care',
    description:
      'Navigating the complexities of mental health in the professional world and avoiding burnout.',
    category: 'Workplace Stress',
    member_count: 892,
    image_url: '/images/hands-phone.png',
    verified: false,
  },
  {
    id: 'c4',
    slug: 'neuro-nook',
    name: 'Neuro-Nook',
    description:
      'Celebrating neurodiversity and supporting unique brains. ADHD, autism, and everything in between.',
    category: 'Neurodiversity',
    member_count: 2100,
    image_url: '/images/cozy-nook.png',
    verified: true,
  },
  {
    id: 'c5',
    slug: 'the-sun-also-rises',
    name: 'The Sun Also Rises',
    description:
      'A lighthouse for those in dark seasons. Finding small victories and hope, one morning at a time.',
    category: 'Depression',
    member_count: 3300,
    image_url: '/images/sunrise-calm.png',
    verified: true,
  },
  {
    id: 'c6',
    slug: 'mindful-morning-oasis',
    name: 'Mindful Morning Oasis',
    description:
      'A gentle space for early risers to practice meditation and share daily intentions for calm.',
    category: 'Mindfulness',
    member_count: 1200,
    image_url: '/images/meditation-space.png',
    verified: true,
  },
]

export const posts: Post[] = [
  {
    id: 'p1',
    author_id: 'u2',
    author: { full_name: 'Anonymous Member', avatar_url: null, username: 'anon' },
    community_id: 'c1',
    community_name: 'Anxiety Support Group',
    content:
      "Just finished my first group therapy session and feeling remarkably heard. It's the first time in weeks my thoughts haven't been racing. Thank you Munity community for being so welcoming.",
    image_url: null,
    is_anonymous: true,
    support_count: 24,
    comment_count: 8,
    created_at: '2024-06-28T06:00:00Z',
  },
  {
    id: 'p2',
    author_id: 'u3',
    author: { full_name: 'Sarah Mitchell', avatar_url: null, username: 'sarah_m' },
    community_id: 'c6',
    community_name: 'Mindful Moments',
    content:
      'Finding peace in the little things today. My morning ritual of journaling has changed everything. The forest walk afterwards is my reset button.',
    image_url: '/images/forest-path.png',
    is_anonymous: false,
    support_count: 112,
    comment_count: 15,
    created_at: '2024-06-28T03:00:00Z',
  },
  {
    id: 'p3',
    author_id: 'me',
    author: { full_name: 'Alex Rivera', avatar_url: null, username: 'arivera_mindful' },
    community_id: 'c1',
    community_name: 'Anxiety Support',
    content:
      "Today I found peace in the simplest routine. Meditation for 10 minutes changed my entire outlook on the stressful morning. Remind yourself to breathe.",
    image_url: '/images/dewy-leaves.png',
    is_anonymous: false,
    support_count: 24,
    comment_count: 8,
    created_at: '2024-06-28T05:00:00Z',
  },
]

export const therapists: Therapist[] = [
  {
    id: 't1',
    full_name: 'Dr. Elena Rossi',
    title: 'Clinical Psychologist',
    avatar_url: '',
    rating: 4.9,
    review_count: 128,
    specializations: ['Anxiety', 'CBT'],
    session_types: ['Video', 'Chat'],
    languages: ['English', 'Italian'],
    hourly_rate: 120,
    location: 'Remote',
    bio: 'Specializing in anxiety and cognitive behavioral therapy with over a decade of helping clients build lasting resilience.',
    next_available: 'Tomorrow, 10:30 AM',
  },
  {
    id: 't2',
    full_name: 'Marcus Thorne',
    title: 'LCSW · Peer Specialist',
    avatar_url: '',
    rating: 4.7,
    review_count: 96,
    specializations: ['Depression', 'Group'],
    session_types: ['Video', 'In-person'],
    languages: ['English'],
    hourly_rate: 95,
    location: 'Brooklyn, NY',
    bio: 'A licensed clinical social worker passionate about group healing and depression recovery through community.',
    next_available: 'Today, 4:30 PM',
  },
  {
    id: 't3',
    full_name: 'Sarah Jenkins',
    title: 'Relationship Counselor',
    avatar_url: '',
    rating: 4.8,
    review_count: 154,
    specializations: ['Couples', 'Stress'],
    session_types: ['Video', 'Chat'],
    languages: ['English', 'Spanish'],
    hourly_rate: 140,
    location: 'Seattle, WA',
    bio: 'Peer support advocate and mindfulness practitioner. Currently exploring cognitive behavioral techniques to manage daily anxiety. I believe in the power of community, vulnerability, and small consistent steps toward stability.',
    next_available: 'In 3 days, 11:00 AM',
  },
  {
    id: 't4',
    full_name: 'Dr. James Wilson',
    title: 'Psychiatrist',
    avatar_url: '',
    rating: 4.6,
    review_count: 73,
    specializations: ['Medication', 'ADHD'],
    session_types: ['Video'],
    languages: ['English'],
    hourly_rate: 180,
    location: 'Remote',
    bio: 'Board-certified psychiatrist focused on collaborative, evidence-based medication management and neurodivergent care.',
    next_available: 'In 5 days, 9:00 AM',
  },
]

export const conversations: Conversation[] = [
  {
    id: 'cv1',
    participant_name: 'Dr. Sarah Henderson',
    participant_avatar: null,
    is_therapist: true,
    last_message: 'How have you been feeling since our last session?',
    last_message_at: '2024-06-28T10:45:00Z',
    unread_count: 1,
  },
  {
    id: 'cv2',
    participant_name: 'Anxiety Peer Support',
    participant_avatar: null,
    is_therapist: false,
    last_message: 'Mark: I tried that breathing exercise today and it helped.',
    last_message_at: '2024-06-28T09:12:00Z',
    unread_count: 3,
  },
  {
    id: 'cv3',
    participant_name: 'Jordan Lee',
    participant_avatar: null,
    is_therapist: false,
    last_message: 'Thanks for the resource link! It really helped me out.',
    last_message_at: '2024-06-27T18:00:00Z',
    unread_count: 0,
  },
  {
    id: 'cv4',
    participant_name: 'Marcus Chen',
    participant_avatar: null,
    is_therapist: false,
    last_message: 'Your appointment is confirmed for next Monday.',
    last_message_at: '2024-06-26T14:00:00Z',
    unread_count: 0,
  },
]

export const messagesByConversation: Record<string, Message[]> = {
  cv1: [
    {
      id: 'm1',
      conversation_id: 'cv1',
      sender_id: 't-sarah',
      is_self: false,
      content:
        "Hello! How have you been feeling since our last session? I noticed you mentioned earlier that you were feeling some difficulty sleeping yesterday evening.",
      created_at: '2024-06-28T10:00:00Z',
    },
    {
      id: 'm2',
      conversation_id: 'cv1',
      sender_id: 'me',
      is_self: true,
      content:
        "Hi Dr. Jenkins. Yes, it was a bit rough. I tried the breathing exercises we discussed, which helped a little, but I'm still feeling a bit overwhelmed by the new project at work.",
      created_at: '2024-06-28T10:05:00Z',
    },
    {
      id: 'm3',
      conversation_id: 'cv1',
      sender_id: 't-sarah',
      is_self: false,
      content:
        "That sounds like a great breakthrough using the exercises. The silence was intimidating at first, but then it became peaceful. Highly recommends digital detox for just 30 minutes.",
      created_at: '2024-06-28T10:08:00Z',
    },
  ],
  cv2: [
    {
      id: 'm4',
      conversation_id: 'cv2',
      sender_id: 'u-mark',
      is_self: false,
      content: 'I tried that breathing exercise today and it really helped. Thank you all.',
      created_at: '2024-06-28T09:12:00Z',
    },
  ],
}

export const resources: Resource[] = [
  {
    id: 'r1',
    title: 'Guided Body Scan',
    type: 'meditation',
    description: 'A 10-minute meditation to release tension and reconnect with the present.',
    duration: '10 min',
  },
  {
    id: 'r2',
    title: 'Understanding Anxiety Triggers',
    type: 'article',
    description: 'Evidence-based reading on identifying and managing what sets off anxiety.',
    duration: '6 min read',
  },
  {
    id: 'r3',
    title: 'Gratitude Journal Prompt',
    type: 'journal',
    description: 'Three reflective prompts to ground your day in what is going well.',
    duration: null,
  },
  {
    id: 'r4',
    title: '4-7-8 Breathing Exercise',
    type: 'exercise',
    description: 'A simple breathing pattern to lower your heart rate in moments of stress.',
    duration: '3 min',
  },
]

export const recentMoodEntries: MoodEntry[] = [
  { id: 'me1', user_id: 'me', mood: 'anxious', note: null, created_at: '2024-06-23T08:00:00Z' },
  { id: 'me2', user_id: 'me', mood: 'calm', note: null, created_at: '2024-06-24T08:00:00Z' },
  { id: 'me3', user_id: 'me', mood: 'tired', note: null, created_at: '2024-06-25T08:00:00Z' },
  { id: 'me4', user_id: 'me', mood: 'optimistic', note: null, created_at: '2024-06-26T08:00:00Z' },
  { id: 'me5', user_id: 'me', mood: 'optimistic', note: null, created_at: '2024-06-27T08:00:00Z' },
  { id: 'me6', user_id: 'me', mood: 'thriving', note: null, created_at: '2024-06-28T08:00:00Z' },
]

// ----------------------------------------------------------------
// Getters — swap the bodies for Supabase queries when you connect.
// e.g.
//   const supabase = await createClient()
//   const { data } = await supabase.from('communities').select('*')
//   return data ?? []
// ----------------------------------------------------------------

export function getCommunities() {
  return communities
}

/** Alias used by the Home dashboard. Returns the current signed-in user. */
export function getCurrentUser() {
  return currentUser
}

/** Alias used by the Home dashboard. Returns the main feed. */
export function getFeedPosts() {
  return posts
}

/** Alias used by the Home dashboard sidebar. A handful of communities to suggest. */
export function getSuggestedCommunities() {
  return communities.filter((c) => !c.is_member).slice(0, 3)
}

export function getCommunityBySlug(slug: string) {
  return communities.find((c) => c.slug === slug)
}

export function getPosts() {
  return posts
}

export function getTherapists() {
  return therapists
}

export function getTherapistById(id: string) {
  return therapists.find((t) => t.id === id)
}

export function getConversations() {
  return conversations
}

export function getConversationById(id: string) {
  return conversations.find((c) => c.id === id)
}

export function getMessages(conversationId: string) {
  return messagesByConversation[conversationId] ?? []
}

export function getResources() {
  return resources
}

export function getMoodEntries() {
  return recentMoodEntries
}

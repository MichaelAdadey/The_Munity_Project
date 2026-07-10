export type FeedMood = 'Happy' | 'Calm' | 'Stressed' | 'Sad' | 'Anxious'

export type FeedPost = {
  id: string
  author: string
  isAnonymous: boolean
  mood: FeedMood
  moodEmoji: string
  content: string
  timeAgo: string
  supportCount: number
  commentCount: number
  imageUrl?: string
}

export type JoinedCommunity = {
  id: string
  name: string
  initial: string
  activity: string
  color: string
}

export type SuggestedGroup = {
  id: string
  name: string
  initial: string
  members: string
}

export type FeedTherapist = {
  id: string
  name: string
  specialty: string
  avatarUrl: string
  status: 'online' | 'busy'
}

export const homeProfile = {
  name: 'Alex Rivera',
  tagline: 'Daily Mindful Warrior',
  avatarUrl: '/home/7b8aa8423e2bdeb9b208b14523f9700c472bfdba.png',
  dayStreak: 12,
  groups: 4,
}

export const joinedCommunities: JoinedCommunity[] = [
  { id: 'jc1', name: 'Anxiety Support', initial: 'A', activity: '12 new posts', color: '#d6e7a1' },
  { id: 'jc2', name: 'Meditation Circle', initial: 'M', activity: '5 new posts', color: '#e4e4cc' },
  { id: 'jc3', name: 'Night Owls', initial: 'N', activity: 'Just now', color: '#d6e7a1' },
]

export const feedPosts: FeedPost[] = [
  {
    id: 'fp1',
    author: 'Anonymous Warrior',
    isAnonymous: true,
    mood: 'Anxious',
    moodEmoji: '😰',
    content:
      "Today was tough. I felt like I couldn't breathe during my meeting, but I remembered the grounding technique I learned here last week. 5-4-3-2-1. It actually worked. Just wanted to share that progress is possible even on hard days.",
    timeAgo: '2h ago',
    supportCount: 42,
    commentCount: 8,
  },
  {
    id: 'fp2',
    author: 'Sarah Jenkins',
    isAnonymous: false,
    mood: 'Calm',
    moodEmoji: '😌',
    content:
      'Finally took a morning walk without my phone. The silence was intimidating at first, but then it became peaceful. Highly recommend a digital detox for just 30 minutes. 🌿',
    timeAgo: '5h ago',
    supportCount: 128,
    commentCount: 14,
    imageUrl: '/home/80cc9837670d9638534fc7c0eca8431f310b69f7.png',
  },
]

export const moodOptions: { label: FeedMood; emoji: string; bg: string }[] = [
  { label: 'Happy', emoji: '😊', bg: '#fef9c3' },
  { label: 'Calm', emoji: '😌', bg: '#dcfce7' },
  { label: 'Stressed', emoji: '😫', bg: '#ffedd5' },
  { label: 'Sad', emoji: '😢', bg: '#dbeafe' },
  { label: 'Anxious', emoji: '😰', bg: '#f3e8ff' },
]

export const suggestedGroups: SuggestedGroup[] = [
  { id: 'sg1', name: 'Sleep Hygiene', initial: 'S', members: '2.4k members' },
  { id: 'sg2', name: 'CBT Basics', initial: 'C', members: '8.1k members' },
]

export const feedTherapists: FeedTherapist[] = [
  {
    id: 'ft1',
    name: 'Dr. Elena Thorne',
    specialty: 'Cognitive Behavioral',
    avatarUrl: '/home/e6f9b5f7690f05e32ae4f06cf94f0965a9f5a05f.png',
    status: 'online',
  },
  {
    id: 'ft2',
    name: 'Mark Wilson, LCSW',
    specialty: 'Peer Specialist',
    avatarUrl: '/home/5dbbd5958fe60394f83c4d6df9f46e299df8e9fc.png',
    status: 'busy',
  },
]

export const mindfulMoment =
  '"Box breathing: Inhale for 4, Hold for 4, Exhale for 4, Hold for 4. Repeat until you feel grounded."'

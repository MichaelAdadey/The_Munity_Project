/**
 * Domain types for Munity. These mirror the database tables defined in
 * `supabase/schema.sql`, so the data layer (`lib/data.ts`) can return the
 * same shapes whether it is reading seed data or live Supabase rows.
 */

export type Profile = {
  id: string
  full_name: string
  username: string
  avatar_url: string | null
  bio: string | null
  created_at: string
}

export type Mood = 'struggling' | 'anxious' | 'tired' | 'calm' | 'optimistic' | 'thriving'

export type MoodEntry = {
  id: string
  user_id: string
  mood: Mood
  note: string | null
  created_at: string
}

export type Community = {
  id: string
  slug: string
  name: string
  description: string
  category: string
  member_count: number
  image_url: string
  verified: boolean
  is_member?: boolean
}

export type Post = {
  id: string
  author_id: string
  author: Pick<Profile, 'full_name' | 'avatar_url' | 'username'>
  community_id: string | null
  community_name: string | null
  content: string
  image_url: string | null
  is_anonymous: boolean
  support_count: number
  comment_count: number
  created_at: string
}

export type Therapist = {
  id: string
  full_name: string
  title: string
  avatar_url: string
  rating: number
  review_count: number
  specializations: string[]
  session_types: string[]
  languages: string[]
  hourly_rate: number
  location: string
  bio: string
  next_available: string
}

export type Conversation = {
  id: string
  participant_name: string
  participant_avatar: string | null
  is_therapist: boolean
  last_message: string
  last_message_at: string
  unread_count: number
}

export type Message = {
  id: string
  conversation_id: string
  sender_id: string
  is_self: boolean
  content: string
  created_at: string
}

export type Resource = {
  id: string
  title: string
  type: 'meditation' | 'article' | 'journal' | 'exercise'
  description: string
  duration: string | null
}

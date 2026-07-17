import { createBrowserClient } from '@supabase/ssr'

/**
 * Returns true when the Supabase environment variables are present.
 * Until you add them (locally in `.env.local`), the app falls back to
 * the seed data in `lib/data.ts` so the UI is fully previewable.
 */
export function isSupabaseConfigured() {
  return (
    !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
}

/**
 * Browser-side Supabase client. Use inside Client Components.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )
}

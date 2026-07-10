'use server'

import { redirect } from 'next/navigation'
import { isSupabaseConfigured } from '@/lib/supabase/client'
import { createClient } from '@/lib/supabase/server'

export type AuthState = { error?: string } | undefined

/**
 * Email + password sign in.
 * Falls back to a direct redirect when Supabase is not configured yet,
 * so the preview is navigable without a backend.
 */
export async function signIn(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = String(formData.get('email') || '')
  const password = String(formData.get('password') || '')

  if (!email || !password) {
    return { error: 'Please enter your email and password.' }
  }

  if (!isSupabaseConfigured()) {
    redirect('/home')
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) return { error: error.message }
  redirect('/home')
}

/**
 * Email + password sign up.
 */
export async function signUp(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const fullName = String(formData.get('full_name') || '')
  const email = String(formData.get('email') || '')
  const password = String(formData.get('password') || '')

  if (!email || !password) {
    return { error: 'Please enter your email and password.' }
  }

  if (!isSupabaseConfigured()) {
    redirect('/home')
  }

  const supabase = await createClient()
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName },
      emailRedirectTo: `${siteUrl}/home`,
    },
  })

  if (error) return { error: error.message }
  redirect('/home')
}

/**
 * Google OAuth. Redirects to the provider's consent screen.
 */
export async function signInWithGoogle(): Promise<void> {
  if (!isSupabaseConfigured()) {
    redirect('/home')
  }

  const supabase = await createClient()
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: `${siteUrl}/auth/callback` },
  })

  if (error) redirect(`/login?error=${encodeURIComponent(error.message)}`)
  if (data.url) redirect(data.url)
}

/**
 * Sign out and return to the landing page.
 */
export async function signOut() {
  if (isSupabaseConfigured()) {
    const supabase = await createClient()
    await supabase.auth.signOut()
  }
  redirect('/')
}

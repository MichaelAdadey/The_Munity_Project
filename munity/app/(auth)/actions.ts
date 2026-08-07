'use server'

import { redirect } from 'next/navigation'
import { findMockAccount, getMockAccountByRole } from '@/lib/mock-credentials'
import { clearMockSession, setMockSession } from '@/lib/mock-session'
import { isSupabaseConfigured } from '@/lib/supabase/client'
import { createClient } from '@/lib/supabase/server'
import { authErrorMessage } from '@/lib/auth/error-messages'

export type AuthState = { error?: string; success?: string } | undefined

/**
 * Email + password sign in.
 * Falls back to mock credentials when Supabase is not configured yet,
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
    const account = findMockAccount(email, password)
    if (!account || account.role !== 'user') {
      return {
        error:
          'Invalid member credentials. Use alex.rivera@munity.app / User1234!',
      }
    }
    await setMockSession(account)
    redirect(account.redirectTo)
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
  const firstName = String(formData.get('first_name') || '').trim()
  const lastName = String(formData.get('last_name') || '').trim()
  const email = String(formData.get('email') || '')
  const password = String(formData.get('password') || '')

  if (!firstName || !lastName) {
    return { error: 'Please enter your first and last name.' }
  }

  if (!email || !password) {
    return { error: 'Please enter your email and password.' }
  }

  const fullName = `${firstName} ${lastName}`

  if (!isSupabaseConfigured()) {
    const account = getMockAccountByRole('user')
    await setMockSession({
      ...account,
      name: fullName,
      email: email.trim().toLowerCase() || account.email,
    })
    redirect('/home')
  }

  const supabase = await createClient()
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName, first_name: firstName, last_name: lastName },
      emailRedirectTo: `${siteUrl}/auth/callback?next=${encodeURIComponent('/home')}`,
    },
  })

  if (error) {
    return {
      error: authErrorMessage(
        error,
        'Signup failed. Supabase could not save the new user — check your Supabase Auth/Postgres logs (this is usually the on_auth_user_created trigger on auth.users or a constraint on public.profiles).',
      ),
    }
  }

  // Email confirmation is ON in Supabase — there is no session yet. Ask the
  // member to confirm before redirecting them into the app.
  if (!data.session) {
    return {
      success:
        'Account created. Check your email to confirm your address, then log back in.',
    }
  }
  redirect('/home')
}

/**
 * Google OAuth. Redirects to the provider's consent screen.
 */
export async function signInWithGoogle(): Promise<void> {
  if (!isSupabaseConfigured()) {
    await setMockSession(getMockAccountByRole('user'))
    redirect('/home')
  }

  const supabase = await createClient()
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${siteUrl}/auth/callback?next=${encodeURIComponent('/home')}`,
    },
  })

  if (error) redirect(`/login?error=${encodeURIComponent(error.message)}`)
  if (data.url) redirect(data.url)
}

/**
 * Sign out and return to the landing page.
 */
export async function signOut() {
  await clearMockSession()
  if (isSupabaseConfigured()) {
    const supabase = await createClient()
    await supabase.auth.signOut()
  }
  redirect('/')
}

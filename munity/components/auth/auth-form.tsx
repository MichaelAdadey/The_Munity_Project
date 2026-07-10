'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import Link from 'next/link'
import { AlertCircle } from 'lucide-react'
import {
  signIn,
  signUp,
  signInWithGoogle,
  type AuthState,
} from '@/app/(auth)/actions'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" className="w-full rounded-full" disabled={pending}>
      {pending ? 'Please wait…' : label}
    </Button>
  )
}

function GoogleButton() {
  const { pending } = useFormStatus()
  return (
    <Button
      type="submit"
      variant="outline"
      className="w-full rounded-full"
      disabled={pending}
    >
      <svg className="size-4" viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="#4285F4"
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1Z"
        />
        <path
          fill="#34A853"
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z"
        />
        <path
          fill="#FBBC05"
          d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84Z"
        />
        <path
          fill="#EA4335"
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38Z"
        />
      </svg>
      Continue with Google
    </Button>
  )
}

export function AuthForm({ mode }: { mode: 'login' | 'signup' }) {
  const action = mode === 'login' ? signIn : signUp
  const [state, formAction] = useActionState<AuthState, FormData>(
    action,
    undefined,
  )

  return (
    <div className="space-y-5">
      {state?.error && (
        <div className="flex items-start gap-2 rounded-xl bg-destructive/10 px-3 py-2.5 text-sm text-destructive">
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          <span>{state.error}</span>
        </div>
      )}

      <form action={formAction} className="space-y-4">
        {mode === 'signup' && (
          <div className="space-y-2">
            <Label htmlFor="full_name">Full Name</Label>
            <Input
              id="full_name"
              name="full_name"
              type="text"
              placeholder="Alex Rivera"
              autoComplete="name"
              required
              className="h-11"
            />
          </div>
        )}
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            required
            className="h-11"
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            {mode === 'login' && (
              <Link
                href="#"
                className="text-xs font-medium text-primary hover:underline"
              >
                Forgot password?
              </Link>
            )}
          </div>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            required
            className="h-11"
          />
        </div>

        {mode === 'login' && (
          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            <Checkbox name="remember" /> Remember Me
          </label>
        )}

        <SubmitButton label={mode === 'login' ? 'Login' : 'Create Account'} />
      </form>

      <div className="flex items-center gap-3">
        <span className="h-px flex-1 bg-border" />
        <span className="text-xs text-muted-foreground">or</span>
        <span className="h-px flex-1 bg-border" />
      </div>

      <form action={signInWithGoogle}>
        <GoogleButton />
      </form>
    </div>
  )
}

import Link from 'next/link'
import { LogoMark } from '@/components/logo'
import { AuthForm } from '@/components/auth/auth-form'
import { Card } from '@/components/ui/card'

export default function SignUpPage() {
  return (
    <Card className="border-border bg-card/90 p-8 shadow-sm backdrop-blur">
      <div className="flex flex-col items-center text-center">
        <LogoMark className="size-12 rounded-2xl" />
        <h1 className="mt-4 font-heading text-2xl font-semibold">Welcome</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Start your journey with Munity.
        </p>
      </div>

      <div className="mt-7">
        <AuthForm mode="signup" />
      </div>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have a Munity account?{' '}
        <Link href="/login" className="font-semibold text-primary hover:underline">
          Login
        </Link>
      </p>
    </Card>
  )
}

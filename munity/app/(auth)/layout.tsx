import Link from 'next/link'
import { Logo } from '@/components/logo'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-background px-4 py-12">
      {/* soft ambient shapes */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 -top-24 size-72 rounded-full bg-accent/40 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 -right-24 size-72 rounded-full bg-secondary/60 blur-3xl"
      />

      <Link href="/" className="absolute left-6 top-6">
        <Logo />
      </Link>

      <div className="relative z-10 w-full max-w-md">{children}</div>
    </div>
  )
}

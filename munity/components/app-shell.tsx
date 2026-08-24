'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Bell,
  BookOpen,
  Bookmark,
  Home,
  LifeBuoy,
  MessageCircle,
  Search,
  Settings,
  Stethoscope,
  User,
  Users,
} from 'lucide-react'
import { Logo, LogoMark } from '@/components/logo'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
// import { Button } from './ui/AppButton'
import { Input } from '@/components/ui/input'
import { currentUser } from '@/lib/data'
import { cn } from '@/lib/utils'

const primaryNav = [
  { href: '/home', label: 'Home', icon: Home },
  { href: '/communities', label: 'Communities', icon: Users },
  { href: '/therapy', label: 'Therapy', icon: Stethoscope },
  { href: '/messages', label: 'Messages', icon: MessageCircle },
  { href: '/resources', label: 'Resources', icon: BookOpen },
]

const secondaryNav = [
  { href: '/saved', label: 'Saved Posts', icon: Bookmark },
  { href: '/profile', label: 'Profile', icon: User },
  { href: '/settings', label: 'Settings', icon: Settings },
]

const mobileNav = [
  { href: '/home', label: 'Home', icon: Home },
  { href: '/communities', label: 'Communities', icon: Users },
  { href: '/therapy', label: 'Therapy', icon: Stethoscope },
  { href: '/messages', label: 'Messages', icon: MessageCircle },
  { href: '/profile', label: 'Profile', icon: User },
]

function isActive(pathname: string, href: string) {
  if (href === '/home') return pathname === '/home'
  return pathname.startsWith(href)
}

function initials(name: string) {
  return name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="min-h-dvh bg-background">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 lg:px-6">
          <Link href="/home" className="shrink-0">
            <Logo />
          </Link>
          <div className="relative ml-2 hidden max-w-md flex-1 md:block">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search communities or resources..."
              className="h-10 rounded-full border-border bg-card pl-9"
              aria-label="Search"
            />
          </div>
          <div className="ml-auto flex items-center gap-1.5">
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="hidden rounded-full text-destructive hover:bg-destructive/10 hover:text-destructive sm:inline-flex"
            >
              <Link href="/emergency">
                <LifeBuoy className="size-4" />
                Emergency
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              aria-label="Notifications"
            >
              <Bell className="size-5" />
            </Button>
            <Link href="/profile" aria-label="Your profile">
              <Avatar className="size-9 border border-border">
                <AvatarFallback className="bg-accent text-accent-foreground text-sm">
                  {initials(currentUser.full_name)}
                </AvatarFallback>
              </Avatar>
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl gap-6 px-4 lg:px-6">
        {/* Desktop sidebar */}
        <aside className="sticky top-16 hidden h-[calc(100dvh-4rem)] w-60 shrink-0 flex-col gap-1 overflow-y-auto py-6 lg:flex">
          <nav className="flex flex-col gap-1">
            {primaryNav.map((item) => {
              const active = isActive(pathname, item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                    active
                      ? 'bg-accent text-accent-foreground'
                      : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground',
                  )}
                >
                  <item.icon className="size-5" />
                  {item.label}
                </Link>
              )
            })}
          </nav>
          <div className="my-3 h-px bg-border" />
          <nav className="flex flex-col gap-1">
            {secondaryNav.map((item) => {
              const active = isActive(pathname, item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                    active
                      ? 'bg-accent text-accent-foreground'
                      : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground',
                  )}
                >
                  <item.icon className="size-5" />
                  {item.label}
                </Link>
              )
            })}
          </nav>
          <div className="mt-auto rounded-2xl bg-primary p-4 text-primary-foreground">
            <p className="text-sm font-semibold">Feeling overwhelmed?</p>
            <p className="mt-1 text-xs text-primary-foreground/80">
              Our licensed therapists are ready to help you navigate tough times.
            </p>
            <Button
              asChild
              size="sm"
              variant="secondary"
              className="mt-3 w-full rounded-full"
            >
              <Link href="/therapy">Book a session</Link>
            </Button>
          </div>
        </aside>

        {/* Main content */}
        <main className="min-w-0 flex-1 py-6 pb-24 lg:pb-10">{children}</main>
      </div>

      {/* Mobile bottom nav */}
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-md items-center justify-around px-2 py-2">
          {mobileNav.map((item) => {
            const active = isActive(pathname, item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex flex-1 flex-col items-center gap-1 rounded-lg py-1.5 text-[11px] font-medium transition-colors',
                  active ? 'text-primary' : 'text-muted-foreground',
                )}
              >
                <span
                  className={cn(
                    'flex size-9 items-center justify-center rounded-full',
                    active && 'bg-accent',
                  )}
                >
                  <item.icon className="size-5" />
                </span>
                {item.label}
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
}

export { LogoMark }

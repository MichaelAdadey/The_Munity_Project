'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Bell,
  BookOpen,
  Bookmark,
  LayoutDashboard,
  LifeBuoy,
  MessageCircle,
  Stethoscope,
  Users,
} from 'lucide-react'
import profile from '@/public/images/profile.jpg'
import { cn } from '@/lib/utils'

const topNav = [
  { href: '/Home', label: 'Home' },
  { href: '/Communities', label: 'Communities' },
  { href: '/Resources', label: 'Resources' },
  { href: '/Therapy', label: 'Therapy' },
  { href: '/messages', label: 'Messages' },
]

const sideNav = [
  { href: '/admindashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/Communities', label: 'Communities', icon: Users },
  { href: '/Resources', label: 'Resources', icon: BookOpen },
  { href: '/saved', label: 'Saved Posts', icon: Bookmark },
  { href: '/Therapy', label: 'Therapy', icon: Stethoscope },
]

function isActive(pathname: string, href: string) {
  return pathname.toLowerCase() === href.toLowerCase()
}

export function MemberLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="min-h-dvh bg-[#fbf9f8]">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-[#c5c8b8]/30 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between px-6 lg:px-10">
          <div className="flex items-center gap-8">
            <Link href="/Home" className="text-2xl font-bold text-[#3e5219]">
              Munity
            </Link>
            <nav className="hidden items-center gap-6 md:flex">
              {topNav.map((item) => {
                const active = isActive(pathname, item.href)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'pb-0.5 text-sm font-semibold tracking-wide transition-colors',
                      active
                        ? 'border-b-2 border-[#3e5219] text-[#3e5219]'
                        : 'text-[#45483c] hover:text-[#3e5219]',
                    )}
                  >
                    {item.label}
                  </Link>
                )
              })}
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <button
              type="button"
              aria-label="Notifications"
              className="text-[#45483c] hover:text-[#3e5219]"
            >
              <Bell className="size-5" />
            </button>
            <Link href="/profile" aria-label="Your profile">
              <Image
                src={profile}
                alt="Profile"
                className="size-8 rounded-full object-cover"
              />
            </Link>
          </div>
        </div>
      </header>

      <aside className="fixed bottom-0 left-0 top-16 z-40 hidden w-64 flex-col bg-[#f5f3f3] px-4 pb-4 pt-6 lg:flex">
        <p className="mb-2 px-4 text-xs font-medium uppercase tracking-[1.2px] text-[#45483c]/60">
          Navigation
        </p>
        <nav className="flex flex-col gap-1">
          {sideNav.map((item) => {
            const active = isActive(pathname, item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold tracking-wide transition-colors',
                  active
                    ? 'bg-[#d6e7a1] text-[#5a682f]'
                    : 'text-[#45483c] hover:bg-white/60',
                )}
              >
                <item.icon className="size-[18px] shrink-0" />
                {item.label}
              </Link>
            )
          })}
        </nav>
        <div className="mt-auto px-2 pt-6">
          <Link
            href="/emergency"
            className="flex items-center justify-center gap-2 rounded-xl bg-[#ffdad6] px-4 py-3 text-base text-[#93000a] transition-opacity hover:opacity-90"
          >
            <LifeBuoy className="size-4 shrink-0" />
            Emergency Support
          </Link>
        </div>
      </aside>

      <div className="pt-16 lg:pl-64">{children}</div>
    </div>
  )
}

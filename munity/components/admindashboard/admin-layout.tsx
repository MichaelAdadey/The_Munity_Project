'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Bell,
  BookOpen,
  LayoutDashboard,
  LifeBuoy,
  Search,
  Settings,
  Shield,
  Stethoscope,
  TrendingUp,
  Users,
} from 'lucide-react'
import profile from '@/public/images/profile.jpg'
import { cn } from '@/lib/utils'

const sideNav = [
  { href: '/admindashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/Communities', label: 'Communities', icon: Users },
  { href: '/admindashboard/growth', label: 'Platform Growth', icon: TrendingUp },
  { href: '/admindashboard/therapy', label: 'Therapy', icon: Stethoscope },
  { href: '/Resources', label: 'Resources', icon: BookOpen },
  { href: '/admindashboard/moderation', label: 'Moderation', icon: Shield },
  { href: '/admindashboard/settings', label: 'Settings', icon: Settings },
]

function isActive(pathname: string, href: string) {
  if (href === '/admindashboard') return pathname === '/admindashboard'
  if (href === '/Communities') return pathname.toLowerCase() === '/communities'
  if (href === '/Resources') return pathname.toLowerCase() === '/resources'
  return pathname.startsWith(href)
}

export function AdminLayout({
  children,
  title = 'Admin Dashboard',
  searchPlaceholder = 'Search analytics...',
}: {
  children: React.ReactNode
  title?: string
  searchPlaceholder?: string
}) {
  const pathname = usePathname()

  return (
    <div className="min-h-dvh bg-[#fbf9f8]">
      <aside className="fixed bottom-0 left-0 top-0 z-40 hidden w-64 flex-col border-r border-[#c5c8b8]/30 bg-[#f5f3f3] px-4 pb-4 lg:flex">
        <div className="px-4 pb-6 pt-6">
          <p className="text-2xl font-bold text-[#3e5219]">Munity</p>
          <p className="text-base text-[#45483c]/70">Nurtured Stability</p>
        </div>

        <nav className="flex flex-1 flex-col gap-1">
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

        <div className="px-2 pt-4">
          <Link
            href="/emergency"
            className="flex items-center justify-center gap-2 rounded-xl bg-[#ffdad6] px-4 py-3 text-base text-[#93000a] transition-opacity hover:opacity-90"
          >
            <LifeBuoy className="size-4 shrink-0" />
            Emergency Support
          </Link>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 border-b border-[#c5c8b8]/30 bg-[#fbf9f8]/95 px-6 py-5 backdrop-blur lg:px-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-2xl font-bold text-[#3e5219]">{title}</h1>
            <div className="flex items-center gap-6">
              <div className="relative hidden sm:block">
                <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[#6b7280]" />
                <input
                  type="search"
                  placeholder={searchPlaceholder}
                  className="w-64 rounded-full border border-[#c5c8b8]/30 bg-[#efeded] py-2.5 pl-11 pr-4 text-sm font-semibold text-[#1b1c1c] outline-none placeholder:text-[#6b7280] focus:border-[#3e5219]"
                />
              </div>
              <button
                type="button"
                aria-label="Notifications"
                className="relative text-[#45483c] hover:text-[#3e5219]"
              >
                <Bell className="size-5" />
                <span className="absolute -right-1 -top-1 size-2 rounded-full bg-[#ba1a1a]" />
              </button>
              <Link href="/profile" aria-label="Admin profile">
                <Image
                  src={profile}
                  alt="Profile"
                  className="size-9 rounded-full object-cover"
                />
              </Link>
            </div>
          </div>
        </header>

        <main>{children}</main>
      </div>
    </div>
  )
}

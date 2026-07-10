'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Bell } from 'lucide-react'
import profile from '@/public/images/profile.jpg'
import { cn } from '@/lib/utils'

const topNav = [
  { href: '/Home', label: 'Home' },
  { href: '/Communities', label: 'Communities' },
  { href: '/Therapy', label: 'Therapy' },
]

function isActive(pathname: string, href: string) {
  return pathname.toLowerCase() === href.toLowerCase()
}

export function HomeLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="min-h-dvh bg-[#fbf9f8]">
      <header className="sticky top-0 z-50 border-b border-[#c5c8b8]/30 bg-white/95 backdrop-blur">
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

      <main>{children}</main>
    </div>
  )
}

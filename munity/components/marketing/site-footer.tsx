import Link from 'next/link'
import { Logo } from '@/components/logo'

const columns = [
  {
    title: 'Platform',
    links: ['Home', 'Communities', 'Resources', 'Therapy'],
  },
  {
    title: 'Support',
    links: ['Emergency Support', 'Help Center', 'Community Guidelines', 'Safety Tools'],
  },
  {
    title: 'Legal',
    links: ['Privacy Policy', 'Terms of Service', 'Cookie Policy'],
  },
]

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-card">
      {/* crisis banner */}
      <div className="bg-destructive/10 py-2 text-center text-sm text-destructive">
        Immediate crisis? Text HOME to 741741 or call 988 anytime.
      </div>
      <div className="mx-auto max-w-6xl px-4 py-12 lg:px-6">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div className="max-w-xs">
            <Logo />
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Nurturing stability through peer support, professional care, and
              community-driven healing. Your journey to wellbeing starts here.
            </p>
          </div>
          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="text-sm font-semibold text-foreground">{col.title}</h3>
              <ul className="mt-4 space-y-3">
                {col.links.map((link) => (
                  <li key={link}>
                    <Link
                      href="#"
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 border-t border-border pt-6 text-xs text-muted-foreground">
          © 2024 Munity Peer Support. For emergencies, contact local crisis services
          immediately. Munity is not a replacement for emergency medical care.
        </div>
      </div>
    </footer>
  )
}

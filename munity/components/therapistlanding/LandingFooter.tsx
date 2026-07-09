import Link from "next/link";
import { AlertCircle } from "lucide-react";
import { routes } from "@/lib/routes";

const platformLinks = [
  { label: "Home", href: routes.home },
  { label: "Communities", href: routes.signup },
  { label: "Resources", href: routes.home },
  { label: "Therapy", href: routes.login },
];
const supportLinks = [
  { label: "Emergency Support", href: "#", highlight: true },
  { label: "Help Center", href: "#" },
  { label: "Community Guidelines", href: "#" },
  { label: "Safety Tools", href: "#" },
];
const legalLinks = ["Privacy Policy", "Terms of Service", "Cookie Policy"];

export function LandingFooter() {
  return (
    <footer className="bg-munity-divider">
      <div className="bg-[#ffdad6] px-4 py-3">
        <p className="flex items-center justify-center gap-2 text-center text-sm font-semibold tracking-wide text-[#93000a]">
          <AlertCircle className="size-4 shrink-0" />
          Immediate crisis? Text <strong className="font-extrabold">HOME</strong> to{" "}
          <strong className="font-extrabold">741741</strong> or call{" "}
          <strong className="font-extrabold">988</strong> anytime.
        </p>
      </div>

      <div className="mx-auto grid max-w-7xl gap-12 px-10 py-16 md:grid-cols-[1.2fr_2fr]">
        <div>
          <Link href={routes.home} className="text-2xl font-bold text-munity-green">
            Munity
          </Link>
          <p className="mt-4 max-w-xs text-xs font-medium leading-relaxed text-munity-muted">
            Nurturing stability through peer-driven support and professional clinical care. Your
            journey to wellness is our mission.
          </p>
          <div className="mt-6 flex gap-4">
            <a
              href="#"
              aria-label="LinkedIn"
              className="flex size-10 items-center justify-center rounded-full bg-[#efeded] text-munity-muted transition hover:text-munity-green"
            >
              <svg viewBox="0 0 24 24" className="size-5 fill-current" aria-hidden>
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 114.126 0 2.063 2.063 0 01-2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </a>
            <a
              href="#"
              aria-label="Twitter"
              className="flex size-10 items-center justify-center rounded-full bg-[#efeded] text-munity-muted transition hover:text-munity-green"
            >
              <svg viewBox="0 0 24 24" className="size-5 fill-current" aria-hidden>
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
          </div>
        </div>

        <div className="grid gap-8 sm:grid-cols-3">
          <FooterColumn title="Platform" links={platformLinks} />
          <FooterColumn title="Support" links={supportLinks} />
          <FooterColumn title="Legal" links={legalLinks.map((l) => ({ label: l, href: "#" }))} />
        </div>
      </div>

      <div className="border-t border-munity-input-border/30 px-10 py-8 text-center">
        <p className="text-xs font-medium text-munity-muted opacity-70">
          © 2024 Munity Peer Support. For emergencies, contact local crisis services immediately.
        </p>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string; highlight?: boolean }[];
}) {
  return (
    <div>
      <p className="text-sm font-bold tracking-wide text-munity-text">{title}</p>
      <ul className="mt-4 space-y-4">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className={`text-xs font-medium ${
                link.highlight
                  ? "text-munity-green underline decoration-from-font underline-offset-2"
                  : "text-munity-muted hover:text-munity-green"
              }`}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

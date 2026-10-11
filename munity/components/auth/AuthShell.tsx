import Link from "next/link";

interface AuthShellProps {
  children: React.ReactNode;
  footer: React.ReactNode;
}

export function AuthShell({ children, footer }: AuthShellProps) {
  return (
    <div className="relative flex min-h-screen flex-col bg-munity-bg">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div
          className="absolute -right-32 -top-25.5 h-153.5 w-3xl rounded-full opacity-50"
          style={{
            background:
              "radial-gradient(circle, rgba(182,208,136,0.15) 0%, rgba(182,208,136,0) 70%)",
          }}
        />
        <div
          className="absolute -bottom-25.5 -left-32 h-128 w-160 rounded-full opacity-30"
          style={{
            background:
              "radial-gradient(circle, rgba(182,208,136,0.15) 0%, rgba(182,208,136,0) 70%)",
          }}
        />
      </div>

      <main className="relative flex flex-1 flex-col items-center justify-center px-10 py-23">
        {children}
        <div className="mt-8 w-full max-w-120 text-center">{footer}</div>
      </main>

      <footer className="relative border-t border-munity-input-border/20 px-10 pb-8 pt-8.25">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs font-medium text-munity-muted">
            © 2024 Munity Peer Support. For emergencies, contact local crisis
            services immediately.
          </p>
          <div className="flex flex-wrap gap-6 text-xs font-medium text-munity-muted">
            <Link href="#" className="hover:text-munity-green">
              Emergency Support
            </Link>
            <Link href="#" className="hover:text-munity-green">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-munity-green">
              Help Center
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

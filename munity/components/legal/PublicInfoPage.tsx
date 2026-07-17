import Link from "next/link";
import { routes } from "@/lib/routes";

export function PublicInfoPage({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-munity-bg px-6 py-16 text-munity-text">
      <article className="mx-auto max-w-3xl rounded-3xl border border-munity-border bg-white p-8 shadow-[0_4px_20px_rgba(85,107,47,0.05)] sm:p-12">
        <Link href={routes.home} className="text-2xl font-bold text-munity-green">
          Munity
        </Link>
        <p className="mt-1 text-sm text-munity-muted">Nurtured stability, together.</p>
        <h1 className="mt-10 text-4xl font-bold text-munity-green">{title}</h1>
        <div className="mt-6 space-y-4 leading-7 text-munity-muted">{children}</div>
        <div className="mt-10 flex flex-wrap gap-4 text-sm font-semibold">
          <Link href={routes.home} className="text-munity-green hover:underline">Return home</Link>
          <Link href={routes.emergency} className="text-[#93000a] hover:underline">Emergency support</Link>
        </div>
      </article>
    </main>
  );
}

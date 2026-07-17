import { cn } from '@/lib/utils'

export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex size-8 items-center justify-center rounded-xl bg-primary text-primary-foreground',
        className,
      )}
      aria-hidden="true"
    >
      <svg viewBox="0 0 24 24" fill="none" className="size-5">
        <path
          d="M12 21c0-5 0-8 3-11M12 21c0-5 0-8-3-11"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <path
          d="M15 10c2.2-.2 3.8-1.8 4-4-2.2.2-3.8 1.8-4 4ZM9 10C6.8 9.8 5.2 8.2 5 6c2.2.2 3.8 1.8 4 4Z"
          fill="currentColor"
        />
        <path
          d="M12 14c.6-2 2.2-3.4 4-3.6-.2 2-1.8 3.4-4 3.6ZM12 14c-.6-2-2.2-3.4-4-3.6.2 2 1.8 3.4 4 3.6Z"
          fill="currentColor"
        />
      </svg>
    </span>
  )
}

export function Logo({
  className,
  showName = true,
}: {
  className?: string
  showName?: boolean
}) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <LogoMark />
      {showName && (
        <span className="font-heading text-xl font-semibold tracking-tight text-foreground">
          Munity
        </span>
      )}
    </div>
  )
}

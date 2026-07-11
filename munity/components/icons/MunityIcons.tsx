import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & {
  title?: string;
};

/** Soft olive leaf — primary wellness mark (replaces AI sparkles). */
export function MunityLeafIcon({ title, className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden={title ? undefined : true}
      role={title ? "img" : undefined}
      {...props}
    >
      {title ? <title>{title}</title> : null}
      <path
        d="M12 21c0-6.5 3.2-11.8 8-14-1.2 5.2-4.4 9.2-8 14Z"
        fill="currentColor"
        opacity="0.35"
      />
      <path
        d="M12 21C12 14.5 8.8 9.2 4 7c1.2 5.2 4.4 9.2 8 14Z"
        fill="currentColor"
        opacity="0.55"
      />
      <path
        d="M12 21V8.5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <path
        d="M12 12.5c2.2-1.4 4.1-2.2 6.2-2.8M12 16c-2.1-1.1-3.9-1.8-5.8-2.2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.85"
      />
    </svg>
  );
}

/** Rising path — for trends / progress (no sparkle motif). */
export function MunityRiseIcon({ title, className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden={title ? undefined : true}
      role={title ? "img" : undefined}
      {...props}
    >
      {title ? <title>{title}</title> : null}
      <path
        d="M4 17.5 9.2 12l3.3 3.2L20 7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.5 7H20v5.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Interlocking rings — neurodiversity / connection. */
export function MunityRingsIcon({ title, className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden={title ? undefined : true}
      role={title ? "img" : undefined}
      {...props}
    >
      {title ? <title>{title}</title> : null}
      <circle cx="9" cy="12" r="5" stroke="currentColor" strokeWidth="1.75" />
      <circle cx="15" cy="12" r="5" stroke="currentColor" strokeWidth="1.75" />
    </svg>
  );
}

/** Calm sun — mindful / wellness moments. */
export function MunitySunIcon({ title, className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden={title ? undefined : true}
      role={title ? "img" : undefined}
      {...props}
    >
      {title ? <title>{title}</title> : null}
      <circle cx="12" cy="12" r="4.25" fill="currentColor" opacity="0.35" />
      <circle cx="12" cy="12" r="3.25" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M12 3.5v2.2M12 18.3v2.2M3.5 12h2.2M18.3 12h2.2M6.1 6.1l1.6 1.6M16.3 16.3l1.6 1.6M17.9 6.1l-1.6 1.6M7.7 16.3l-1.6 1.6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

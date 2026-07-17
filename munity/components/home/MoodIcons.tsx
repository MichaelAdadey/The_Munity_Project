import type { ReactNode, SVGProps } from "react";

type MoodIconProps = SVGProps<SVGSVGElement> & {
  active?: boolean;
};

function MoodFace({
  children,
  className,
  ...props
}: SVGProps<SVGSVGElement> & { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      className={className}
      {...props}
    >
      {children}
    </svg>
  );
}

/** Soft smile — warm olive */
export function MoodHappyIcon({ className, ...props }: MoodIconProps) {
  return (
    <MoodFace className={className} {...props}>
      <circle cx="20" cy="20" r="18" fill="#E8F0C8" />
      <circle cx="20" cy="20" r="18" stroke="#5A682F" strokeWidth="1.5" opacity="0.25" />
      <circle cx="13.5" cy="16.5" r="2" fill="#3E5219" />
      <circle cx="26.5" cy="16.5" r="2" fill="#3E5219" />
      <path
        d="M13 24c1.8 3.2 4.2 4.8 7 4.8s5.2-1.6 7-4.8"
        stroke="#3E5219"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </MoodFace>
  );
}

/** Soft closed eyes — mint calm */
export function MoodCalmIcon({ className, ...props }: MoodIconProps) {
  return (
    <MoodFace className={className} {...props}>
      <circle cx="20" cy="20" r="18" fill="#D6E7A1" />
      <circle cx="20" cy="20" r="18" stroke="#3E5219" strokeWidth="1.5" opacity="0.2" />
      <path d="M11 17c1.2-1.6 2.8-2.4 4.5-2.4" stroke="#3E5219" strokeWidth="2" strokeLinecap="round" />
      <path d="M24.5 14.6c1.7 0 3.3.8 4.5 2.4" stroke="#3E5219" strokeWidth="2" strokeLinecap="round" />
      <path
        d="M14 24.5c1.5 2.2 3.5 3.3 6 3.3s4.5-1.1 6-3.3"
        stroke="#3E5219"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </MoodFace>
  );
}

/** Tense brow — warm sand */
export function MoodStressedIcon({ className, ...props }: MoodIconProps) {
  return (
    <MoodFace className={className} {...props}>
      <circle cx="20" cy="20" r="18" fill="#F3E6D4" />
      <circle cx="20" cy="20" r="18" stroke="#8A5A2B" strokeWidth="1.5" opacity="0.25" />
      <path d="M11 14.5c2 .8 3.5.8 5.5 0" stroke="#6B4423" strokeWidth="2" strokeLinecap="round" />
      <path d="M23.5 14.5c2 .8 3.5.8 5.5 0" stroke="#6B4423" strokeWidth="2" strokeLinecap="round" />
      <circle cx="13.5" cy="18.5" r="2" fill="#6B4423" />
      <circle cx="26.5" cy="18.5" r="2" fill="#6B4423" />
      <path d="M15 27.5c1.6-1.8 3.4-2.6 5-2.6s3.4.8 5 2.6" stroke="#6B4423" strokeWidth="2" strokeLinecap="round" />
    </MoodFace>
  );
}

/** Downturned mouth — soft blue-gray */
export function MoodSadIcon({ className, ...props }: MoodIconProps) {
  return (
    <MoodFace className={className} {...props}>
      <circle cx="20" cy="20" r="18" fill="#DCE6F0" />
      <circle cx="20" cy="20" r="18" stroke="#4A5F78" strokeWidth="1.5" opacity="0.25" />
      <circle cx="13.5" cy="17" r="2" fill="#3D5168" />
      <circle cx="26.5" cy="17" r="2" fill="#3D5168" />
      <path
        d="M14.5 28c1.5-2.4 3.4-3.5 5.5-3.5s4 1.1 5.5 3.5"
        stroke="#3D5168"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path d="M11.5 22.5c0 1.8-.4 3.2-1 4" stroke="#7BA3C9" strokeWidth="1.75" strokeLinecap="round" />
    </MoodFace>
  );
}

/** Wide eyes + tense mouth — soft lilac */
export function MoodAnxiousIcon({ className, ...props }: MoodIconProps) {
  return (
    <MoodFace className={className} {...props}>
      <circle cx="20" cy="20" r="18" fill="#E8DFF0" />
      <circle cx="20" cy="20" r="18" stroke="#6B4F7A" strokeWidth="1.5" opacity="0.25" />
      <circle cx="13.5" cy="17" r="2.6" fill="#5A3F68" />
      <circle cx="26.5" cy="17" r="2.6" fill="#5A3F68" />
      <circle cx="14.2" cy="16.2" r="0.9" fill="#F5F0F8" />
      <circle cx="27.2" cy="16.2" r="0.9" fill="#F5F0F8" />
      <path d="M16 27.5h8" stroke="#5A3F68" strokeWidth="2.25" strokeLinecap="round" />
      <path d="M12 13.5c1.2-1 2.4-1.4 3.6-1.2" stroke="#5A3F68" strokeWidth="1.75" strokeLinecap="round" />
      <path d="M24.4 12.3c1.2-.2 2.4.2 3.6 1.2" stroke="#5A3F68" strokeWidth="1.75" strokeLinecap="round" />
    </MoodFace>
  );
}

export const moodIcons = {
  Happy: MoodHappyIcon,
  Calm: MoodCalmIcon,
  Stressed: MoodStressedIcon,
  Sad: MoodSadIcon,
  Anxious: MoodAnxiousIcon,
} as const;

export type MoodLabel = keyof typeof moodIcons;

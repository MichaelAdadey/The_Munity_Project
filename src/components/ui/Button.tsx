"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import Link from "next/link";
import { Loader3D } from "@/components/ui/Loader3D";

type ButtonVariant = "primary" | "secondary" | "ghost" | "outline" | "lime";

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-munity-green text-white shadow-[0_4px_0_#2a3810] hover:bg-munity-green-dark",
  secondary: "bg-munity-sidebar text-munity-text border border-munity-input-border shadow-[0_3px_0_#d8d6d4]",
  ghost: "bg-transparent text-munity-green shadow-none",
  outline: "border border-munity-gray bg-white text-munity-green shadow-[0_3px_0_#e5e5e1]",
  lime: "bg-munity-lime text-munity-olive-text shadow-[0_4px_0_#b6c878]",
};

interface ButtonBaseProps {
  variant?: ButtonVariant;
  loading?: boolean;
  loadingLabel?: string;
  className?: string;
  children: React.ReactNode;
}

type ButtonAsButton = ButtonBaseProps &
  Omit<HTMLMotionProps<"button">, "children"> & {
    href?: undefined;
  };

type ButtonAsLink = ButtonBaseProps &
  Omit<HTMLMotionProps<"a">, "children"> & {
    href: string;
  };

export type ButtonProps = ButtonAsButton | ButtonAsLink;

export function Button({
  variant = "primary",
  loading = false,
  loadingLabel,
  className = "",
  children,
  href,
  disabled,
  ...props
}: ButtonProps) {
  const isDisabled = Boolean(disabled || loading);
  const classes = `inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${variantClasses[variant]} ${className}`;

  const motionProps = {
    whileHover: isDisabled ? undefined : { y: -2, scale: 1.01 },
    whileTap: isDisabled ? undefined : { y: 2, scale: 0.98 },
    transition: { type: "spring" as const, stiffness: 420, damping: 22 },
  };

  const content = loading ? (
    <>
      <Loader3D size={28} />
      <span>{loadingLabel ?? "Please wait..."}</span>
    </>
  ) : (
    children
  );

  if (href) {
    return (
      <motion.span {...motionProps} className="inline-flex">
        <Link href={href} className={classes} aria-disabled={isDisabled}>
          {content}
        </Link>
      </motion.span>
    );
  }

  return (
    <motion.button
      type={(props as HTMLMotionProps<"button">).type ?? "button"}
      className={classes}
      disabled={isDisabled}
      {...motionProps}
      {...(props as HTMLMotionProps<"button">)}
    >
      {content}
    </motion.button>
  );
}

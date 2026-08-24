"use client";

import { Children, cloneElement, isValidElement } from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import Link from "next/link";
import { Loader3D } from "@/components/ui/Loader3D";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost" | "outline" | "lime" | "default";

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-munity-green text-white shadow-[0_4px_0_#2a3810] hover:bg-munity-green-dark",
  // Legacy alias: shadcn-style consumers pass variant="default".
  default: "bg-munity-green text-white shadow-[0_4px_0_#2a3810] hover:bg-munity-green-dark",
  secondary: "bg-munity-sidebar text-munity-text border border-munity-input-border shadow-[0_3px_0_#d8d6d4]",
  ghost: "bg-transparent text-munity-green shadow-none",
  outline: "border border-munity-gray bg-white text-munity-green shadow-[0_3px_0_#e5e5e1]",
  lime: "bg-munity-lime text-munity-olive-text shadow-[0_4px_0_#b6c878]",
};

type ButtonSize = "default" | "sm" | "lg" | "xs" | "icon" | "icon-sm" | "icon-lg";

const sizeClasses: Record<ButtonSize, string> = {
  default: "px-6 py-3 text-sm",
  sm: "px-3.5 py-2 text-sm",
  lg: "px-8 py-4 text-base",
  xs: "px-2.5 py-1.5 text-xs",
  icon: "size-8 p-0",
  "icon-sm": "size-7 p-0",
  "icon-lg": "size-9 p-0",
};

interface ButtonBaseProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  loadingLabel?: string;
  className?: string;
  /** Render a child element (e.g. a Next Link) with the button styles. */
  asChild?: boolean;
  children?: React.ReactNode;
}

type ButtonAsButton = ButtonBaseProps &
  Omit<HTMLMotionProps<"button">, "children" | "size"> & {
    href?: undefined;
    disabled?: boolean;
  };

type ButtonAsLink = ButtonBaseProps &
  Omit<HTMLMotionProps<"a">, "children" | "size"> & {
    href: string;
    disabled?: boolean;
  };

export type ButtonProps = ButtonAsButton | ButtonAsLink;

export function Button({
  variant = "primary",
  size = "default",
  loading = false,
  loadingLabel,
  className = "",
  children,
  href,
  disabled,
  asChild,
  ...props
}: ButtonProps) {
  const isDisabled = Boolean(disabled || loading);
  const classes = `inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${sizeClasses[size]} ${variantClasses[variant]} ${className}`;

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

  if (asChild) {
    const child = Children.only(children);
    if (isValidElement(child)) {
      const childEl = child as React.ReactElement<{
        className?: string;
        "aria-disabled"?: boolean;
        tabIndex?: number;
      }>;
      return (
        <motion.span {...motionProps} className="inline-flex">
          {cloneElement(childEl, {
            className: cn(childEl.props.className, classes),
            ...(isDisabled ? { "aria-disabled": true, tabIndex: -1 } : {}),
          })}
        </motion.span>
      );
    }
    return children;
  }

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

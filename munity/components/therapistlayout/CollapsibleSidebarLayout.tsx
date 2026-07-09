"use client";

import { type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, PanelLeft } from "lucide-react";
import { useSidebar } from "@/components/therapistlayout/SidebarContext";

interface CollapsibleSidebarLayoutProps {
  sidebar: ReactNode;
  children: ReactNode;
  className?: string;
  mainClassName?: string;
}

export function CollapsibleSidebarLayout({
  sidebar,
  children,
  className = "",
  mainClassName = "",
}: CollapsibleSidebarLayoutProps) {
  const sidebarState = useSidebar();

  if (!sidebarState) {
    throw new Error("CollapsibleSidebarLayout must be used within SidebarProvider");
  }

  const { open, toggle, expandedWidth, collapsedWidth } = sidebarState;
  const width = open ? expandedWidth : collapsedWidth;

  return (
    <div className={`flex w-full ${className}`}>
      <motion.aside
        animate={{ width }}
        initial={false}
        transition={{ type: "spring", stiffness: 420, damping: 38, mass: 0.8 }}
        className="relative shrink-0 overflow-hidden border-r border-munity-input-border/30 bg-munity-sidebar"
      >
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.div
              key="expanded"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.12 }}
              style={{ width: expandedWidth }}
              className="h-full"
            >
              {sidebar}
            </motion.div>
          ) : (
            <motion.div
              key="collapsed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.12 }}
              style={{ width: collapsedWidth }}
              className="flex h-full items-start justify-center pt-6"
            >
              <button
                type="button"
                onClick={toggle}
                aria-label="Expand sidebar"
                aria-expanded={false}
                className="rounded-lg p-2 text-munity-muted transition-colors hover:bg-white/60 hover:text-munity-green"
              >
                <PanelLeft className="size-5" strokeWidth={2} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {open ? (
          <button
            type="button"
            onClick={toggle}
            aria-label="Collapse sidebar"
            aria-expanded={true}
            className="absolute right-0 top-6 z-10 flex size-6 translate-x-1/2 items-center justify-center rounded-full border border-munity-border/50 bg-munity-bg text-munity-muted shadow-[0_1px_4px_rgba(62,82,25,0.08)] transition-colors hover:text-munity-green"
          >
            <ChevronLeft className="size-3.5" strokeWidth={2.5} />
          </button>
        ) : null}
      </motion.aside>

      <div className={`min-w-0 flex-1 ${mainClassName}`}>{children}</div>
    </div>
  );
}

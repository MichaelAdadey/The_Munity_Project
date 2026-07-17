"use client";

import { type ReactNode } from "react";
import { TherapistSidebar, type TherapistNavItem } from "@/components/therapistlayout/Sidebars";
import { CollapsibleSidebarLayout } from "@/components/therapistlayout/CollapsibleSidebarLayout";
import { SidebarProvider } from "@/components/therapistlayout/SidebarContext";
import { ProfileAvatarMenu } from "@/components/therapistlayout/ProfileAvatarMenu";
import { AnimatedPage } from "@/components/ui/AnimatedPage";
import { LiveToastProvider } from "@/components/live/LiveFeedback";
import { NotificationsMenu } from "@/components/live/NotificationsMenu";

const THERAPIST_DISPLAY_NAME = "Dr. Elena Aris";

interface TherapistAppShellProps {
  active: TherapistNavItem;
  title: string;
  subtitle?: string;
  /** Optional controls shown before notifications (e.g. search). */
  actions?: ReactNode;
  children: ReactNode;
}

export function TherapistAppShell({
  active,
  title,
  subtitle,
  actions,
  children,
}: TherapistAppShellProps) {
  return (
    <LiveToastProvider>
    <SidebarProvider storageKey="munity-therapist-sidebar-open" expandedWidth={256}>
      <div className="min-h-screen bg-munity-bg">
        <CollapsibleSidebarLayout
          sidebar={<TherapistSidebar active={active} />}
          mainClassName="px-6 py-8 lg:px-10 lg:py-10"
        >
          <AnimatedPage className="mx-auto flex w-full max-w-6xl flex-col gap-8">
            <header className="flex flex-wrap items-center justify-between gap-4">
              <div className="min-w-0">
                <h1 className="text-[32px] font-bold leading-tight text-munity-text">{title}</h1>
                {subtitle ? (
                  <p className="mt-1 text-base leading-relaxed text-munity-muted">{subtitle}</p>
                ) : null}
              </div>
              <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                {actions}
                <NotificationsMenu role="therapist" />
                <div className="flex items-center gap-3 rounded-full bg-[#efeded] py-1 pl-1 pr-4">
                  <ProfileAvatarMenu />
                  <span className="text-sm font-semibold tracking-wide text-munity-text">
                    {THERAPIST_DISPLAY_NAME}
                  </span>
                </div>
              </div>
            </header>

            {children}
          </AnimatedPage>
        </CollapsibleSidebarLayout>
      </div>
    </SidebarProvider>
    </LiveToastProvider>
  );
}

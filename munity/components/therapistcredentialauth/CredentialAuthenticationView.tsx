"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Bell,
  BookOpen,
  Check,
  Clock3,
  FileCheck,
  LayoutGrid,
  Shield,
  Users,
} from "lucide-react";
import {
  CredentialVerificationFooter,
  CredentialVerificationSidebar,
} from "@/components/therapistcredentialauth/CredentialVerificationSidebar";
import { CollapsibleSidebarLayout } from "@/components/therapistlayout/CollapsibleSidebarLayout";
import { SidebarProvider } from "@/components/therapistlayout/SidebarContext";
import { AnimatedPage } from "@/components/ui/AnimatedPage";
import { Button } from "@/components/ui/AppButton";
import { routes } from "@/lib/routes";

const verificationChecklist = [
  { label: "Identity Verified", complete: true },
  { label: "License Credentials", complete: true },
  { label: "Background Check", complete: false },
  { label: "Clinical Interview", complete: false },
] as const;

const secondaryInfo = [
  {
    icon: Shield,
    title: "Secure Encryption",
    description: "Your documents are protected with HIPAA-compliant AES-256 encryption.",
  },
  {
    icon: Bell,
    title: "Instant Notifications",
    description: "We'll email and text you the moment your review is complete.",
  },
  {
    icon: Users,
    title: "Peer Community",
    description: "Join 500+ professionals dedicated to modern therapy.",
  },
] as const;

export function CredentialAuthenticationView() {
  return (
    <SidebarProvider storageKey="munity-credential-sidebar-open" expandedWidth={288}>
      <div className="flex min-h-screen flex-col bg-munity-bg">
        <header className="fixed inset-x-0 top-0 z-50 flex h-16 items-center border-b border-munity-input-border/20 bg-munity-bg/80 px-10 shadow-sm backdrop-blur-md">
          <Link href={routes.home} className="text-base font-bold text-munity-green">
            Munity
          </Link>
        </header>

        <div className="flex flex-1 flex-col pt-16">
          <CollapsibleSidebarLayout
            sidebar={<CredentialVerificationSidebar />}
            mainClassName="flex flex-1 flex-col items-center px-6 py-16 lg:px-24 lg:py-24"
          >
            <AnimatedPage className="flex w-full max-w-2xl flex-col gap-12">
              <motion.article
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative overflow-hidden rounded-[32px] border border-munity-border/50 bg-white/70 p-12 shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_8px_10px_-6px_rgba(0,0,0,0.1)] backdrop-blur-sm"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="relative mb-8 flex size-24 items-center justify-center rounded-full bg-[#d9eaa3]">
                    <FileCheck className="size-10 text-munity-green" strokeWidth={1.75} />
                    <span className="absolute inset-0 rounded-full border-4 border-munity-green/10" />
                  </div>

                  <h1 className="text-base text-munity-green">Documents Successfully Uploaded</h1>
                  <p className="mt-4 max-w-md text-base leading-relaxed text-munity-muted">
                    Thank you for sharing your professional credentials. We are now verifying your
                    information to ensure the highest standard of care for the Munity community.
                  </p>
                </div>

                <div className="mt-10 rounded-2xl border border-munity-input-border/30 bg-munity-sidebar p-6">
                  <div className="flex items-center gap-4">
                    <div className="flex size-9 items-center justify-center rounded-full bg-munity-lime">
                      <Clock3 className="size-5 text-munity-green" />
                    </div>
                    <div className="text-left">
                      <p className="text-base text-munity-text">Review in Progress</p>
                      <p className="text-xs font-medium text-munity-muted">
                        Estimated time: 24–48 business hours
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-munity-divider">
                    <div className="relative h-full w-[65%] rounded-full bg-munity-green">
                      <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-white/30 to-transparent" />
                    </div>
                  </div>

                  <p className="mt-4 text-left text-xs italic leading-relaxed text-munity-muted">
                    &ldquo;Munity is committed to safety and quality. Every profile is manually
                    reviewed by our Clinical Operations team to maintain nurtured stability for our
                    peers.&rdquo;
                  </p>
                </div>

                <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {verificationChecklist.map((item) => (
                    <div
                      key={item.label}
                      className={`flex items-center gap-3 rounded-xl border border-munity-input-border p-4 ${
                        item.complete
                          ? "bg-white/50"
                          : "bg-white/30 opacity-50"
                      }`}
                    >
                      {item.complete ? (
                        <Check className="size-5 shrink-0 text-munity-green" strokeWidth={2.5} />
                      ) : (
                        <Clock3 className="size-4 shrink-0 text-munity-muted" />
                      )}
                      <span className="text-base text-munity-muted">{item.label}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                  <Button className="h-14 rounded-xl px-8 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)]">
                    <BookOpen className="size-4" />
                    Explore Resources
                  </Button>
                  <Button
                    href={routes.therapistDashboard}
                    variant="lime"
                    className="h-14 rounded-xl px-8"
                  >
                    <LayoutGrid className="size-4" />
                    Go to Dashboard
                  </Button>
                </div>
              </motion.article>

              <section className="grid grid-cols-1 gap-8 sm:grid-cols-3">
                {secondaryInfo.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={item.title}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + index * 0.05 }}
                      className="flex flex-col items-center text-center"
                    >
                      <div className="mb-3 flex size-10 items-center justify-center rounded-full bg-white shadow-[0_1px_1px_rgba(0,0,0,0.05)]">
                        <Icon className="size-5 text-munity-green" />
                      </div>
                      <h2 className="text-base text-munity-text">{item.title}</h2>
                      <p className="mt-1 text-xs font-medium leading-relaxed text-munity-muted">
                        {item.description}
                      </p>
                    </motion.div>
                  );
                })}
              </section>
            </AnimatedPage>
          </CollapsibleSidebarLayout>

          <CredentialVerificationFooter />
        </div>
      </div>
    </SidebarProvider>
  );
}

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  CheckCircle2,
  Info,
  MapPin,
  Medal,
  MessageCircle,
  Phone,
  Search,
  Shield,
  Users,
  X,
} from "lucide-react";
import { LiveToastProvider, useLiveToast } from "@/components/live/LiveFeedback";

const crisisSteps = [
  {
    step: "1",
    title: "Ensure Safety",
    body: "Move to a safe place away from potential harm or triggers.",
  },
  {
    step: "2",
    title: "Reach Out",
    body: "Contact a hotline or a trusted person immediately. Don't wait.",
  },
  {
    step: "3",
    title: "Breathe",
    body: "Focus on slow, deep breaths while waiting for help to arrive.",
  },
];

const hotlines = [
  {
    id: "lifeline",
    title: "Suicide & Crisis Lifeline",
    description:
      "Confidential support for people in distress, prevention and crisis resources.",
    contact: "988",
    href: "tel:988",
    action: "Call Now",
    actionIcon: Phone,
    badge: "24/7 SUPPORT",
    icon: MapPin,
  },
  {
    id: "text",
    title: "Crisis Text Line",
    description: "Text with a trained Crisis Counselor for free, confidential support.",
    contact: "Text HOME to 741741",
    href: "sms:741741?body=HOME",
    action: "Text Now",
    actionIcon: MessageCircle,
    badge: "SMS SUPPORT",
    icon: MessageCircle,
    buttonTone: "olive" as const,
  },
  {
    id: "veterans",
    title: "Veterans Crisis Line",
    description:
      "Connect with the Veterans Crisis Line to reach caring, qualified responders.",
    contact: "988, Press 1",
    href: "tel:988",
    action: "Call Now",
    actionIcon: Phone,
    icon: Medal,
  },
  {
    id: "trevor",
    title: "The Trevor Project",
    description:
      "Crisis intervention and suicide prevention services to LGBTQ young people.",
    contact: "1-866-488-7386",
    href: "tel:18664887386",
    action: "Call Now",
    actionIcon: Phone,
    icon: Users,
  },
];

const internationalLines = [
  { country: "United Kingdom", number: "111 / 999", href: "tel:999" },
  { country: "Canada", number: "988", href: "tel:988" },
  { country: "Australia", number: "13 11 14", href: "tel:131114" },
  { country: "India", number: "9152987821", href: "tel:9152987821" },
  { country: "Ghana", number: "233 244 846 701", href: "tel:+233244846701" },
  { country: "South Africa", number: "0800 567 567", href: "tel:0800567567" },
];

export function EmergencySupportView() {
  return (
    <LiveToastProvider>
      <EmergencySupportContent />
    </LiveToastProvider>
  );
}

function EmergencySupportContent() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const { flash } = useLiveToast();

  const filteredLines = internationalLines.filter((line) =>
    line.country.toLowerCase().includes(query.trim().toLowerCase()),
  );

  function exitPage() {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
      return;
    }
    router.push("/");
  }

  return (
    <div className="flex min-h-screen flex-col bg-munity-bg">
      <header className="sticky top-0 z-50 border-b border-munity-border/40 bg-munity-bg/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-[896px] items-center justify-between px-6 lg:px-10">
          <Link href="/" className="inline-flex items-center gap-2 text-munity-green">
            <Shield className="size-5" />
            <span className="text-xl font-bold">Munity</span>
          </Link>
          <button
            type="button"
            onClick={exitPage}
            className="inline-flex items-center gap-2 text-sm font-semibold text-munity-muted transition hover:text-munity-text"
          >
            <X className="size-4" />
            Exit Page
          </button>
        </div>
      </header>

      <motion.main initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="mx-auto flex w-full max-w-[896px] flex-1 flex-col gap-10 px-6 pb-32 pt-16 lg:px-10">
        <section className="flex flex-col items-center gap-4 text-center">
          <h1 className="max-w-3xl text-4xl font-normal tracking-[-1.2px] text-munity-text md:text-5xl md:leading-tight">
            Immediate Support & Crisis Resources
          </h1>
          <p className="max-w-2xl text-base leading-relaxed text-munity-muted">
            You are not alone. Help is available right now. Please use the resources below to
            connect with professional support.
          </p>
        </section>

        <section className="rounded-[20px] border-2 border-[#b3261e] bg-white px-6 py-10 shadow-lg md:px-8">
          <div className="flex flex-col items-center gap-6 text-center">
            <div className="flex size-[72px] items-center justify-center rounded-full bg-[#ffdad6]">
              <AlertTriangle className="size-8 text-[#b3261e]" />
            </div>
            <div className="space-y-2">
              <h2 className="text-base text-munity-text">Immediate Danger?</h2>
              <p className="text-base text-munity-muted">
                If you or someone else is in immediate physical danger, call your local emergency
                services now.
              </p>
            </div>
            <a
              href="tel:911"
              className="inline-flex items-center justify-center gap-3 rounded-xl bg-[#b3261e] px-8 py-5 text-xl font-bold text-white transition hover:brightness-95"
            >
              <Phone className="size-[18px]" />
              Call Emergency Services (911)
            </a>
          </div>
        </section>

        <section
          id="breathe"
          className="rounded-[20px] border border-[#e5e7eb] bg-[#f5f3f3] p-8"
        >
          <div className="mb-6 flex items-center gap-2">
            <Info className="size-5 text-munity-green" />
            <h3 className="text-base text-munity-text">What to do in a crisis</h3>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {crisisSteps.map((item) => (
              <div key={item.step} className="flex flex-col gap-3">
                <span className="flex size-10 items-center justify-center rounded-full bg-munity-olive text-base font-bold text-munity-lime-light">
                  {item.step}
                </span>
                <p className="text-base font-semibold text-munity-text">{item.title}</p>
                <p className="text-base leading-relaxed text-munity-muted">{item.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="grid grid-cols-1 gap-6 pt-2 md:grid-cols-2">
          {hotlines.map((line) => {
            const Icon = line.icon;
            const ActionIcon = line.actionIcon;
            return (
              <article
                key={line.id}
                className="flex flex-col justify-between rounded-[20px] border border-munity-border bg-white p-6 shadow-[0px_4px_10px_rgba(85,107,47,0.05)]"
              >
                <div className="pb-6">
                  <div className="flex items-start justify-between gap-3">
                    <Icon className="size-6 text-munity-green" />
                    {line.badge ? (
                      <span className="rounded-full bg-munity-olive px-2 py-1 text-xs font-bold uppercase tracking-[0.6px] text-munity-lime-light">
                        {line.badge}
                      </span>
                    ) : null}
                  </div>
                  <h4 className="mt-4 text-xl text-munity-text">{line.title}</h4>
                  <p className="mt-2 text-base leading-relaxed text-munity-muted">
                    {line.description}
                  </p>
                </div>
                <div className="flex flex-col gap-3">
                  <p className="text-2xl font-bold text-munity-green">{line.contact}</p>
                  <button
                    type="button"
                    onClick={() => {
                      void navigator.clipboard?.writeText(line.contact);
                      flash("Crisis contact copied");
                    }}
                    className="self-start text-xs font-semibold text-munity-green hover:underline"
                  >
                    Copy contact
                  </button>
                  <a
                    href={line.href}
                    className={`inline-flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3 text-base font-semibold text-white transition hover:brightness-95 ${
                      line.buttonTone === "olive" ? "bg-munity-green-dark" : "bg-munity-green"
                    }`}
                  >
                    <ActionIcon className="size-3.5" />
                    {line.action}
                  </a>
                </div>
              </article>
            );
          })}
        </section>

        <section className="flex flex-col gap-6 rounded-[20px] px-2 py-8 md:px-8">
          <h3 className="text-base text-munity-text">International Crisis Lines</h3>
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 size-[18px] -translate-y-1/2 text-munity-gray" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for your country..."
              className="w-full rounded-xl border border-munity-gray bg-white py-[18px] pl-12 pr-4 text-base text-munity-text outline-none transition placeholder:text-[#6b7280] focus:border-munity-green focus:shadow-[0_0_0_3px_rgba(62,82,25,0.12)]"
            />
          </div>
          <div className="flex max-h-64 flex-col gap-2 overflow-auto pr-1">
            {filteredLines.map((line) => (
              <div
                key={line.country}
                className="flex items-center justify-between rounded-xl border border-[#e5e7eb] bg-white p-[17px]"
              >
                <p className="text-base font-bold text-munity-text">{line.country}</p>
                <div className="flex items-center gap-4">
                  <p className="font-mono text-base font-bold text-munity-green">{line.number}</p>
                  <a
                    href={line.href}
                    aria-label={`Call crisis line for ${line.country}`}
                    className="text-munity-green transition hover:text-munity-green-dark"
                  >
                    <Phone className="size-[18px]" />
                  </a>
                </div>
              </div>
            ))}
            {filteredLines.length === 0 ? (
              <p className="py-6 text-center text-sm text-munity-muted">
                No countries match your search.
              </p>
            ) : null}
          </div>
        </section>
      </motion.main>

      <div className="fixed inset-x-0 bottom-0 z-50 bg-munity-green px-6 py-4">
        <div className="mx-auto flex max-w-[896px] items-center justify-center gap-3 text-center text-white">
          <CheckCircle2 className="size-5 shrink-0" />
          <p className="text-sm font-medium md:text-base">
            You are taking a brave step by seeking support. Help is on the way.
          </p>
        </div>
      </div>
    </div>
  );
}

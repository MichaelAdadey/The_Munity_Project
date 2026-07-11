"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  BookOpen,
  ChevronRight,
  CheckCircle2,
  HelpCircle,
  LifeBuoy,
  MapPin,
  Medal,
  Menu,
  MessageCircle,
  Phone,
  Search,
  Shield,
  Stethoscope,
  Users,
  Wind,
  X,
} from "lucide-react";
import { LiveToastProvider, useLiveToast } from "@/components/live/LiveFeedback";
import { startCalmAmbient } from "@/lib/calm-ambient";
import { routes } from "@/lib/routes";

const sectionNav = [
  { id: "reach-help", label: "Reach help now", icon: Phone },
  { id: "safety", label: "Safety steps", icon: Shield },
  { id: "breathe", label: "Guided breathing", icon: Wind },
  { id: "nearby", label: "Nearby help", icon: MapPin },
  { id: "hotlines", label: "Crisis hotlines", icon: LifeBuoy },
  { id: "international", label: "International", icon: Search },
];

const moreSupportLinks = [
  { href: routes.help, label: "Help Center", icon: HelpCircle },
  { href: routes.resources, label: "Resource Hub", icon: BookOpen },
  { href: routes.therapy, label: "Find a therapist", icon: Stethoscope },
  { href: routes.communities, label: "Peer communities", icon: Users },
];

const safetySteps = [
  {
    step: "1",
    title: "Remove Immediate Dangers",
    body: "Distance yourself from anything that could be used to cause harm.",
  },
  {
    step: "2",
    title: "Change Your Environment",
    body: "Move to a different room, step outside, or find a well-lit space with others.",
  },
  {
    step: "3",
    title: "Ground Your Senses",
    body: "Focus on 5 things you see, 4 you can touch, 3 you hear, 2 you smell, and 1 you can taste.",
  },
];

const quickActions = [
  {
    id: "988",
    label: "Suicide & Crisis",
    action: "Call 988",
    href: "tel:988",
    icon: Phone,
    tone: "primary" as const,
  },
  {
    id: "911",
    label: "Local Emergency",
    action: "Call 911",
    href: "tel:911",
    icon: AlertTriangle,
    tone: "neutral" as const,
  },
  {
    id: "text",
    label: "Text Crisis Line",
    action: "Text HOME to 741741",
    href: "sms:741741?body=HOME",
    icon: MessageCircle,
    tone: "lime" as const,
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
  const [breathing, setBreathing] = useState(false);
  const [breathPhase, setBreathPhase] = useState("Inhale");
  const [breathCount, setBreathCount] = useState(4);
  const [activeSection, setActiveSection] = useState("reach-help");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const ambientRef = useRef<ReturnType<typeof startCalmAmbient>>(null);
  const { flash } = useLiveToast();

  const filteredLines = internationalLines.filter((line) =>
    line.country.toLowerCase().includes(query.trim().toLowerCase()),
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.location.hash === "#breathe") {
      document.getElementById("breathe")?.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  useEffect(() => {
    const ids = sectionNav.map((item) => item.id);
    const observers: IntersectionObserver[] = [];

    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry?.isIntersecting) setActiveSection(id);
        },
        { rootMargin: "-35% 0px -50% 0px", threshold: 0.1 },
      );
      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((observer) => observer.disconnect());
  }, []);

  useEffect(() => {
    if (!breathing) {
      ambientRef.current?.stop();
      ambientRef.current = null;
      return;
    }

    ambientRef.current = startCalmAmbient();
    const phases = ["Inhale", "Hold", "Exhale", "Hold"] as const;
    let phase = 0;
    let count = 4;
    setBreathPhase(phases[0]);
    setBreathCount(4);
    ambientRef.current?.setBreathGain(phases[0]);

    const timer = window.setInterval(() => {
      count -= 1;
      if (count <= 0) {
        phase = (phase + 1) % phases.length;
        count = 4;
        setBreathPhase(phases[phase]);
        ambientRef.current?.setBreathGain(phases[phase]);
      }
      setBreathCount(count);
    }, 1000);

    return () => {
      window.clearInterval(timer);
      ambientRef.current?.stop();
      ambientRef.current = null;
    };
  }, [breathing]);

  function exitPage() {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
      return;
    }
    router.push("/");
  }

  function jumpTo(id: string) {
    setActiveSection(id);
    setMobileMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const leftNav = (
    <>
      <p className="mb-3 px-3 text-[11px] font-bold uppercase tracking-[0.14em] text-munity-muted">
        On this page
      </p>
      <nav className="flex flex-col gap-1">
        {sectionNav.map(({ id, label, icon: Icon }) => {
          const active = activeSection === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => jumpTo(id)}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition ${
                active
                  ? "bg-munity-lime text-munity-olive-text"
                  : "text-munity-muted hover:bg-white/80 hover:text-munity-text"
              }`}
            >
              <Icon className="size-4 shrink-0" />
              {label}
            </button>
          );
        })}
      </nav>

      <div className="mt-8 border-t border-munity-border/50 pt-6">
        <p className="mb-3 px-3 text-[11px] font-bold uppercase tracking-[0.14em] text-munity-muted">
          Quick call
        </p>
        <div className="flex flex-col gap-2 px-1">
          <a
            href="tel:988"
            className="rounded-xl bg-munity-green px-3 py-2.5 text-sm font-semibold text-white transition hover:brightness-95"
          >
            Call 988
          </a>
          <a
            href="tel:911"
            className="rounded-xl border border-[#ba1a1a]/30 bg-[#ffdad6]/40 px-3 py-2.5 text-sm font-semibold text-[#93000a] transition hover:bg-[#ffdad6]/70"
          >
            Call 911
          </a>
          <a
            href="sms:741741?body=HOME"
            className="rounded-xl bg-[#d6e7a1] px-3 py-2.5 text-sm font-semibold text-munity-olive-text transition hover:brightness-95"
          >
            Text 741741
          </a>
        </div>
      </div>
    </>
  );

  const rightNav = (
    <>
      <p className="mb-3 px-3 text-[11px] font-bold uppercase tracking-[0.14em] text-munity-muted">
        More support
      </p>
      <nav className="flex flex-col gap-1">
        {moreSupportLinks.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-munity-muted transition hover:bg-white/80 hover:text-munity-text"
          >
            <Icon className="size-4 shrink-0" />
            {label}
          </Link>
        ))}
      </nav>

      <div className="mt-8 rounded-2xl border border-munity-border/60 bg-white p-4">
        <p className="text-sm font-semibold text-munity-text">If you are with someone</p>
        <p className="mt-2 text-xs leading-relaxed text-munity-muted">
          Stay with them, remove immediate dangers, and help them call a crisis line. You do not
          have to handle this alone.
        </p>
        <button
          type="button"
          onClick={() => jumpTo("breathe")}
          className="mt-4 w-full rounded-xl bg-[#1b1d0e] px-3 py-2.5 text-sm font-semibold text-[#e4e4cc] transition hover:brightness-110"
        >
          Start breathing
        </button>
      </div>
    </>
  );

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-munity-bg">
      <header className="z-50 shrink-0 border-b border-munity-border/40 bg-munity-bg/95 backdrop-blur-md">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="flex size-10 items-center justify-center rounded-full text-munity-green transition hover:bg-white lg:hidden"
              aria-label="Open support menu"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="size-5" />
            </button>
            <Link href="/" className="inline-flex items-center gap-2 text-munity-green">
              <Shield className="size-5" />
              <span className="text-xl font-bold">Munity Support</span>
            </Link>
          </div>
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

      {/* Mobile drawer */}
      {mobileMenuOpen ? (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/35"
            aria-label="Close menu backdrop"
            onClick={() => setMobileMenuOpen(false)}
          />
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            className="absolute inset-y-0 left-0 flex w-[280px] flex-col border-r border-munity-border bg-[#f5f3f3] px-3 py-5 shadow-2xl"
          >
            <div className="mb-6 flex items-center justify-between px-3">
              <p className="text-lg font-bold text-munity-green">Crisis menu</p>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="flex size-9 items-center justify-center rounded-full hover:bg-white"
                aria-label="Close menu"
              >
                <X className="size-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">{leftNav}</div>
            <div className="mt-6 border-t border-munity-border/50 pt-5">{rightNav}</div>
          </motion.aside>
        </div>
      ) : null}

      <div className="flex min-h-0 w-full flex-1">
        <aside className="hidden h-full w-60 shrink-0 flex-col overflow-y-auto border-r border-munity-border/50 bg-[#f5f3f3] px-3 py-6 lg:flex">
          <div className="mb-6 px-3">
            <p className="text-lg font-bold text-munity-green">Crisis menu</p>
            <p className="mt-0.5 text-xs text-munity-muted">Jump to what you need</p>
          </div>
          {leftNav}
        </aside>

        <motion.main
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="flex min-h-0 min-w-0 flex-1 flex-col gap-8 overflow-y-auto px-5 py-8 sm:px-8 lg:px-10"
        >
        <section className="overflow-hidden rounded-[24px] bg-gradient-to-r from-munity-green via-[#56642b] to-[#3e5219] p-7 text-left text-white shadow-[0_4px_20px_rgba(62,82,25,0.18)] md:p-9">
          <p className="text-lg font-medium md:text-2xl">You are not alone.</p>
          <p className="mt-2 max-w-3xl text-base leading-relaxed text-white/90 md:text-lg">
            Immediate support is available 24/7. Your safety is the priority. Use the contacts
            below to reach trained help right now.
          </p>
        </section>

        <section id="reach-help" className="scroll-mt-24 grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start">
          <div className="flex flex-col gap-3 lg:col-span-5">
            <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-munity-muted">
              Reach help now
            </h2>
            <div className="flex flex-col gap-3">
              {quickActions.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.id}
                    href={item.href}
                    className={`group flex items-center gap-4 rounded-[20px] p-5 text-left transition hover:brightness-[0.98] ${
                      item.tone === "primary"
                        ? "bg-munity-green text-white shadow-md"
                        : item.tone === "lime"
                          ? "bg-[#d6e7a1] text-munity-olive-text"
                          : "border border-[rgba(197,200,184,0.4)] bg-[#eae8e7] text-munity-text"
                    }`}
                  >
                    <span
                      className={`flex size-12 shrink-0 items-center justify-center rounded-2xl ${
                        item.tone === "primary"
                          ? "bg-white/15"
                          : item.tone === "lime"
                            ? "bg-white/50"
                            : "bg-white"
                      }`}
                    >
                      <Icon
                        className={`size-5 ${
                          item.tone === "primary"
                            ? "text-[#b6d088]"
                            : item.tone === "lime"
                              ? "text-[#56642b]"
                              : "text-[#ba1a1a]"
                        }`}
                      />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span
                        className={`block text-xs uppercase tracking-[0.08em] ${
                          item.tone === "primary"
                            ? "text-[#b6d088]"
                            : item.tone === "lime"
                              ? "text-[#56642b]"
                              : "text-munity-muted"
                        }`}
                      >
                        {item.label}
                      </span>
                      <span className="mt-0.5 block text-base font-bold">{item.action}</span>
                    </span>
                    <ChevronRight
                      className={`size-4 shrink-0 opacity-60 transition group-hover:translate-x-0.5 ${
                        item.tone === "primary" ? "text-white" : "text-munity-muted"
                      }`}
                    />
                  </a>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col gap-6 lg:col-span-7">
            <section
              id="safety"
              className="scroll-mt-24 rounded-[20px] border border-[#e4e2e2] bg-white px-6 py-7 text-left shadow-sm md:px-7"
            >
              <h3 className="text-base font-semibold text-munity-text">
                Immediate Steps for Safety
              </h3>
              <div className="mt-5 flex flex-col gap-3">
                {safetySteps.map((item) => (
                  <div
                    key={item.step}
                    className="flex gap-4 rounded-2xl border border-[#e4e2e2] bg-[#fbf9f8] p-4"
                  >
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-munity-green/10 text-base font-bold text-munity-green">
                      {item.step}
                    </span>
                    <div>
                      <p className="text-base font-semibold text-munity-text">{item.title}</p>
                      <p className="mt-1 text-sm leading-relaxed text-munity-muted">{item.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section
              id="breathe"
              className="relative scroll-mt-24 overflow-hidden rounded-[28px] bg-[#e4e4cc] p-7 text-left md:p-8"
            >
              <div className="pointer-events-none absolute -bottom-10 -right-8 size-36 rounded-full bg-munity-green/10" />
              <div className="pointer-events-none absolute -right-4 bottom-6 size-24 rounded-full bg-munity-lime/40" />
              <Wind className="size-7 text-munity-green" />
              <h3 className="mt-4 text-xl font-semibold text-[#1b1d0e]">Need a moment?</h3>
              <p className="mt-2 max-w-xl text-base leading-relaxed text-[#1b1d0e]/90">
                Follow a simple breathing exercise to lower your immediate heart rate.
              </p>

              {breathing ? (
                <div className="mt-6 flex flex-col items-start gap-4 rounded-2xl bg-white/50 px-5 py-6">
                  <div className="flex items-center gap-4">
                    <motion.div
                      animate={{
                        scale:
                          breathPhase === "Inhale"
                            ? 1.18
                            : breathPhase === "Exhale"
                              ? 0.88
                              : 1,
                      }}
                      transition={{ duration: 0.9, ease: "easeInOut" }}
                      className="flex size-24 items-center justify-center rounded-full bg-munity-green/15"
                    >
                      <div className="flex size-16 items-center justify-center rounded-full bg-munity-green text-white">
                        <div className="text-center">
                          <p className="text-xs font-semibold">{breathPhase}</p>
                          <p className="text-xl font-bold">{breathCount}</p>
                        </div>
                      </div>
                    </motion.div>
                    <div>
                      <p className="text-sm font-semibold text-munity-text">Box breathing</p>
                      <p className="mt-1 text-sm text-munity-muted">4 seconds each phase</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setBreathing(false);
                      flash("Nice pause — take your time");
                    }}
                    className="rounded-xl border border-munity-green/30 bg-white px-5 py-2.5 text-sm font-semibold text-munity-green transition hover:bg-white/80"
                  >
                    End exercise
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setBreathing(true);
                    flash("Guided breathing started");
                  }}
                  className="mt-6 inline-flex items-center justify-center gap-2 rounded-2xl bg-[#1b1d0e] px-6 py-4 text-base font-semibold text-[#e4e4cc] transition hover:brightness-110"
                >
                  <Wind className="size-4" />
                  Start Guided Breathing
                </button>
              )}
            </section>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div id="nearby" className="flex scroll-mt-24 flex-col gap-4 lg:col-span-7">
            <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-munity-muted">
              Nearby Help
            </h3>
            <div className="overflow-hidden rounded-[24px] border border-[#e4e2e2] bg-white shadow-sm">
              <div className="relative h-52 w-full overflow-hidden bg-[#e8ebe0] md:h-64">
                <iframe
                  title="Nearby wellness support map"
                  src="https://maps.google.com/maps?q=Northside+General+Hospital&z=14&output=embed"
                  className="absolute inset-0 h-full w-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>
              <div className="flex flex-col gap-3 p-5 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex gap-3 text-left">
                  <MapPin className="mt-0.5 size-5 shrink-0 text-munity-green" />
                  <div>
                    <p className="font-semibold text-munity-text">Northside General Wellness</p>
                    <p className="mt-0.5 text-sm text-munity-muted">0.8 miles away · Open 24/7</p>
                    <a
                      href="https://www.google.com/maps/search/?api=1&query=Northside+General+Hospital"
                      target="_blank"
                      rel="noreferrer"
                      className="mt-2 inline-block text-sm font-semibold text-munity-green underline decoration-munity-green/30 underline-offset-2 hover:decoration-munity-green"
                    >
                      Get Directions
                    </a>
                  </div>
                </div>
                <a
                  href="tel:911"
                  className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-munity-border px-4 py-2.5 text-sm font-semibold text-munity-text transition hover:bg-[#f5f3f3]"
                >
                  <Phone className="size-3.5" />
                  Call clinic line
                </a>
              </div>
            </div>
          </div>

          <div id="international" className="flex scroll-mt-24 flex-col gap-4 lg:col-span-5">
            <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-munity-muted">
              International Crisis Lines
            </h3>
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 size-[18px] -translate-y-1/2 text-munity-gray" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for your country..."
                className="w-full rounded-xl border border-munity-gray bg-white py-3.5 pl-12 pr-4 text-base text-munity-text outline-none transition placeholder:text-[#6b7280] focus:border-munity-green focus:shadow-[0_0_0_3px_rgba(62,82,25,0.12)]"
              />
            </div>
            <div className="flex max-h-[280px] flex-col gap-2 overflow-auto pr-1">
              {filteredLines.map((line) => (
                <div
                  key={line.country}
                  className="flex items-center justify-between rounded-xl border border-[#e5e7eb] bg-white p-4"
                >
                  <p className="text-left text-base font-bold text-munity-text">{line.country}</p>
                  <div className="flex items-center gap-4">
                    <p className="font-mono text-sm font-bold text-munity-green md:text-base">
                      {line.number}
                    </p>
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
                <p className="py-6 text-left text-sm text-munity-muted">
                  No countries match your search.
                </p>
              ) : null}
            </div>
          </div>
        </section>

        <section id="hotlines" className="scroll-mt-24 grid grid-cols-1 gap-5 md:grid-cols-2">
          {hotlines.map((line) => {
            const Icon = line.icon;
            const ActionIcon = line.actionIcon;
            return (
              <article
                key={line.id}
                className="flex flex-col justify-between rounded-[20px] border border-munity-border bg-white p-6 text-left shadow-[0px_4px_10px_rgba(85,107,47,0.05)]"
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

        <footer className="border-t border-munity-border/40 pb-4 pt-6 text-left text-sm text-munity-muted">
          <p>
            © {new Date().getFullYear()} Munity Peer Support. This page is for immediate crisis
            redirection only.
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-4 text-munity-green">
            <Link href={routes.privacy} className="hover:underline">
              Privacy Policy
            </Link>
            <Link href={routes.terms} className="hover:underline">
              Terms of Service
            </Link>
            <Link href={routes.therapy} className="hover:underline">
              Find a Clinic
            </Link>
          </div>
        </footer>
        </motion.main>

        <aside className="hidden h-full w-60 shrink-0 flex-col overflow-y-auto border-l border-munity-border/50 bg-[#f5f3f3] px-3 py-6 lg:flex">
          <div className="mb-6 px-3">
            <p className="text-lg font-bold text-munity-green">Continue care</p>
            <p className="mt-0.5 text-xs text-munity-muted">After the crisis moment</p>
          </div>
          {rightNav}
        </aside>
      </div>

      <div className="z-50 shrink-0 border-t border-munity-green-dark/20 bg-munity-green px-6 py-4">
        <div className="flex w-full items-center gap-3 text-left text-white lg:px-2">
          <CheckCircle2 className="size-5 shrink-0" />
          <p className="text-sm font-medium md:text-base">
            You are taking a brave step by seeking support. Help is on the way.
          </p>
        </div>
      </div>
    </div>
  );
}

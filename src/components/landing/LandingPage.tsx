import Image from "next/image";
import Link from "next/link";
import {
  Activity,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Ghost,
  Lock,
  Moon,
  PenLine,
  Search,
  Star,
  UserCheck,
  UserPlus,
  Users,
  Wind,
} from "lucide-react";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { assets } from "@/lib/assets";
import { routes } from "@/lib/routes";

const stats = [
  { value: "50k+", label: "Active Members" },
  { value: "200+", label: "Support Communities" },
  { value: "1.2k+", label: "Licensed Therapists" },
  { value: "24/7", label: "Peer Support" },
];

const journeySteps = [
  {
    step: 1,
    title: "Join a Community",
    description:
      "Create your anonymous profile and discover interest-based groups that resonate with your current journey.",
    badgeClass: "bg-munity-green text-white",
  },
  {
    step: 2,
    title: "Connect & Share",
    description:
      "Engage in discussions, attend live support sessions, or connect privately with specialized therapists.",
    badgeClass: "bg-[#b6d088] text-munity-green",
  },
  {
    step: 3,
    title: "Heal at Your Pace",
    description:
      "Track your progress, utilize our resource library, and feel the steady growth of your emotional resilience.",
    badgeClass: "bg-[#d9eaa3] text-munity-olive-text",
  },
];

const testimonials = [
  {
    quote:
      '"Munity changed how I view my anxiety. The peer support groups made me realize I wasn\'t alone, and the transition to a professional therapist within the same app was seamless."',
    name: "Sarah M.",
    role: "Community Member since 2023",
    avatarClass: "bg-[#d9eaa3]",
  },
  {
    quote:
      '"As a therapist, I find Munity\'s platform incredible for connecting with clients who are already engaged in their wellness journey. The tools available are clinical-grade."',
    name: "Dr. James K.",
    role: "Licensed Psychologist",
    avatarClass: "bg-[#b6d088]",
  },
  {
    quote:
      '"The anonymity allowed me to speak my truth for the first time. The kindness of strangers here is what kept me going through my darkest months."',
    name: "Anonymous Member",
    role: "Health Advocate",
    avatarClass: "bg-[#dbd9d9]",
  },
];

const resourceTags = [
  { label: "Meditation", icon: Wind },
  { label: "Journaling", icon: PenLine },
  { label: "Sleep Aids", icon: Moon },
  { label: "Mood Tracking", icon: Activity },
];

export function LandingPage() {
  return (
    <div className="min-h-screen bg-munity-bg">
      <LandingHeader />

      <main className="pt-16">
        <HeroSection />
        <StatsSection />
        <FeaturesSection />
        <JourneySection />
        <TestimonialsSection />
        <CtaSection />
      </main>

      <LandingFooter />
    </div>
  );
}

function HeroSection() {
  return (
    <section className="relative overflow-hidden px-10 py-24">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at top right, rgba(210,236,162,0.15) 0%, transparent 50%)",
        }}
      />
      <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
        <div className="flex flex-col gap-6">
          <span className="inline-flex w-fit rounded-full bg-munity-lime px-4 py-1.5 text-sm font-semibold tracking-wide text-munity-olive-text">
            Mental Wellness Reinvented
          </span>
          <h1 className="text-5xl font-bold leading-[1.25] tracking-[-0.96px] text-munity-text">
            Find Support.
            <br />
            Build Connections.
            <br />
            Access Professional
            <br />
            Care.
          </h1>
          <p className="max-w-lg text-lg leading-[1.6] text-munity-muted">
            A safe community where emotional support and professional therapy work together to
            nurture your mental well-being.
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <Link
              href={routes.signup}
              className="inline-flex h-[52px] items-center gap-2 rounded-xl bg-munity-green px-6 text-sm font-semibold tracking-wide text-white transition hover:bg-munity-green-dark"
            >
              Join Community
              <UserPlus className="size-4" />
            </Link>
            <Link
              href={routes.login}
              className="inline-flex h-[52px] items-center gap-2 rounded-xl bg-munity-lime px-6 text-sm font-semibold tracking-wide text-munity-olive-text transition hover:bg-munity-lime-light"
            >
              Find a Therapist
              <Search className="size-4" />
            </Link>
          </div>
        </div>

        <div className="relative">
          <div
            aria-hidden
            className="absolute -right-6 -top-6 size-32 rounded-full bg-[rgba(182,208,136,0.3)] blur-3xl"
          />
          <div
            aria-hidden
            className="absolute -bottom-10 -left-10 size-48 rounded-full bg-[rgba(217,234,163,0.2)] blur-3xl"
          />
          <div className="relative overflow-hidden rounded-[40px] shadow-[0_4px_20px_rgba(85,107,47,0.05)]">
            <Image
              src={assets.landing.hero}
              alt="Support group sitting together outdoors"
              width={616}
              height={616}
              className="h-auto w-full object-cover"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function StatsSection() {
  return (
    <section className="border-y border-munity-input-border/30 bg-munity-sidebar px-10 py-12">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 md:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="text-center">
            <p className="text-[32px] font-bold text-munity-green">{stat.value}</p>
            <p className="mt-1 text-sm font-semibold tracking-wide text-munity-muted">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function FeaturesSection() {
  return (
    <section className="px-10 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <h2 className="text-[32px] font-bold text-munity-text">
            Comprehensive Care for Every Mind
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-munity-muted">
            Our ecosystem is built on the belief that stability is nurtured through a combination of
            peer empathy and clinical expertise.
          </p>
        </div>

        <div className="mt-16 grid gap-6 lg:grid-cols-4 lg:grid-rows-[auto_auto]">
          <div className="rounded-[20px] border border-munity-input-border/20 bg-white p-8 shadow-[0_4px_10px_rgba(85,107,47,0.05)] lg:col-span-2">
            <div className="flex size-12 items-center justify-center rounded-xl bg-munity-green/10">
              <Users className="size-5 text-munity-green" />
            </div>
            <h3 className="mt-4 text-2xl font-semibold text-munity-text">Peer Support Communities</h3>
            <p className="mt-3 text-base text-munity-muted">
              Join safe, moderated spaces where people with shared experiences offer mutual
              understanding and encouragement.
            </p>
            <div className="mt-4 overflow-hidden rounded-xl">
              <Image
                src={assets.landing.communityGraphic}
                alt="Community connection graphic"
                width={600}
                height={204}
                className="h-48 w-full object-cover"
              />
            </div>
          </div>

          <div className="flex flex-col justify-between rounded-[20px] border border-munity-input-border/20 bg-[#eae8e7] p-8 lg:col-span-1">
            <div>
              <div className="flex size-12 items-center justify-center rounded-xl bg-white">
                <Ghost className="size-5 text-munity-green" />
              </div>
              <h3 className="mt-4 text-2xl font-semibold text-munity-text">
                Anonymous
                <br />
                Posting
              </h3>
              <p className="mt-3 text-sm font-semibold leading-relaxed text-munity-muted">
                Share your story or seek advice without the pressure of identity. Your privacy is our
                priority.
              </p>
            </div>
            <p className="mt-8 border-t border-munity-input-border/20 pt-8 text-base italic text-munity-green/70">
              &ldquo;Finding safety in anonymity...&rdquo;
            </p>
          </div>

          <div className="flex flex-col justify-between rounded-[20px] border border-munity-input-border/20 bg-munity-lime p-8 lg:col-span-1">
            <div>
              <div className="flex size-12 items-center justify-center rounded-xl bg-white">
                <UserCheck className="size-5 text-munity-green" />
              </div>
              <h3 className="mt-4 text-2xl font-semibold text-munity-text">
                Professional
                <br />
                Therapy
              </h3>
              <p className="mt-3 text-sm font-semibold leading-relaxed text-munity-olive-text/80">
                Book 1-on-1 video or chat sessions with licensed clinicians specializing in anxiety,
                trauma, and more.
              </p>
            </div>
            <Link
              href={routes.login}
              className="mt-8 block rounded-xl bg-munity-green py-3 text-center text-sm font-semibold tracking-wide text-white transition hover:bg-munity-green-dark"
            >
              Explore Clinicians
            </Link>
          </div>

          <div className="flex flex-col items-center rounded-[20px] border border-munity-input-border/20 bg-white p-8 text-center shadow-[0_4px_10px_rgba(85,107,47,0.05)] lg:col-span-1">
            <div className="flex size-12 items-center justify-center rounded-xl bg-[rgba(100,101,82,0.1)]">
              <Lock className="size-4 text-munity-green" />
            </div>
            <h3 className="mt-4 text-sm font-bold tracking-wide text-munity-text">
              Secure Messaging
            </h3>
            <p className="mt-2 text-[13px] leading-relaxed text-munity-muted">
              End-to-end encrypted communication for all your support chats.
            </p>
          </div>

          <div className="flex flex-col gap-8 rounded-[20px] border border-munity-input-border/20 bg-munity-sidebar p-8 lg:col-span-3 lg:flex-row lg:items-center">
            <div className="flex-1">
              <div className="flex size-12 items-center justify-center rounded-xl bg-munity-green/10">
                <BookOpen className="size-5 text-munity-green" />
              </div>
              <h3 className="mt-4 text-2xl font-semibold text-munity-text">
                Emotional Wellness Resources
              </h3>
              <p className="mt-3 text-base text-munity-muted">
                Access a curated library of mindfulness exercises, guided journals, and crisis
                management tools developed by mental health professionals.
              </p>
            </div>
            <div className="grid flex-1 grid-cols-2 gap-4">
              {resourceTags.map(({ label, icon: Icon }) => (
                <div
                  key={label}
                  className="flex flex-col items-center gap-2 rounded-xl bg-white p-4 shadow-[0_4px_10px_rgba(85,107,47,0.05)]"
                >
                  <Icon className="size-5 text-munity-green" />
                  <span className="text-xs font-bold text-munity-text">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function JourneySection() {
  return (
    <section className="bg-munity-bg px-10 py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-2">
        <div>
          <h2 className="text-[32px] font-bold text-munity-text">
            The Journey to Nurtured Stability
          </h2>
          <div className="mt-10 flex flex-col gap-12">
            {journeySteps.map((item) => (
              <div key={item.step} className="flex gap-6">
                <div
                  className={`flex size-12 shrink-0 items-center justify-center rounded-full text-lg font-bold ${item.badgeClass}`}
                >
                  {item.step}
                </div>
                <div>
                  <h3 className="text-2xl font-semibold text-munity-text">{item.title}</h3>
                  <p className="mt-2 text-base text-munity-muted">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative rounded-[32px] bg-white p-8 shadow-[0_4px_10px_rgba(85,107,47,0.05)]">
          <span className="absolute -right-4 -top-4 rounded-lg bg-[#4c4d3b] px-4 py-2 text-xs font-medium text-white">
            Safe & Confidential
          </span>
          <Image
            src={assets.landing.appMockup}
            alt="Munity app dashboard preview"
            width={504}
            height={504}
            className="w-full rounded-2xl"
          />
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  return (
    <section className="bg-munity-sidebar px-10 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-end justify-between gap-6">
          <div>
            <h2 className="text-[32px] font-bold text-munity-text">Real Stories of Recovery</h2>
            <p className="mt-2 text-base text-munity-muted">
              Voices from our thriving community members.
            </p>
          </div>
          <div className="hidden gap-4 sm:flex">
            <button
              type="button"
              aria-label="Previous testimonial"
              className="flex size-12 items-center justify-center rounded-full border border-munity-gray text-munity-gray"
            >
              <ChevronLeft className="size-4" />
            </button>
            <button
              type="button"
              aria-label="Next testimonial"
              className="flex size-12 items-center justify-center rounded-full border border-munity-gray text-munity-gray"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>

        <div className="mt-12 flex gap-6 overflow-x-auto pb-4">
          {testimonials.map((item) => (
            <article
              key={item.name}
              className="flex min-w-[400px] flex-col justify-between rounded-3xl bg-white p-10 shadow-[0_4px_10px_rgba(85,107,47,0.05)]"
            >
              <div>
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="size-5 fill-munity-green text-munity-green" />
                  ))}
                </div>
                <p className="mt-4 text-base italic leading-relaxed text-munity-text">
                  {item.quote}
                </p>
              </div>
              <div className="mt-8 flex items-center gap-4">
                <div className={`size-12 rounded-full ${item.avatarClass}`} />
                <div>
                  <p className="font-bold text-munity-text">{item.name}</p>
                  <p className="text-xs font-medium text-munity-muted">{item.role}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function CtaSection() {
  return (
    <section className="px-10 py-24">
      <div className="relative mx-auto max-w-[1000px] overflow-hidden rounded-[40px] bg-munity-green px-10 py-20 text-center">
        <div
          aria-hidden
          className="absolute -right-32 -top-32 size-64 rounded-full bg-white/10 blur-[40px]"
        />
        <div
          aria-hidden
          className="absolute -bottom-32 -left-32 size-96 rounded-full bg-[rgba(182,208,136,0.2)] blur-[50px]"
        />
        <div className="relative">
          <h2 className="text-5xl font-bold tracking-[-0.96px] text-white">
            Ready to find your community?
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg text-white/90">
            Join thousands of others on a path to sustained mental wellness and connection.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href={routes.signup}
              className="rounded-2xl bg-white px-10 py-5 text-base font-bold text-munity-green transition hover:bg-munity-bg"
            >
              Create Free Account
            </Link>
            <Link
              href={routes.login}
              className="rounded-2xl border border-white px-10 py-5 text-base font-bold text-white transition hover:bg-white/10"
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

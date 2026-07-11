"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  BadgeCheck,
  Briefcase,
  CreditCard,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Shield,
} from "lucide-react";
import { TherapistAppShell } from "@/components/therapistlayout/TherapistAppShell";
import { MunityLeafIcon } from "@/components/icons/MunityIcons";
import { LivePulse, LiveTicker, useLiveToast } from "@/components/live/LiveFeedback";
import { Button } from "@/components/ui/AppButton";
import { assets } from "@/lib/assets";
import {
  currentTherapistProfile,
  getTherapistDisplayName,
  type TherapistProfile,
} from "@/lib/therapist-profile";
import { routes } from "@/lib/routes";

function ProfileSection({
  title,
  description,
  editHref,
  children,
  delay = 0,
}: {
  title: string;
  description?: string;
  editHref?: string;
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="rounded-[20px] border border-munity-border bg-white p-6 shadow-[0_4px_10px_rgba(85,107,47,0.05)]"
    >
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-munity-text">{title}</h2>
          {description ? <p className="mt-1 text-sm text-munity-muted">{description}</p> : null}
        </div>
        {editHref ? (
          <Link
            href={editHref}
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold text-munity-green transition hover:bg-munity-lime/40"
          >
            <Pencil className="size-3.5" />
            Edit
          </Link>
        ) : null}
      </div>
      {children}
    </motion.section>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 border-b border-munity-border/60 py-3 last:border-b-0 last:pb-0 first:pt-0">
      <dt className="text-xs font-semibold uppercase tracking-wide text-munity-muted">{label}</dt>
      <dd className="text-sm font-medium text-munity-text">{value}</dd>
    </div>
  );
}

function VerificationBadge({ status }: { status: TherapistProfile["verificationStatus"] }) {
  if (status === "verified") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-munity-lime/60 px-3 py-1 text-xs font-bold text-munity-olive-text">
        <BadgeCheck className="size-3.5" />
        Verified Therapist
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-800">
      <Shield className="size-3.5" />
      {status === "in-review" ? "Verification in review" : "Verification pending"}
    </span>
  );
}

export function TherapistProfileView() {
  const profile = currentTherapistProfile;
  const displayName = getTherapistDisplayName(profile);
  const { flash } = useLiveToast();

  return (
    <TherapistAppShell
      active="Profile"
      title="Profile"
      subtitle="Your public therapist profile and practice details."
    >
      <LiveTicker items={["Your public profile is visible to patients.", "Credential verification remains in progress."]} />
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="overflow-hidden rounded-[24px] border border-munity-border bg-white shadow-[0_4px_10px_rgba(85,107,47,0.05)]"
      >
        <div className="bg-gradient-to-r from-munity-lime/40 via-munity-green/5 to-transparent px-8 py-8">
          <div className="flex flex-wrap items-center gap-6">
            <div className="relative size-24 overflow-hidden rounded-2xl border-4 border-white shadow-md">
              <Image
                src={assets.avatars.clinician}
                alt={displayName}
                fill
                className="object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-3xl font-bold text-munity-text">{displayName}</h2>
                <VerificationBadge status={profile.verificationStatus} />
                <LivePulse label="Profile live" />
              </div>
              <p className="mt-1 text-base font-medium text-munity-green">
                {profile.professionalTitle}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-munity-muted">
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="size-4 text-munity-green" />
                  {profile.practiceLocation}, Ghana
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Briefcase className="size-4 text-munity-green" />
                  Member since {profile.memberSince}
                </span>
              </div>
            </div>
            <Button
              href={routes.therapistOnboarding.basicInfo}
              onClick={() => flash("Profile editor opened")}
              variant="outline"
              className="shrink-0"
            >
              <Pencil className="size-4" />
              Edit Profile
            </Button>
          </div>
        </div>
        <div className="border-t border-munity-border px-8 py-5">
          <p className="text-sm leading-relaxed text-munity-muted">{profile.bio}</p>
        </div>
      </motion.section>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <ProfileSection
          title="Personal Information"
          description="Your basic contact and practice details."
          editHref={routes.therapistOnboarding.basicInfo}
          delay={0.05}
        >
          <dl>
            <DetailRow label="Title" value={profile.title} />
            <DetailRow label="Gender" value={profile.gender} />
            <DetailRow label="Full Name" value={`${profile.firstName} ${profile.lastName}`} />
            <DetailRow label="Professional Title" value={profile.professionalTitle} />
            <DetailRow label="Phone" value={profile.phone} />
            <DetailRow label="Email" value={profile.email} />
            <DetailRow label="Practice Location" value={profile.practiceLocation} />
          </dl>
        </ProfileSection>

        <ProfileSection
          title="Professional Credentials"
          description="Licensing information shown to patients after verification."
          editHref={routes.therapistOnboarding.credentials}
          delay={0.1}
        >
          <dl>
            <DetailRow label="Licensing Body" value={profile.licensingBody} />
            <DetailRow label="License Type" value={profile.licenseType} />
            <DetailRow label="License Number" value={profile.licenseNumber} />
            <DetailRow label="Expiry Date" value={profile.licenseExpiry} />
          </dl>
          <Link
            href={routes.therapistCredentialAuth}
            className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-munity-green hover:underline"
          >
            <Shield className="size-4" />
            View verification status
          </Link>
        </ProfileSection>

        <ProfileSection
          title="Specialties & Expertise"
          description="Areas where you provide clinical support."
          editHref={routes.therapistOnboarding.specialties}
          delay={0.15}
        >
          <div className="flex flex-wrap gap-2">
            {profile.specialties.map((specialty) => (
              <span
                key={specialty}
                className="inline-flex items-center gap-1.5 rounded-full bg-munity-lime/50 px-3 py-1.5 text-sm font-semibold text-munity-olive-text"
              >
                <MunityLeafIcon className="size-3.5 text-munity-green" />
                {specialty}
              </span>
            ))}
          </div>
        </ProfileSection>

        <ProfileSection
          title="Payout Settings"
          description="How you receive session payments. Sensitive details are masked."
          editHref={routes.therapistOnboarding.payout}
          delay={0.2}
        >
          <dl>
            <DetailRow label="Payment Methods" value={profile.payoutMethods.join(", ")} />
            {profile.mobileMoneyNetwork ? (
              <DetailRow
                label="Mobile Money"
                value={`${profile.mobileMoneyNetwork} · ${profile.mobileMoneyNumber}`}
              />
            ) : null}
            {profile.bankName ? (
              <DetailRow
                label="Bank Account"
                value={`${profile.bankName} · ending ${profile.bankAccountLast4}`}
              />
            ) : null}
          </dl>
          <p className="mt-4 flex items-start gap-2 text-xs text-munity-muted">
            <CreditCard className="mt-0.5 size-3.5 shrink-0 text-munity-green" />
            Payout details are encrypted and only used for disbursements.
          </p>
        </ProfileSection>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="rounded-[20px] border border-munity-green/15 bg-munity-green/5 p-6"
      >
        <h2 className="text-base font-bold text-munity-text">Public contact shortcuts</h2>
        <p className="mt-1 text-sm text-munity-muted">
          These are the details patients see when booking with you.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <a
            href={`tel:${profile.phone.replace(/\s/g, "")}`}
            className="inline-flex items-center gap-2 rounded-xl border border-munity-border bg-white px-4 py-2.5 text-sm font-semibold text-munity-text transition hover:border-munity-green/30"
          >
            <Phone className="size-4 text-munity-green" />
            {profile.phone}
          </a>
          <a
            href={`mailto:${profile.email}`}
            className="inline-flex items-center gap-2 rounded-xl border border-munity-border bg-white px-4 py-2.5 text-sm font-semibold text-munity-text transition hover:border-munity-green/30"
          >
            <Mail className="size-4 text-munity-green" />
            {profile.email}
          </a>
        </div>
      </motion.div>
    </TherapistAppShell>
  );
}

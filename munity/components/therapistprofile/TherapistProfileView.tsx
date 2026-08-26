"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  BadgeCheck,
  Briefcase,
  Camera,
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ImageLightbox } from "@/components/ui/image-lightbox";
import {
  getTherapistDisplayName,
  type TherapistProfile,
} from "@/lib/therapist-profile";
import { updateTherapistProfile } from "@/app/therapistprofile/actions";
import { createClient } from "@/lib/supabase/client";
import { assets } from "@/lib/assets";
import { routes } from "@/lib/routes";
import { PROFILE_UPDATED_EVENT } from "@/hooks/use-current-profile";

type EditSection = "profile" | "personal" | "credentials" | "specialties" | "payout";

const specialtyOptions = [
  "Anxiety & Stress",
  "Depression",
  "Trauma & PTSD",
  "Relationship Issues",
  "CBT Therapy",
  "Family Issues",
  "Grief & Loss",
  "Burnout",
];

const payoutOptions = ["Mobile Money", "Bank Transfer", "Card"];

function ProfileSection({
  title,
  description,
  onEdit,
  children,
  delay = 0,
}: {
  title: string;
  description?: string;
  onEdit?: () => void;
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
        {onEdit ? (
          <button
            type="button"
            onClick={onEdit}
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold text-munity-green transition hover:bg-munity-lime/40"
          >
            <Pencil className="size-3.5" />
            Edit
          </button>
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

function Field({
  label,
  value,
  onChange,
  multiline,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs font-semibold tracking-wide text-munity-muted">{label}</span>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={4}
          className="w-full resize-none rounded-xl border border-[#c5c8b8] bg-white px-3 py-2.5 text-sm text-munity-text outline-none ring-munity-green/30 focus:ring-2"
        />
      ) : (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-xl border border-[#c5c8b8] bg-white px-3 py-2.5 text-sm text-munity-text outline-none ring-munity-green/30 focus:ring-2"
        />
      )}
    </label>
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
    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-800 dark:bg-amber-950/40 dark:text-amber-300">
      <Shield className="size-3.5" />
      {status === "in-review" ? "Verification in review" : status === "rejected" ? "Verification rejected" : "Verification pending"}
    </span>
  );
}

export function TherapistProfileView({
  initialProfile,
  userId,
}: {
  initialProfile: TherapistProfile;
  userId: string;
}) {
  const { flash } = useLiveToast();
  const [profile, setProfile] = useState<TherapistProfile>(initialProfile);
  const [editSection, setEditSection] = useState<EditSection | null>(null);
  const [draft, setDraft] = useState<TherapistProfile>(initialProfile);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [avatarViewerOpen, setAvatarViewerOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleAvatarChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      flash("Please choose an image file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      flash("Image must be under 5MB.");
      return;
    }

    setIsUploadingAvatar(true);
    const supabase = createClient();
    const ext = file.name.split(".").pop();
    const path = `${userId}/avatar-${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(path, file, { cacheControl: "3600", upsert: false });

    if (uploadError) {
      setIsUploadingAvatar(false);
      flash(`Upload failed: ${uploadError.message}`);
      return;
    }

    const { data: publicUrlData } = supabase.storage.from("avatars").getPublicUrl(path);
    const newAvatarUrl = publicUrlData.publicUrl;

    const { error: updateError } = await supabase
      .from("profiles")
      .update({ avatar_url: newAvatarUrl })
      .eq("id", userId);

    setIsUploadingAvatar(false);

    if (updateError) {
      flash(`Could not save avatar: ${updateError.message}`);
      return;
    }

    setProfile((prev) => ({ ...prev, avatarUrl: newAvatarUrl }));
    window.dispatchEvent(new Event(PROFILE_UPDATED_EVENT));
    flash("Profile picture updated");
  }

  const displayName = getTherapistDisplayName(profile);

  function openEdit(section: EditSection) {
    setDraft(profile);
    setEditSection(section);
  }

  async function saveDraft() {
    const next: TherapistProfile = {
      ...draft,
      firstName: draft.firstName.trim() || profile.firstName,
      lastName: draft.lastName.trim() || profile.lastName,
      professionalTitle: draft.professionalTitle.trim() || profile.professionalTitle,
      phone: draft.phone.trim() || profile.phone,
      email: draft.email.trim() || profile.email,
      practiceLocation: draft.practiceLocation.trim() || profile.practiceLocation,
      bio: draft.bio.trim() || profile.bio,
      specialties: draft.specialties.length ? draft.specialties : profile.specialties,
      payoutMethods: draft.payoutMethods.length ? draft.payoutMethods : profile.payoutMethods,
    };

    setIsSaving(true);
    const result = await updateTherapistProfile(next);
    setIsSaving(false);

    if (result?.error) {
      flash(`Could not save: ${result.error}`);
      return;
    }

    setProfile(next);
    setEditSection(null);
    flash("Profile updated");
  }

  function toggleSpecialty(specialty: string) {
    setDraft((prev) => ({
      ...prev,
      specialties: prev.specialties.includes(specialty)
        ? prev.specialties.filter((item) => item !== specialty)
        : [...prev.specialties, specialty],
    }));
  }

  function togglePayout(method: string) {
    setDraft((prev) => ({
      ...prev,
      payoutMethods: prev.payoutMethods.includes(method)
        ? prev.payoutMethods.filter((item) => item !== method)
        : [...prev.payoutMethods, method],
    }));
  }

  return (
    <TherapistAppShell
      active="Profile"
      title="Profile"
      subtitle="Your public therapist profile and practice details."
    >
      <LiveTicker
        items={[
          "Your public profile is visible to patients.",
          "Credential verification remains in progress.",
        ]}
      />
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="overflow-hidden rounded-[24px] border border-munity-border bg-white shadow-[0_4px_10px_rgba(85,107,47,0.05)]"
      >
        <div className="bg-gradient-to-r from-munity-lime/40 via-munity-green/5 to-transparent px-8 py-8">
          <div className="flex flex-wrap items-center gap-6">
            <div className="relative size-24 shrink-0">
              <button
                type="button"
                onClick={() => setAvatarViewerOpen(true)}
                aria-label="View profile photo"
                className="relative size-24 cursor-zoom-in overflow-hidden rounded-2xl border-4 border-white shadow-md"
              >
                <Image
                  src={profile.avatarUrl || assets.avatars.clinician}
                  alt={displayName}
                  fill
                  className="object-cover"
                />
                {isUploadingAvatar ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                    <span className="text-xs font-semibold text-white">Uploading…</span>
                  </div>
                ) : null}
              </button>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploadingAvatar}
                className="absolute -bottom-1 -right-1 flex size-8 items-center justify-center rounded-full border-2 border-white bg-munity-green text-white shadow-md transition hover:bg-munity-green-dark disabled:opacity-50"
                aria-label="Change profile picture"
              >
                <Camera className="size-4" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
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
              type="button"
              onClick={() => openEdit("profile")}
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
          onEdit={() => openEdit("personal")}
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
          onEdit={() => openEdit("credentials")}
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
          onEdit={() => openEdit("specialties")}
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
          onEdit={() => openEdit("payout")}
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

      <ImageLightbox
        images={[profile.avatarUrl || assets.avatars.clinician]}
        altText={`${displayName}'s profile photo`}
        open={avatarViewerOpen}
        onOpenChange={setAvatarViewerOpen}
      />

      <Dialog
        open={editSection !== null}
        onOpenChange={(open) => {
          if (!open) setEditSection(null);
        }}
      >
        <DialogContent
          className="max-h-[90dvh] overflow-y-auto border border-[#d8dbcf] bg-white shadow-2xl ring-1 ring-black/5 sm:max-w-lg"
          showCloseButton
        >
          <DialogHeader>
            <DialogTitle>
              {editSection === "credentials"
                ? "Edit credentials"
                : editSection === "specialties"
                  ? "Edit specialties"
                  : editSection === "payout"
                    ? "Edit payout settings"
                    : "Edit profile"}
            </DialogTitle>
            <DialogDescription>
              Updates stay on this device for the therapist preview — they do not reopen onboarding.
            </DialogDescription>
          </DialogHeader>

          {editSection === "profile" || editSection === "personal" ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Field
                  label="Title"
                  value={draft.title}
                  onChange={(value) => setDraft((prev) => ({ ...prev, title: value }))}
                />
                <Field
                  label="Gender"
                  value={draft.gender}
                  onChange={(value) => setDraft((prev) => ({ ...prev, gender: value }))}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field
                  label="First name"
                  value={draft.firstName}
                  onChange={(value) => setDraft((prev) => ({ ...prev, firstName: value }))}
                />
                <Field
                  label="Last name"
                  value={draft.lastName}
                  onChange={(value) => setDraft((prev) => ({ ...prev, lastName: value }))}
                />
              </div>
              <Field
                label="Professional title"
                value={draft.professionalTitle}
                onChange={(value) =>
                  setDraft((prev) => ({ ...prev, professionalTitle: value }))
                }
              />
              <Field
                label="Phone"
                value={draft.phone}
                onChange={(value) => setDraft((prev) => ({ ...prev, phone: value }))}
              />
              <Field
                label="Email"
                value={draft.email}
                onChange={(value) => setDraft((prev) => ({ ...prev, email: value }))}
              />
              <Field
                label="Practice location"
                value={draft.practiceLocation}
                onChange={(value) =>
                  setDraft((prev) => ({ ...prev, practiceLocation: value }))
                }
              />
              {editSection === "profile" ? (
                <Field
                  label="Bio"
                  value={draft.bio}
                  multiline
                  onChange={(value) => setDraft((prev) => ({ ...prev, bio: value }))}
                />
              ) : null}
            </div>
          ) : null}

          {editSection === "credentials" ? (
            <div className="space-y-4">
              <Field
                label="Licensing body"
                value={draft.licensingBody}
                onChange={(value) => setDraft((prev) => ({ ...prev, licensingBody: value }))}
              />
              <Field
                label="License type"
                value={draft.licenseType}
                onChange={(value) => setDraft((prev) => ({ ...prev, licenseType: value }))}
              />
              <Field
                label="License number"
                value={draft.licenseNumber}
                onChange={(value) => setDraft((prev) => ({ ...prev, licenseNumber: value }))}
              />
              <Field
                label="Expiry date"
                value={draft.licenseExpiry}
                onChange={(value) => setDraft((prev) => ({ ...prev, licenseExpiry: value }))}
              />
            </div>
          ) : null}

          {editSection === "specialties" ? (
            <div className="flex flex-wrap gap-2">
              {specialtyOptions.map((specialty) => {
                const active = draft.specialties.includes(specialty);
                return (
                  <button
                    key={specialty}
                    type="button"
                    onClick={() => toggleSpecialty(specialty)}
                    className={`rounded-full px-3 py-1.5 text-sm font-semibold transition ${
                      active
                        ? "bg-munity-green text-white"
                        : "border border-[#c5c8b8] bg-white text-munity-text hover:border-munity-green/40"
                    }`}
                  >
                    {specialty}
                  </button>
                );
              })}
            </div>
          ) : null}

          {editSection === "payout" ? (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {payoutOptions.map((method) => {
                  const active = draft.payoutMethods.includes(method);
                  return (
                    <button
                      key={method}
                      type="button"
                      onClick={() => togglePayout(method)}
                      className={`rounded-full px-3 py-1.5 text-sm font-semibold transition ${
                        active
                          ? "bg-munity-green text-white"
                          : "border border-[#c5c8b8] bg-white text-munity-text hover:border-munity-green/40"
                      }`}
                    >
                      {method}
                    </button>
                  );
                })}
              </div>
              <Field
                label="Mobile money network"
                value={draft.mobileMoneyNetwork ?? ""}
                onChange={(value) =>
                  setDraft((prev) => ({ ...prev, mobileMoneyNetwork: value }))
                }
              />
              <Field
                label="Mobile money number"
                value={draft.mobileMoneyNumber ?? ""}
                onChange={(value) =>
                  setDraft((prev) => ({ ...prev, mobileMoneyNumber: value }))
                }
              />
              <Field
                label="Bank name"
                value={draft.bankName ?? ""}
                onChange={(value) => setDraft((prev) => ({ ...prev, bankName: value }))}
              />
              <Field
                label="Bank account (last 4)"
                value={draft.bankAccountLast4 ?? ""}
                onChange={(value) =>
                  setDraft((prev) => ({ ...prev, bankAccountLast4: value }))
                }
              />
            </div>
          ) : null}

          <DialogFooter className="border-[#e5e5e1] bg-[#f3f4ee]">
            <button
              type="button"
              onClick={() => setEditSection(null)}
              className="rounded-xl border-2 border-[#75796b] bg-white px-4 py-2.5 text-sm font-semibold text-munity-text shadow-sm transition hover:bg-[#eceee6]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={saveDraft}
              disabled={isSaving}
              className="rounded-xl bg-munity-green px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-munity-green-dark disabled:opacity-50"
            >
              {isSaving ? "Saving…" : "Save changes"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </TherapistAppShell>
  );
}

-- Run this once in the Supabase SQL Editor (Project → SQL Editor → New query).
-- This repo has no Supabase CLI / migrations set up, so schema changes are applied
-- by hand here — see README.md "Implementing a real backend".

-- ─────────────────────────────────────────────────────────────
-- 1. Private clinician notes (Patient Overview → "Private Clinician Notes")
--    One draft per (therapist, patient) pair. Never shown to the patient.
-- ─────────────────────────────────────────────────────────────
create table if not exists clinician_notes (
  id uuid primary key default gen_random_uuid(),
  therapist_id uuid not null references auth.users (id) on delete cascade,
  patient_id uuid not null references auth.users (id) on delete cascade,
  body text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (therapist_id, patient_id)
);

alter table clinician_notes enable row level security;

create policy "Therapists manage their own clinician notes"
  on clinician_notes
  for all
  using (auth.uid() = therapist_id)
  with check (auth.uid() = therapist_id);

-- ─────────────────────────────────────────────────────────────
-- 2. Credential document storage (Therapist onboarding → Credentials step)
--    Private bucket; each therapist can only read/write their own folder
--    (path is "<user id>/<filename>").
-- ─────────────────────────────────────────────────────────────
insert into storage.buckets (id, name, public)
values ('credential-documents', 'credential-documents', false)
on conflict (id) do nothing;

create policy "Therapists manage their own credential documents"
  on storage.objects
  for all
  using (
    bucket_id = 'credential-documents'
    and (storage.foldername(name))[1] = auth.uid()::text
  )
  with check (
    bucket_id = 'credential-documents'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- ─────────────────────────────────────────────────────────────
-- 4. Exact practice location (Therapist onboarding → Basic Info step)
--    Shown on the therapist profile next to the practice region.
-- ─────────────────────────────────────────────────────────────
alter table therapist_details add column if not exists exact_practice_location text;

-- ─────────────────────────────────────────────────────────────
-- 3. Mood check-ins (Patient home → daily mood check-in)
--    Feeds the therapist crisis-alert banner, the Analysis mood summaries,
--    and the patient-overview Mood Trends chart.
-- ─────────────────────────────────────────────────────────────
create table if not exists mood_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  mood text not null check (mood in ('struggling', 'anxious', 'tired', 'calm', 'optimistic', 'thriving')),
  note text,
  created_at timestamptz not null default now()
);

create index if not exists mood_entries_user_created_idx
  on mood_entries (user_id, created_at desc);

alter table mood_entries enable row level security;

create policy "Users manage their own mood entries"
  on mood_entries
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Therapists view mood entries of their booked patients"
  on mood_entries
  for select
  using (
    exists (
      select 1 from bookings
      where bookings.patient_id = mood_entries.user_id
        and bookings.therapist_id = auth.uid()
    )
  );

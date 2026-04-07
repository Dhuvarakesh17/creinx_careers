create extension if not exists "pgcrypto";

create table if not exists public.job_applications (
  id uuid primary key default gen_random_uuid(),
  role_id text not null,
  role_title text not null,
  sector text not null,
  candidate_name text not null,
  candidate_email text not null,
  candidate_phone text not null,
  experience_years text not null,
  portfolio_url text not null,
  cover_letter text not null,
  city text,
  linkedin_url text,
  current_role text,
  current_ctc text,
  expected_ctc text,
  notice_period text,
  skills text,
  heard_from text,
  referral_name text,
  resume_path text not null,
  status text not null default 'new',
  created_at timestamptz not null default now()
);

create index if not exists idx_job_applications_role_id
  on public.job_applications(role_id);

create index if not exists idx_job_applications_created_at
  on public.job_applications(created_at desc);

insert into storage.buckets (id, name, public)
values ('resumes', 'resumes', false)
on conflict (id) do nothing;

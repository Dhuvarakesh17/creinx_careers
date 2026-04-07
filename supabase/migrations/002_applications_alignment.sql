create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  job_id uuid references public.jobs(id) on delete set null,
  name text not null,
  email text not null,
  phone text not null,
  city text,
  linkedin text,
  portfolio text,
  current_role text,
  total_experience numeric(4,1),
  current_ctc text,
  expected_ctc text,
  notice_period text,
  skills text[] not null default '{}',
  how_heard text,
  referral_name text,
  resume_url text not null,
  cover_letter text,
  status text not null default 'new' check (status in ('new', 'reviewing', 'shortlisted', 'rejected', 'hired')),
  hr_notes text,
  created_at timestamptz not null default now()
);

create index if not exists idx_applications_job_created_at
  on public.applications(job_id, created_at desc);

create index if not exists idx_applications_status
  on public.applications(status);

-- Optional one-time backfill if legacy table exists.
insert into public.applications (
  id,
  name,
  email,
  phone,
  city,
  linkedin,
  portfolio,
  current_role,
  current_ctc,
  expected_ctc,
  notice_period,
  cover_letter,
  status,
  created_at,
  resume_url
)
select
  id,
  candidate_name,
  candidate_email,
  candidate_phone,
  city,
  linkedin_url,
  portfolio_url,
  current_role,
  current_ctc,
  expected_ctc,
  notice_period,
  cover_letter,
  status,
  created_at,
  resume_path
from public.job_applications
where to_regclass('public.job_applications') is not null
on conflict (id) do nothing;

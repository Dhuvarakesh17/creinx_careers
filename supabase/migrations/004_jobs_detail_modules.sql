alter table if exists public.jobs
  add column if not exists team text not null default '',
  add column if not exists experience_range text not null default '1-3',
  add column if not exists employment_type text not null default 'Full-time' check (employment_type in ('Full-time', 'Part-time', 'Internship', 'Contract')),
  add column if not exists status_tags text[] not null default '{}',
  add column if not exists openings integer not null default 1 check (openings > 0),
  add column if not exists posted_days_ago integer not null default 0,
  add column if not exists about_role text[] not null default '{}',
  add column if not exists nice_to_have text[] not null default '{}',
  add column if not exists perks text[] not null default '{}',
  add column if not exists interview_process text[] not null default '{"Application Review (24-48 hours)","Technical Screening","Technical Interview","HR Round","Offer"}';

create index if not exists idx_jobs_department_status
  on public.jobs(department, status);

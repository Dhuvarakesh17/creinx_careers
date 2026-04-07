create extension if not exists "pgcrypto";

create table if not exists public.jobs (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  department text not null check (department in ('technical', 'digital-marketing')),
  location text not null,
  work_mode text not null check (work_mode in ('onsite', 'hybrid', 'remote')),
  experience text not null check (experience in ('fresher', 'junior', 'mid', 'senior')),
  salary_min integer,
  salary_max integer,
  description text not null,
  responsibilities text[] not null default '{}',
  requirements text[] not null default '{}',
  skills text[] not null default '{}',
  status text not null default 'active' check (status in ('active', 'draft', 'closed')),
  created_at timestamptz not null default now()
);

create index if not exists idx_jobs_status_created_at
  on public.jobs(status, created_at desc);

create index if not exists idx_jobs_department
  on public.jobs(department);

create index if not exists idx_jobs_slug
  on public.jobs(slug);

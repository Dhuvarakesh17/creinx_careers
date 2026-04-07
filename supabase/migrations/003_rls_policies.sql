alter table public.jobs enable row level security;
alter table public.applications enable row level security;

-- Public can read only active jobs.
drop policy if exists "public can read active jobs" on public.jobs;
create policy "public can read active jobs"
on public.jobs
for select
using (status = 'active');

-- Service role can manage jobs.
drop policy if exists "service role can manage jobs" on public.jobs;
create policy "service role can manage jobs"
on public.jobs
for all
using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');

-- Public can insert applications (candidate flow).
drop policy if exists "public can submit applications" on public.applications;
create policy "public can submit applications"
on public.applications
for insert
with check (true);

-- Service role can read and update applications.
drop policy if exists "service role can manage applications" on public.applications;
create policy "service role can manage applications"
on public.applications
for all
using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');

insert into storage.buckets (id, name, public)
values ('resumes', 'resumes', false)
on conflict (id) do nothing;

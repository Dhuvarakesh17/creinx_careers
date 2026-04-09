create or replace view public.jobs_with_posted_days as
select
  j.*,
  greatest(0, (current_date - (j.created_at at time zone 'utc')::date))::int as live_posted_days_ago
from public.jobs j;

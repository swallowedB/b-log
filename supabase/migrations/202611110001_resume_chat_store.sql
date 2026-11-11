begin;

create table public.resume_chat_quota_buckets (
  environment text not null,
  bucket_key text not null,
  window_start timestamptz not null,
  used integer not null check (used >= 0),
  expires_at timestamptz not null,
  primary key (environment, bucket_key, window_start)
);
create table public.resume_chat_requests (
  environment text not null,
  visitor_key text not null,
  request_id uuid not null,
  input_hash text not null,
  status text not null check (status in ('reserved','completed','failed')),
  expires_at timestamptz not null,
  primary key (environment, visitor_key, request_id)
);
create table public.resume_chat_answer_cache (
  environment text not null,
  cache_key text not null,
  answer text not null check (char_length(answer) between 1 and 1500),
  source_ids text[] not null check (cardinality(source_ids) between 1 and 3),
  expires_at timestamptz not null,
  primary key (environment, cache_key)
);
create index on public.resume_chat_quota_buckets (expires_at);
create index on public.resume_chat_requests (expires_at);
create index on public.resume_chat_answer_cache (expires_at);
alter table public.resume_chat_quota_buckets enable row level security;
alter table public.resume_chat_requests enable row level security;
alter table public.resume_chat_answer_cache enable row level security;
revoke all on public.resume_chat_quota_buckets, public.resume_chat_requests, public.resume_chat_answer_cache from public, anon, authenticated;
grant select, insert, update, delete on public.resume_chat_quota_buckets, public.resume_chat_requests, public.resume_chat_answer_cache to service_role;

create function public.reserve_resume_chat_request(
  p_environment text, p_visitor_key text, p_ip_key text, p_request_id uuid, p_input_hash text, p_global_rpm integer default 3
) returns jsonb language plpgsql security invoker set search_path = '' as $$
declare
  moment timestamptz;
  day_start timestamptz;
  minute_start timestamptz;
  previous_hash text;
  bucket record;
  count_used integer;
  visitor_used integer := 0;
begin
  if p_environment !~ '^[a-z0-9:_-]{1,100}$' or p_visitor_key !~ '^[a-f0-9]{64}$'
     or p_input_hash !~ '^[a-f0-9]{64}$' or (p_ip_key is not null and p_ip_key !~ '^[a-f0-9]{64}$')
     or p_global_rpm not between 1 and 30 or p_request_id is null
     or p_environment is null or p_visitor_key is null or p_input_hash is null or p_global_rpm is null then
    raise exception 'Invalid reservation parameters';
  end if;
  -- One short transaction serializes this low-volume site's admission. No model I/O under lock.
  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended('resume-chat:' || p_environment, 0));
  moment := clock_timestamp();
  day_start := date_trunc('day', moment at time zone 'UTC') at time zone 'UTC';
  minute_start := date_trunc('minute', moment);

  delete from public.resume_chat_requests where ctid in (select ctid from public.resume_chat_requests where environment=p_environment and expires_at<=moment limit 100);
  delete from public.resume_chat_quota_buckets where ctid in (select ctid from public.resume_chat_quota_buckets where environment=p_environment and expires_at<=moment limit 100);
  delete from public.resume_chat_answer_cache where ctid in (select ctid from public.resume_chat_answer_cache where environment=p_environment and expires_at<=moment limit 100);

  select input_hash into previous_hash from public.resume_chat_requests where environment=p_environment and visitor_key=p_visitor_key and request_id=p_request_id and expires_at>moment;
  if found then
    return jsonb_build_object('allowed',false,'code',case when previous_hash=p_input_hash then 'duplicate' else 'input_mismatch' end);
  end if;
  select coalesce(used,0) into visitor_used from public.resume_chat_quota_buckets where environment=p_environment and bucket_key='v:'||p_visitor_key||':day' and window_start=day_start and expires_at>moment;
  visitor_used := coalesce(visitor_used,0);

  for bucket in select * from (values
    ('g:day', day_start, 30, day_start+interval '1 day'),
    ('g:minute', minute_start, p_global_rpm, minute_start+interval '1 minute'),
    ('v:'||p_visitor_key||':day', day_start, 5, day_start+interval '1 day'),
    ('v:'||p_visitor_key||':minute', minute_start, 3, minute_start+interval '1 minute'),
    ('ip:'||p_ip_key||':day', day_start, 15, day_start+interval '1 day')
  ) as b(key, start_at, maximum, end_at) where key is not null loop
    select used into count_used from public.resume_chat_quota_buckets where environment=p_environment and bucket_key=bucket.key and window_start=bucket.start_at and expires_at>moment;
    if coalesce(count_used,0)>=bucket.maximum then
      return jsonb_build_object('allowed',false,'code','quota','remaining',greatest(0,5-visitor_used),'resetAt',bucket.end_at);
    end if;
  end loop;

  insert into public.resume_chat_requests values(p_environment,p_visitor_key,p_request_id,p_input_hash,'reserved',moment+interval '24 hours');
  for bucket in select * from (values
    ('g:day',day_start,day_start+interval '1 day'),('g:minute',minute_start,minute_start+interval '1 minute'),
    ('v:'||p_visitor_key||':day',day_start,day_start+interval '1 day'),('v:'||p_visitor_key||':minute',minute_start,minute_start+interval '1 minute'),
    ('ip:'||p_ip_key||':day',day_start,day_start+interval '1 day')
  ) as b(key,start_at,end_at) where key is not null loop
    insert into public.resume_chat_quota_buckets values(p_environment,bucket.key,bucket.start_at,1,bucket.end_at)
    on conflict(environment,bucket_key,window_start) do update set used=public.resume_chat_quota_buckets.used+1;
  end loop;
  return jsonb_build_object('allowed',true,'remaining',4-visitor_used,'resetAt',day_start+interval '1 day');
end $$;
revoke all on function public.reserve_resume_chat_request(text,text,text,uuid,text,integer) from public, anon, authenticated;
grant execute on function public.reserve_resume_chat_request(text,text,text,uuid,text,integer) to service_role;
commit;

-- Run against a disposable database after applying the migration.
do $$
declare r jsonb; n integer; today timestamptz := date_trunc('day', now() at time zone 'UTC') at time zone 'UTC';
begin
  for n in 1..5 loop
    -- Reset only this fixture's minute bucket to isolate the daily cap.
    delete from public.resume_chat_quota_buckets where environment='daily' and bucket_key like '%:minute';
    r := public.reserve_resume_chat_request('daily', repeat('a',64), repeat('b',64), gen_random_uuid(), repeat('c',64), 30);
    assert (r->>'allowed')::boolean;
  end loop;
  r := public.reserve_resume_chat_request('daily', repeat('a',64), repeat('b',64), gen_random_uuid(), repeat('c',64), 30);
  assert not (r->>'allowed')::boolean;
  assert (r->>'remaining')::integer = 0;
  assert (r->>'resetAt')::timestamptz = today + interval '1 day';

  -- Yesterday's usage cannot block a new UTC day; expired entries are removed.
  insert into public.resume_chat_quota_buckets values ('rollover','v:'||repeat('a',64)||':day',today-interval '1 day',5,now()+interval '1 hour');
  insert into public.resume_chat_requests values ('rollover',repeat('a',64),gen_random_uuid(),repeat('c',64),'reserved',now()-interval '1 second');
  r := public.reserve_resume_chat_request('rollover', repeat('a',64), repeat('b',64), gen_random_uuid(), repeat('c',64), 30);
  assert (r->>'allowed')::boolean;
  assert (select count(*) from public.resume_chat_requests where environment='rollover') = 1;

  -- A minute cap is atomic and does not increment the daily bucket on rejection.
  for n in 1..3 loop
    r := public.reserve_resume_chat_request('minute', repeat('d',64), repeat('e',64), gen_random_uuid(), repeat('f',64), 30);
    assert (r->>'allowed')::boolean;
  end loop;
  r := public.reserve_resume_chat_request('minute', repeat('d',64), repeat('e',64), gen_random_uuid(), repeat('f',64), 30);
  assert not (r->>'allowed')::boolean;
  assert (select used from public.resume_chat_quota_buckets where environment='minute' and bucket_key='g:day') = 3;

  -- Supplemental IP limit applies even when each visitor changes identity.
  for n in 1..15 loop
    r := public.reserve_resume_chat_request('ip', md5(n::text)||md5(n::text), repeat('e',64), gen_random_uuid(), repeat('f',64), 30);
    assert (r->>'allowed')::boolean;
  end loop;
  r := public.reserve_resume_chat_request('ip', repeat('a',64), repeat('e',64), gen_random_uuid(), repeat('f',64), 30);
  assert not (r->>'allowed')::boolean;

  assert not has_table_privilege('anon','public.resume_chat_answer_cache','select');
  assert not has_table_privilege('authenticated','public.resume_chat_requests','insert');
  assert not has_function_privilege('anon','public.reserve_resume_chat_request(text,text,text,uuid,text,integer)','execute');
  assert not has_function_privilege('authenticated','public.reserve_resume_chat_request(text,text,text,uuid,text,integer)','execute');
  assert has_function_privilege('service_role','public.reserve_resume_chat_request(text,text,text,uuid,text,integer)','execute');
end $$;

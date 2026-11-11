"""Real Postgres concurrency/privilege tests; never connects to the production DB."""
import concurrent.futures
import os
from pathlib import Path
import subprocess
import time
import uuid

container = os.environ.get('TEST_POSTGRES_CONTAINER', f'boa-chat-tests-{os.getpid()}')
owned = 'TEST_POSTGRES_CONTAINER' not in os.environ
database = f'boa_chat_test_{os.getpid()}'

def docker(*args, **kwargs):
    return subprocess.run(['docker', *args], text=True, capture_output=True, timeout=90, **kwargs)

def sql(statement, check=True, db=database):
    result = docker('exec', '-i', container, 'psql', '-U', 'postgres', '-d', db, '-At', '-v', 'ON_ERROR_STOP=1', input=statement)
    if check and result.returncode:
        raise AssertionError(result.stderr)
    return result

def reserve(environment, visitor, request_id=None, message_hash='a'*64, ip=None):
    # All values are generated test fixtures, never user input.
    key = (visitor.encode().hex() + '0'*64)[:64]
    ip_key = "null" if ip is None else "'" + (ip.encode().hex()+'0'*64)[:64] + "'"
    request_id = request_id or str(uuid.uuid4())
    return sql(f"set role service_role; select public.reserve_resume_chat_request('{environment}','{key}',{ip_key},'{request_id}','{message_hash}',30)->>'allowed';").stdout.splitlines()[-1]

try:
    if owned:
        result = docker('run','--rm','-d','--name',container,'-e','POSTGRES_PASSWORD=local_test_only','postgres:17-alpine')
        assert result.returncode == 0, result.stderr
    for _ in range(30):
        if docker('exec',container,'pg_isready','-U','postgres').returncode == 0:
            break
        time.sleep(1)
    else:
        raise AssertionError('Postgres did not become ready')
    sql(f'create database {database};', db='postgres')
    sql("do $$ begin if not exists (select from pg_roles where rolname='anon') then create role anon; end if; if not exists (select from pg_roles where rolname='authenticated') then create role authenticated; end if; if not exists (select from pg_roles where rolname='service_role') then create role service_role bypassrls; end if; end $$; grant usage on schema public to anon,authenticated,service_role;")
    sql(Path('supabase/migrations/202611110001_resume_chat_store.sql').read_text())
    sql(Path('supabase/tests/resume_chat_store.sql').read_text())
    with concurrent.futures.ThreadPoolExecutor(max_workers=31) as pool:
        results = list(pool.map(lambda n: reserve('concurrent', str(n)), range(31)))
    assert results.count('true') == 30, results
    request_id = str(uuid.uuid4())
    with concurrent.futures.ThreadPoolExecutor(max_workers=12) as pool:
        results = list(pool.map(lambda _: reserve('duplicate','same',request_id), range(12)))
    assert results.count('true') == 1, results
    assert reserve('duplicate','new-cookie',request_id) == 'false'
    assert reserve('duplicate','same',request_id,'b'*64) == 'false'
    assert sql("select used from public.resume_chat_quota_buckets where environment='duplicate' and bucket_key='g:day';").stdout.strip() == '1'
    # A failing transaction rolls all reservations and all counters back.
    failure = sql("begin; select public.reserve_resume_chat_request('rollback',repeat('a',64),null,gen_random_uuid(),repeat('b',64),30); select 1/0; commit;", check=False)
    assert failure.returncode != 0
    assert sql("select count(*) from public.resume_chat_requests where environment='rollback';").stdout.strip() == '0'
    assert sql("select count(*) from public.resume_chat_quota_buckets where environment='rollback';").stdout.strip() == '0'
    for role in ['anon','authenticated']:
        assert sql(f"set role {role}; select * from public.resume_chat_answer_cache;", check=False).returncode != 0
        assert sql(f"set role {role}; select public.reserve_resume_chat_request('forbidden',repeat('a',64),null,gen_random_uuid(),repeat('b',64),30);", check=False).returncode != 0
    print('Postgres integration PASS: daily/minute/IP/UTC/TTL/roles, 31 concurrent → 30, 12 duplicates → 1, transaction rollback → no partial counters')
finally:
    if owned:
        docker('rm','-f',container)
    else:
        sql(f'drop database if exists {database};', check=False, db='postgres')

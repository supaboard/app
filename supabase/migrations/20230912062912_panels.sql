 CREATE TABLE IF NOT EXISTS supaboard.panels
 (
	id bigint generated always as identity primary key,
	uuid uuid unique NOT NULL DEFAULT uuid_generate_v4(),
    name text,
    config jsonb,
    queries jsonb,
    elements jsonb,
    account_id  uuid references supaboard.accounts(id),
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now(),
    deleted_at timestamp with time zone
 );

  CREATE TABLE IF NOT EXISTS supaboard.queries
 (
	id bigint generated always as identity primary key,
	uuid uuid unique NOT NULL DEFAULT uuid_generate_v4(),
    query text,
	database uuid,
    account_id  uuid references supaboard.accounts(id),
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now(),
    deleted_at timestamp with time zone
 );

 GRANT ALL ON supaboard.panels TO postgres, authenticated, service_role;
 GRANT ALL ON supaboard.queries TO postgres, authenticated, service_role;

ALTER TABLE supaboard.panels ENABLE ROW LEVEL SECURITY;
create policy "supaboard panels can be accessed by authenticated users" on supaboard.panels for ALL to authenticated using (true);

ALTER TABLE supaboard.queries ENABLE ROW LEVEL SECURITY;
create policy "supaboard queries can be accessed by authenticated users" on supaboard.queries for ALL to authenticated using (true);

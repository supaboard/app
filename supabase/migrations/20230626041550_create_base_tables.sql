CREATE SCHEMA IF NOT EXISTS supaboard;
GRANT USAGE ON SCHEMA supaboard to authenticated;
GRANT USAGE ON SCHEMA supaboard to service_role;
GRANT USAGE ON SCHEMA supaboard to anon;

DROP TYPE IF EXISTS supaboard.account_role;
CREATE TYPE supaboard.account_role AS ENUM ('owner', 'member');

CREATE TABLE IF NOT EXISTS supaboard.config
(
    self_hosted             boolean default true,
    enable_team_accounts    boolean default true
);

 CREATE TABLE IF NOT EXISTS supaboard.accounts
 (
     id uuid unique NOT NULL DEFAULT uuid_generate_v4(),
     primary_owner_user_id uuid references auth.users not null default auth.uid(),
     team_name text,
     personal_account boolean default false not null,
     updated_at timestamp with time zone,
     created_at timestamp with time zone,
     PRIMARY KEY (id)
 );

CREATE TABLE IF NOT EXISTS supaboard.account_user
(
    user_id uuid references auth.users not null,
    account_id uuid references supaboard.accounts not null,
    account_role supaboard.account_role not null,
    constraint account_user_pkey primary key(user_id, account_id)
);

CREATE TABLE IF NOT EXISTS supaboard.profiles
(
    id uuid unique references auth.users not null,
    name text,
    email text,
    settings jsonb,
    updated_at timestamp with time zone,
    created_at timestamp with time zone,
    primary key (id)
);

CREATE TABLE IF NOT EXISTS supaboard.dashboards
(
    id bigint generated always as identity primary key,
    uuid uuid default uuid_generate_v4(),
    name text,
    is_public boolean default false,
    public_hash uuid default uuid_generate_v4(),
    config jsonb,
    account_id  uuid references supaboard.accounts(id),
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now(),
    deleted_at timestamp with time zone
);

CREATE TABLE IF NOT EXISTS supaboard.databases
(
    id bigint generated always as identity primary key,
    uuid uuid default uuid_generate_v4(),
    name text,
    type text,
    connection text,
    account_id  uuid references supaboard.accounts(id),
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

CREATE TABLE IF NOT EXISTS supaboard.workflows
(
    id bigint generated always as identity primary key,
    uuid uuid default uuid_generate_v4(),
    name text,
    config jsonb,
    account_id  uuid references supaboard.accounts(id),
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now(),
    deleted_at timestamp with time zone
);

CREATE TABLE IF NOT EXISTS supaboard.contacts
(
    id bigint generated always as identity primary key,
    uuid uuid default uuid_generate_v4(),
    name text,
	table_name text,
    attributes jsonb,
    database uuid,
    account_id  uuid references supaboard.accounts(id),
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now(),
    deleted_at timestamp with time zone
);

CREATE TABLE IF NOT EXISTS supaboard.segments
(
    id bigint generated always as identity primary key,
    uuid uuid default uuid_generate_v4(),
    name text,
    config jsonb,
	database uuid,
    account_id  uuid references supaboard.accounts(id),
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now(),
    deleted_at timestamp with time zone
);

CREATE TABLE IF NOT EXISTS supaboard.email_invitations (
    id uuid not null default uuid_generate_v4(),
    email text not null,
    account_id uuid not null,
    invited_by_user_id uuid not null,
    role supaboard.account_role not null,
    created_at timestamp with time zone null default now(),
    constraint email_invitations_pkey primary key (id),
    constraint email_invitations_account_id_fkey foreign key (account_id) references supaboard.accounts (id),
	constraint email_invitations_invited_by_user_id_fkey foreign key (invited_by_user_id) references auth.users (id)
);


-- RLS --------------------------------------------------
GRANT ALL ON supaboard.config TO postgres, authenticated, service_role;
GRANT ALL ON supaboard.dashboards TO postgres, authenticated, service_role;
GRANT ALL ON supaboard.databases TO postgres, authenticated, service_role;
GRANT ALL ON supaboard.workflows TO postgres, authenticated, service_role;
GRANT ALL ON supaboard.contacts TO postgres, authenticated, service_role;
GRANT ALL ON supaboard.segments TO postgres, authenticated, service_role;
GRANT ALL ON supaboard.accounts TO postgres, authenticated, service_role;
GRANT ALL ON supaboard.account_user TO postgres, authenticated, service_role;
GRANT ALL ON supaboard.profiles TO postgres, authenticated, service_role;
GRANT ALL ON supaboard.email_invitations TO postgres, authenticated, service_role;

-- enable RLS on config
ALTER TABLE supaboard.config ENABLE ROW LEVEL SECURITY;
create policy "supaboard settings can be accessed by authenticated users" on supaboard.config for ALL to authenticated using (true);

ALTER TABLE supaboard.dashboards ENABLE ROW LEVEL SECURITY;
create policy "supaboard dashboards can be accessed by authenticated users" on supaboard.dashboards for ALL to authenticated using (true);

ALTER TABLE supaboard.databases ENABLE ROW LEVEL SECURITY;
create policy "supaboard databases can be accessed by authenticated users" on supaboard.databases for ALL to authenticated using (true);

ALTER TABLE supaboard.workflows ENABLE ROW LEVEL SECURITY;
create policy "supaboard workflows can be accessed by authenticated users" on supaboard.workflows for ALL to authenticated using (true);

ALTER TABLE supaboard.contacts ENABLE ROW LEVEL SECURITY;
create policy "supaboard contacts can be accessed by authenticated users" on supaboard.contacts for ALL to authenticated using (true);

ALTER TABLE supaboard.segments ENABLE ROW LEVEL SECURITY;
create policy "supaboard segments can be accessed by authenticated users" on supaboard.segments for ALL to authenticated using (true);

ALTER TABLE supaboard.accounts ENABLE ROW LEVEL SECURITY;
create policy "supaboard accounts can be accessed by authenticated users" on supaboard.accounts for ALL to authenticated using (true);

ALTER TABLE supaboard.account_user ENABLE ROW LEVEL SECURITY;
create policy "supaboard account_user can be accessed by authenticated users" on supaboard.account_user for ALL to authenticated using (true);

ALTER TABLE supaboard.profiles ENABLE ROW LEVEL SECURITY;
create policy "supaboard profiles can be accessed by authenticated users" on supaboard.profiles for ALL to authenticated using (true);

ALTER TABLE supaboard.email_invitations ENABLE ROW LEVEL SECURITY;
create policy "supaboard email_invitations can be accessed by authenticated users" on supaboard.email_invitations for ALL to authenticated using (true);

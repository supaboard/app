/**
  * Automatic handling for maintaining created_at and updated_at timestamps
  * on tables
 */
CREATE OR REPLACE FUNCTION trigger_set_timestamps()
    RETURNS TRIGGER AS
$$
BEGIN
    if TG_OP = 'INSERT' then
        NEW.created_at = now();
        NEW.updated_at = now();
    else
        NEW.updated_at = now();
        NEW.created_at = OLD.created_at;
    end if;
    RETURN NEW;
END
$$ LANGUAGE plpgsql;


/**
  Check a specific boolean config value
 */
CREATE OR REPLACE FUNCTION is_set(field_name text)
    RETURNS boolean AS
$$
DECLARE
    result BOOLEAN;
BEGIN
    execute format('select %I from config limit 1', field_name) into result;
    return result;
END;
$$ LANGUAGE plpgsql;

grant execute on function is_set(text) to authenticated;


 CREATE OR REPLACE FUNCTION supaboard.protect_account_fields()
     RETURNS TRIGGER AS
 $$
 BEGIN


    IF current_user IN ('authenticated', 'anon') THEN
       -- these are protected fields that users are not allowed to update themselves
       -- platform admins should be VERY careful about updating them as well.
       if NEW.id <> OLD.id
        OR NEW.personal_account <> OLD.personal_account
        OR NEW.primary_owner_user_id <> OLD.primary_owner_user_id
        THEN
           RAISE EXCEPTION 'You do not have permission to update this field';
        end if;
    end if;

    RETURN NEW;
 END
 $$ LANGUAGE plpgsql;

CREATE TRIGGER protect_account_fields
    BEFORE UPDATE
    ON supaboard.accounts
    FOR EACH ROW
    EXECUTE FUNCTION supaboard.protect_account_fields();

-- protect the timestamps
CREATE TRIGGER set_accounts_timestamp
    BEFORE INSERT OR UPDATE ON supaboard.accounts
    FOR EACH ROW
    EXECUTE PROCEDURE trigger_set_timestamps();

/**
  * When an account gets created, we want to insert the current user as the first
  * owner
 */
create function add_current_user_to_new_account()
    returns trigger
    language plpgsql
security definer
set search_path=public
as $$
    begin
        if new.primary_owner_user_id = auth.uid() then
            insert into supaboard.account_user (account_id, user_id, account_role)
            values (NEW.id, auth.uid(), 'owner');
        end if;
        return NEW;
    end;
$$;

-- trigger the function whenever a new account is created
CREATE TRIGGER add_current_user_to_new_account
    AFTER INSERT
    ON supaboard.accounts
    FOR EACH ROW
    EXECUTE FUNCTION add_current_user_to_new_account();



-- PROFILES ------------------------------------------------------------------------------------

ALTER TABLE supaboard.account_user
    ADD CONSTRAINT account_user_profiles_fkey FOREIGN KEY (user_id)
        REFERENCES supaboard.profiles (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION;


CREATE TRIGGER set_profiles_timestamp
    BEFORE INSERT OR UPDATE
    ON supaboard.profiles
    FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamps();


create policy "Users can view their own profiles" on supaboard.profiles
    for select
    to authenticated
    using (
    id = auth.uid()
    );

create policy "Users can view their teammates profiles" on supaboard.profiles
    for select
    to authenticated
    using (
        id IN (SELECT supaboard.account_user.user_id
               FROM supaboard.account_user
               WHERE (supaboard.account_user.user_id <> auth.uid()))
    );


create policy "Profiles are editable by their own user only" on supaboard.profiles
    for update
    to authenticated
    using (
    id = auth.uid()
    );


create or replace function run_new_user_setup()
    returns trigger
    language plpgsql
    security definer
    set search_path = public
as
$$
declare
    first_account_name  text;
    first_account_id    uuid;
    generated_user_name text;
begin
    if new.email IS NOT NULL then
        generated_user_name := split_part(new.email, '@', 1);
    end if;

    insert into supaboard.profiles (id, name, email) values (new.id, generated_user_name, new.email);
        -- create the new users's personal account
        insert into supaboard.accounts (primary_owner_user_id, personal_account)
        values (NEW.id, true)
        returning id into first_account_id;

        -- add them to the account_user table so they can act on it
        insert into supaboard.account_user (account_id, user_id, account_role)
        values (first_account_id, NEW.id, 'owner');
    return NEW;
end;
$$;

-- trigger the function every time a user is created
create trigger on_auth_user_created
    after insert
    on auth.users
    for each row
execute procedure run_new_user_setup();



-- Create a table for public profiles using UUIDs
create table if not exists profiles (
  id uuid references auth.users on delete cascade not null primary key,
  updated_at timestamp with time zone,
  username text unique,
  full_name text,
  avatar_url text,
  website text,
  role text not null default 'user' check (role in ('user', 'admin', 'moderator')),
  
  constraint username_length check (char_length(username) >= 3)
);

-- Set up Row Level Security!
alter table profiles enable row level security;

create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on profiles for insert
  with check ( (select auth.uid()) = id );

create policy "Users can update own profile."
  on profiles for update
  using ( (select auth.uid()) = id );

-- This trigger automatically creates a profile entry when a new user signs up via Supabase Auth.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, avatar_url, role)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url',
    coalesce(new.raw_user_meta_data->>'role', 'user') -- Allow role to be set via metadata on signup (be careful with this in prod) or default to user
  );
  return new;
end;
$$;

-- trigger the function every time a user is created
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Storage setup (if needed for avatars later, ensuring buckets exist is good practice, but keeping scope tight)
-- insert into storage.buckets (id, name) values ('avatars', 'avatars') ON CONFLICT DO NOTHING;

-- Policies for products (RBAC example)
-- Ensure products table exists (it does from previous migrations)
create policy "Admins can insert products"
  on products for insert
  with check ( 
    auth.role() = 'authenticated' and 
    exists ( select 1 from profiles where id = auth.uid() and role = 'admin' ) 
  );

create policy "Admins can update products"
  on products for update
  using ( 
    auth.role() = 'authenticated' and 
    exists ( select 1 from profiles where id = auth.uid() and role = 'admin' ) 
  );

create policy "Admins can delete products"
  on products for delete
  using ( 
    auth.role() = 'authenticated' and 
    exists ( select 1 from profiles where id = auth.uid() and role = 'admin' ) 
  );

-- Resonix Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Profiles table (extends auth.users)
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  display_name text,
  avatar_url text,
  bio text,
  personality_type text,
  favorite_genres text[] default '{}',
  favorite_moods text[] default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Saved playlists
create table if not exists public.saved_playlists (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  prompt text,
  concept_blurb text,
  tracks jsonb default '[]',
  cover_color text default '#7c3aed',
  is_public boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Discovery history
create table if not exists public.discovery_history (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  item_type text not null check (item_type in ('song', 'album', 'artist', 'playlist')),
  item_data jsonb not null,
  query text,
  discovery_mode text,
  discovered_at timestamptz default now()
);

-- Mood tracking (weekly)
create table if not exists public.mood_tracking (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  mood text not null,
  week_number integer not null,
  year integer not null,
  count integer default 1,
  metadata jsonb default '{}',
  created_at timestamptz default now(),
  unique(user_id, mood, week_number, year)
);

-- User feedback on recommendations
create table if not exists public.recommendation_feedback (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  item_data jsonb not null,
  feedback_type text not null check (feedback_type in ('like', 'dismiss')),
  reason text,
  query_context text,
  created_at timestamptz default now()
);

-- Enable Row Level Security on all tables
alter table public.profiles enable row level security;
alter table public.saved_playlists enable row level security;
alter table public.discovery_history enable row level security;
alter table public.mood_tracking enable row level security;
alter table public.recommendation_feedback enable row level security;

-- RLS Policies: Profiles
create policy "Users can view their own profile" on public.profiles
  for select using (auth.uid() = id);
create policy "Users can update their own profile" on public.profiles
  for update using (auth.uid() = id);
create policy "Users can insert their own profile" on public.profiles
  for insert with check (auth.uid() = id);

-- RLS Policies: Saved Playlists
create policy "Users can manage their own playlists" on public.saved_playlists
  for all using (auth.uid() = user_id);
create policy "Users can view public playlists" on public.saved_playlists
  for select using (is_public = true);

-- RLS Policies: Discovery History
create policy "Users can manage their own discovery history" on public.discovery_history
  for all using (auth.uid() = user_id);

-- RLS Policies: Mood Tracking
create policy "Users can manage their own mood data" on public.mood_tracking
  for all using (auth.uid() = user_id);

-- RLS Policies: Feedback
create policy "Users can manage their own feedback" on public.recommendation_feedback
  for all using (auth.uid() = user_id);

-- Function to auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, display_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to auto-create profile
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Indexes for performance
create index if not exists idx_discovery_history_user_id on public.discovery_history(user_id);
create index if not exists idx_discovery_history_discovered_at on public.discovery_history(discovered_at desc);
create index if not exists idx_saved_playlists_user_id on public.saved_playlists(user_id);
create index if not exists idx_mood_tracking_user_week on public.mood_tracking(user_id, year, week_number);
create index if not exists idx_feedback_user_id on public.recommendation_feedback(user_id);

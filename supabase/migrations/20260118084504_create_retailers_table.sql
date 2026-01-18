create table if not exists public.retailers (
  id bigint primary key generated always as identity,
  created_at timestamptz default now() not null,
  english_name text,
  name text,
  category jsonb,
  country text,
  contact jsonb default '{}'::jsonb,
  exhibition jsonb default '[]'::jsonb
);

-- Enable Row Level Security (RLS)
alter table public.retailers enable row level security;
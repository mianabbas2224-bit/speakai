# SpeakAI — Vercel Environment Variables Setup

## Step 1: Add these in Vercel Dashboard
Go to: vercel.com → Your Project → Settings → Environment Variables

Add these 3 variables:

| Variable Name | Where to get it |
|---|---|
| ANTHROPIC_API_KEY | console.anthropic.com → API Keys |
| SUPABASE_URL | supabase.com → Your Project → Settings → API |
| SUPABASE_ANON_KEY | supabase.com → Your Project → Settings → API |

## Step 2: Supabase Database Setup
Run this SQL in Supabase → SQL Editor:

```sql
create table profiles (
  id uuid references auth.users primary key,
  full_name text,
  email text,
  streak integer default 0,
  total_conversations integer default 0,
  languages text[] default '{}',
  created_at timestamp default now()
);

alter table profiles enable row level security;

create policy "Users can view own profile"
  on profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on profiles for update
  using (auth.uid() = id);
```

## Step 3: Redeploy
After adding environment variables:
1. Go to Vercel → Your project → Deployments
2. Click the three dots on latest deployment
3. Click "Redeploy"

## That's it! Your platform now has:
✅ Real AI conversations (Claude API)
✅ User authentication (Supabase)
✅ Data persistence (Supabase database)
✅ Secure API keys (Vercel env vars)

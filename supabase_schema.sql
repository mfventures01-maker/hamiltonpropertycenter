-- Hamilton Property Center Unified Supabase Schema

CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid REFERENCES auth.users on delete cascade not null primary key,
  full_name text not null,
  email text,
  role text default 'buyer',
  verified boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile." ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile." ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE TABLE IF NOT EXISTS public.agents (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  verified boolean default false,
  verification_status text default 'pending',
  company_name text,
  phone text,
  subscription_tier text default 'free',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Agent profiles are viewable by everyone." ON public.agents FOR SELECT USING (true);
CREATE POLICY "Agents can update own profile." ON public.agents FOR UPDATE USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.properties (
  id uuid default uuid_generate_v4() primary key,
  agent_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  description text not null,
  price numeric not null,
  location text not null,
  property_type text not null,
  images jsonb default '[]'::jsonb,
  youtube_url text,
  status text default 'pending',
  featured boolean default false,
  views integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Approved properties are viewable by everyone." ON public.properties FOR SELECT USING (status = 'approved');
CREATE POLICY "Users can view their own properties." ON public.properties FOR SELECT USING (auth.uid() = agent_id);
CREATE POLICY "Verified agents can insert properties." ON public.properties FOR INSERT WITH CHECK (auth.uid() = agent_id);
CREATE POLICY "Agents can update own properties." ON public.properties FOR UPDATE USING (auth.uid() = agent_id);

CREATE TABLE IF NOT EXISTS public.inquiries (
  id uuid default uuid_generate_v4() primary key,
  property_id uuid references public.properties(id) on delete restrict not null,
  agent_id uuid references public.profiles(id) on delete cascade not null,
  user_name text not null,
  user_email text not null,
  message text not null,
  status text default 'new',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Agents can view their inquiries." ON public.inquiries FOR SELECT USING (auth.uid() = agent_id);
CREATE POLICY "Anyone can insert inquiries." ON public.inquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Agents can update their inquiries." ON public.inquiries FOR UPDATE USING (auth.uid() = agent_id);

CREATE TABLE IF NOT EXISTS public.favorites (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  property_id uuid references public.properties(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  UNIQUE(user_id, property_id)
);

ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own favorites." ON public.favorites FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own favorites." ON public.favorites FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users delete own favorites." ON public.favorites FOR DELETE USING (auth.uid() = user_id);

-- End of Schema

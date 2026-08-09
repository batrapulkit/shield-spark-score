-- Supabase SQL Editor Script: Enable RLS and Configure Policies
-- Copy and paste this script into the Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql)

-- 1. Enable Row Level Security (RLS) on the submissions table (if not already enabled)
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

-- 2. Allow anonymous public users to INSERT their assessment leads/scans
-- Security note: Anon users can write/submit, but cannot read other people's submissions!
DROP POLICY IF EXISTS "Allow public inserts" ON public.submissions;
CREATE POLICY "Allow public inserts" 
ON public.submissions 
FOR INSERT 
TO anon 
WITH CHECK (true);

-- 3. Restrict SELECT, UPDATE, and DELETE operations to the Service Role (Admin Panel)
-- Security note: By default, Supabase service_role key bypasses RLS and can perform select/update/delete.
-- Keeping SELECT restricted to service_role prevents public scraping of lead data.
DROP POLICY IF EXISTS "Allow service role select" ON public.submissions;
DROP POLICY IF EXISTS "Allow service role update" ON public.submissions;
DROP POLICY IF EXISTS "Allow service role delete" ON public.submissions;

-- (Optional) If you want to enable admin reads/writes without service role during local development only:
-- CREATE POLICY "Allow dev select" ON public.submissions FOR SELECT TO anon USING (true);
-- CREATE POLICY "Allow dev update" ON public.submissions FOR UPDATE TO anon USING (true);
-- CREATE POLICY "Allow dev delete" ON public.submissions FOR DELETE TO anon USING (true);

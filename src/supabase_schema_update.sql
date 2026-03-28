-- Run this in the Supabase SQL Editor to create the Projects and Payments tables.

-- 1. Create Projects Table (if it doesn't exist)
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    client_name TEXT,
    budget NUMERIC DEFAULT 0,
    deadline TIMESTAMPTZ,
    assigned_developer_id UUID REFERENCES public.developer_profiles(id),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 1b. IF THE TABLE ALREADY EXISTED, force add the new columns:
ALTER TABLE public.projects 
    ADD COLUMN IF NOT EXISTS title TEXT,
    ADD COLUMN IF NOT EXISTS description TEXT,
    ADD COLUMN IF NOT EXISTS client_name TEXT,
    ADD COLUMN IF NOT EXISTS budget NUMERIC DEFAULT 0,
    ADD COLUMN IF NOT EXISTS deadline TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS assigned_developer_id UUID REFERENCES public.developer_profiles(id),
    ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled'));

-- 2. Create Payments Table
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID REFERENCES public.projects(id),
    developer_id UUID REFERENCES public.developer_profiles(id),
    amount NUMERIC DEFAULT 0,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'paid')),
    payment_method TEXT,
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Add total_earned to developer_profiles if it doesn't exist
ALTER TABLE public.developer_profiles ADD COLUMN IF NOT EXISTS total_earned NUMERIC DEFAULT 0;

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies for Projects
-- Developers can only see projects assigned to them
CREATE POLICY "Developers see assigned projects"
ON public.projects FOR SELECT
USING (assigned_developer_id = auth.uid());

-- Developers can update project status if assigned to them
CREATE POLICY "Developers update assigned projects"
ON public.projects FOR UPDATE
USING (assigned_developer_id = auth.uid());

-- Admin can manage all projects (assuming role = 'admin' or matching your admin email)
CREATE POLICY "Admins manage all projects"
ON public.projects FOR ALL
USING (EXISTS (
    SELECT 1 FROM auth.users 
    WHERE auth.users.id = auth.uid() 
    AND auth.users.email = 'YOUR_ADMIN_EMAIL@example.com' -- Replace with your actual admin email, or remove if you use a role-based check
));
-- (Alternative: If you just want to allow insert/update/delete for the app's service key / backend, you can omit the ALL policy for authenticated users, but since you are building an admin panel accessed by your login, use your email or check a custom claim).
-- Safer robust admin policy:
DROP POLICY IF EXISTS "Admins manage all projects" ON public.projects;
CREATE POLICY "Admins manage all projects"
ON public.projects FOR ALL
USING (auth.jwt() ->> 'email' = 'YOUR_ADMIN_EMAIL@example.com'); -- IMPORTANT: Replace this in your Supabase Editor before running

-- 6. RLS Policies for Payments
-- Developers can see their own payments
CREATE POLICY "Developers see their own payments"
ON public.payments FOR SELECT
USING (developer_id = auth.uid());

-- Admins can manage all payments
CREATE POLICY "Admins manage all payments"
ON public.payments FOR ALL
USING (auth.jwt() ->> 'email' = 'YOUR_ADMIN_EMAIL@example.com'); -- IMPORTANT: Replace this

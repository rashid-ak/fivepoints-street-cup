-- First check and update the skill_level constraint
ALTER TABLE public.teams 
DROP CONSTRAINT IF EXISTS teams_skill_level_check;

ALTER TABLE public.teams 
ADD CONSTRAINT teams_skill_level_check 
CHECK (skill_level IN ('Beginner', 'Intermediate', 'Advanced'));

-- Update teams table with new structure
ALTER TABLE public.teams 
DROP COLUMN IF EXISTS player2_name,
DROP COLUMN IF EXISTS player3_name,
DROP COLUMN IF EXISTS player4_name;

ALTER TABLE public.teams 
ADD COLUMN IF NOT EXISTS players TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS stripe_payment_intent_id TEXT,
ALTER COLUMN payment_status SET DEFAULT 'unpaid';

-- Update constraint for payment_status
ALTER TABLE public.teams 
DROP CONSTRAINT IF EXISTS teams_payment_status_check;

ALTER TABLE public.teams 
ADD CONSTRAINT teams_payment_status_check 
CHECK (payment_status IN ('unpaid', 'paid', 'refunded'));

-- Update RSVP table structure
ALTER TABLE public.rsvps 
RENAME COLUMN name TO full_name;

-- Add admin settings table
CREATE TABLE IF NOT EXISTS public.admin_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stripe_public_key TEXT,
  stripe_secret_key TEXT,
  team_entry_price INTEGER DEFAULT 7500, -- $75 in cents
  admin_password_hash TEXT DEFAULT '$2b$10$rQJ8H.6bt7mVrGdjbwgBu.FxtEHiJvdb5d6jB5uFyi2O8UHjA6rRO', -- "changeme"
  email_sender_name TEXT DEFAULT '5 Points Cup',
  email_sender_email TEXT DEFAULT 'noreply@5pointscup.com',
  event_date TEXT DEFAULT '2024-06-15',
  event_time TEXT DEFAULT '9:00 AM',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on admin settings
ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for admin settings (only accessible by admin functions)
CREATE POLICY "admin_settings_select" ON public.admin_settings
FOR SELECT
USING (true);

CREATE POLICY "admin_settings_update" ON public.admin_settings
FOR UPDATE
USING (true);

CREATE POLICY "admin_settings_insert" ON public.admin_settings
FOR INSERT
WITH CHECK (true);

-- Insert default settings
INSERT INTO public.admin_settings (id) 
VALUES (gen_random_uuid())
ON CONFLICT DO NOTHING;

-- Create updated_at trigger for admin_settings
CREATE TRIGGER update_admin_settings_updated_at
BEFORE UPDATE ON public.admin_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add updated_at trigger for teams if not exists
DROP TRIGGER IF EXISTS update_teams_updated_at ON public.teams;
CREATE TRIGGER update_teams_updated_at
BEFORE UPDATE ON public.teams
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
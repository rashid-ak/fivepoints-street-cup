-- Update teams table schema to match requirements
ALTER TABLE public.teams 
ADD COLUMN IF NOT EXISTS submission_id TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS event_date TEXT DEFAULT '2025-09-20';

-- Update rsvps table schema  
ALTER TABLE public.rsvps
ADD COLUMN IF NOT EXISTS event_date TEXT DEFAULT '2025-09-20';

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_teams_submission_id ON public.teams(submission_id);
CREATE INDEX IF NOT EXISTS idx_teams_captain_email ON public.teams(captain_email);
CREATE INDEX IF NOT EXISTS idx_rsvps_email ON public.rsvps(email);
CREATE INDEX IF NOT EXISTS idx_teams_payment_status ON public.teams(payment_status);

-- Create email_logs table for tracking sent emails
CREATE TABLE IF NOT EXISTS public.email_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_email TEXT NOT NULL,
  email_type TEXT NOT NULL, -- 'team_confirmation' or 'rsvp_confirmation'
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'sent', 'failed'
  error_message TEXT,
  sent_at TIMESTAMPTZ,
  retry_count INTEGER DEFAULT 0,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on email_logs
ALTER TABLE public.email_logs ENABLE ROW LEVEL SECURITY;

-- Create policies for email_logs
CREATE POLICY "Anyone can view email logs" ON public.email_logs
FOR SELECT
USING (true);

CREATE POLICY "System can insert email logs" ON public.email_logs
FOR INSERT
WITH CHECK (true);

CREATE POLICY "System can update email logs" ON public.email_logs
FOR UPDATE
USING (true);

-- Create webhook_logs table for Stripe webhook tracking
CREATE TABLE IF NOT EXISTS public.webhook_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stripe_event_id TEXT UNIQUE,
  event_type TEXT NOT NULL,
  processed BOOLEAN DEFAULT false,
  error_message TEXT,
  payload JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on webhook_logs
ALTER TABLE public.webhook_logs ENABLE ROW LEVEL SECURITY;

-- Create policies for webhook_logs
CREATE POLICY "Anyone can view webhook logs" ON public.webhook_logs
FOR SELECT
USING (true);

CREATE POLICY "System can insert webhook logs" ON public.webhook_logs
FOR INSERT
WITH CHECK (true);

CREATE POLICY "System can update webhook logs" ON public.webhook_logs
FOR UPDATE
USING (true);
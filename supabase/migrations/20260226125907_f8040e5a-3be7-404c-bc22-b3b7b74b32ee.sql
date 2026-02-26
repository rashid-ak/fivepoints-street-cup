
-- 1) payments table for proper Stripe payment tracking
CREATE TABLE public.payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_id uuid REFERENCES public.registrants(id) ON DELETE SET NULL,
  event_id uuid NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  provider text NOT NULL DEFAULT 'stripe',
  stripe_checkout_session_id text UNIQUE,
  stripe_payment_intent_id text,
  stripe_customer_id text,
  amount_cents integer NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'usd',
  status text NOT NULL DEFAULT 'requires_payment',
  refunded_cents integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_payments_event ON public.payments(event_id);
CREATE INDEX idx_payments_registration ON public.payments(registration_id);
CREATE INDEX idx_payments_stripe_pi ON public.payments(stripe_payment_intent_id);

ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage payments" ON public.payments FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Finance can view payments" ON public.payments FOR SELECT
  USING (public.has_role(auth.uid(), 'finance'));

CREATE POLICY "System can insert payments" ON public.payments FOR INSERT
  WITH CHECK (true);

CREATE POLICY "System can update payments" ON public.payments FOR UPDATE
  USING (true);

-- 2) refunds table
CREATE TABLE public.refunds (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_id uuid NOT NULL REFERENCES public.payments(id) ON DELETE CASCADE,
  stripe_refund_id text UNIQUE,
  amount_cents integer NOT NULL,
  reason text,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.refunds ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage refunds" ON public.refunds FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Finance can manage refunds" ON public.refunds FOR ALL
  USING (public.has_role(auth.uid(), 'finance'));

CREATE POLICY "System can insert refunds" ON public.refunds FOR INSERT
  WITH CHECK (true);

-- 3) scheduled_jobs table for automated reminders
CREATE TABLE public.scheduled_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_type text NOT NULL DEFAULT 'send_email',
  run_at timestamptz NOT NULL,
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  status text NOT NULL DEFAULT 'scheduled',
  attempts integer NOT NULL DEFAULT 0,
  last_error text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_scheduled_jobs_status_run ON public.scheduled_jobs(status, run_at);

ALTER TABLE public.scheduled_jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage scheduled jobs" ON public.scheduled_jobs FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "System can manage scheduled jobs" ON public.scheduled_jobs FOR ALL
  USING (true);

-- 4) Add missing columns to registrants
ALTER TABLE public.registrants
  ADD COLUMN IF NOT EXISTS check_in_code text UNIQUE DEFAULT gen_random_uuid()::text,
  ADD COLUMN IF NOT EXISTS source text NOT NULL DEFAULT 'public',
  ADD COLUMN IF NOT EXISTS custom_fields jsonb DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS waiver_accepted_at timestamptz;

-- 5) Add missing columns to events
ALTER TABLE public.events
  ADD COLUMN IF NOT EXISTS slug text UNIQUE,
  ADD COLUMN IF NOT EXISTS allow_walkups boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS is_free boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS price_cents integer,
  ADD COLUMN IF NOT EXISTS rules_json jsonb DEFAULT '{"match_duration": 10, "target_score": 5}'::jsonb,
  ADD COLUMN IF NOT EXISTS require_waiver boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS created_by uuid;

-- 6) Add trigger for updated_at on new tables
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON public.payments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_scheduled_jobs_updated_at BEFORE UPDATE ON public.scheduled_jobs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


-- ============================================
-- MEDIA LIBRARY TABLE
-- ============================================
CREATE TABLE public.media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  filename text NOT NULL,
  storage_path text NOT NULL,
  url text NOT NULL,
  alt_text text,
  tags text[] DEFAULT '{}',
  mime_type text,
  size_bytes bigint,
  uploaded_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage media" ON public.media
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Content managers can manage media" ON public.media
  FOR ALL USING (has_role(auth.uid(), 'content_manager'::app_role));

CREATE POLICY "Media is publicly readable" ON public.media
  FOR SELECT USING (true);

CREATE TRIGGER update_media_updated_at
  BEFORE UPDATE ON public.media
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- TEAM MEMBERS TABLE (replaces players text[])
-- ============================================
CREATE TABLE public.team_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id uuid NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  email text,
  phone text,
  status text NOT NULL DEFAULT 'invited' CHECK (status IN ('invited', 'confirmed', 'declined')),
  invite_token uuid DEFAULT gen_random_uuid(),
  invited_at timestamptz DEFAULT now(),
  confirmed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage team members" ON public.team_members
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Public can view team members" ON public.team_members
  FOR SELECT USING (true);

CREATE POLICY "Public can insert team members" ON public.team_members
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Team members can update own record" ON public.team_members
  FOR UPDATE USING (true);

-- Unique constraint to prevent duplicate team member by email per team
CREATE UNIQUE INDEX idx_team_members_unique_email ON public.team_members (team_id, email) WHERE email IS NOT NULL;

-- Index for invite token lookups
CREATE INDEX idx_team_members_invite_token ON public.team_members (invite_token);

-- ============================================
-- SITE MODULES TABLE (homepage content control)
-- ============================================
CREATE TABLE public.site_modules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  module_key text NOT NULL UNIQUE,
  label text NOT NULL,
  enabled boolean NOT NULL DEFAULT true,
  display_order integer DEFAULT 0,
  config jsonb DEFAULT '{}',
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.site_modules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage site modules" ON public.site_modules
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Content managers can manage site modules" ON public.site_modules
  FOR ALL USING (has_role(auth.uid(), 'content_manager'::app_role));

CREATE POLICY "Site modules are publicly readable" ON public.site_modules
  FOR SELECT USING (true);

CREATE TRIGGER update_site_modules_updated_at
  BEFORE UPDATE ON public.site_modules
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed default homepage modules
INSERT INTO public.site_modules (module_key, label, enabled, display_order) VALUES
  ('upcoming_events', 'Upcoming Events', true, 1),
  ('past_winners', 'Past Winners', false, 2),
  ('community_signup', 'Community / Email Capture', false, 3);

-- Create influencers table
CREATE TABLE public.influencers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  affiliate_link TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create clicks table
CREATE TABLE public.clicks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  influencer_id UUID NOT NULL REFERENCES public.influencers(id) ON DELETE CASCADE,
  clicked_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  ip_address TEXT,
  user_agent TEXT,
  referrer TEXT
);

-- Enable RLS
ALTER TABLE public.influencers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clicks ENABLE ROW LEVEL SECURITY;

-- Public can read active influencers by slug
CREATE POLICY "Public can read active influencers"
ON public.influencers FOR SELECT
USING (is_active = true);

-- Authenticated users (admins) can do everything on influencers
CREATE POLICY "Admins can manage influencers"
ON public.influencers FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Public can insert clicks (tracking)
CREATE POLICY "Public can insert clicks"
ON public.clicks FOR INSERT
WITH CHECK (true);

-- Authenticated users can read all clicks
CREATE POLICY "Admins can read clicks"
ON public.clicks FOR SELECT
TO authenticated
USING (true);

-- Indexes
CREATE INDEX idx_influencers_slug ON public.influencers(slug);
CREATE INDEX idx_clicks_influencer_id ON public.clicks(influencer_id);
CREATE INDEX idx_clicks_clicked_at ON public.clicks(clicked_at);

-- Updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_influencers_updated_at
BEFORE UPDATE ON public.influencers
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
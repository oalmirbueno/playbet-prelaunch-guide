
-- Fix influencers: admin needs to read ALL influencers (not just active)
DROP POLICY IF EXISTS "Admins can read all influencers" ON public.influencers;
CREATE POLICY "Admins can read all influencers"
ON public.influencers
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'));

-- Recreate as PERMISSIVE (default)
DROP POLICY IF EXISTS "Admins can insert influencers" ON public.influencers;
CREATE POLICY "Admins can insert influencers"
ON public.influencers
FOR INSERT
TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can update influencers" ON public.influencers;
CREATE POLICY "Admins can update influencers"
ON public.influencers
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can delete influencers" ON public.influencers;
CREATE POLICY "Admins can delete influencers"
ON public.influencers
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Public can read active influencers" ON public.influencers;
CREATE POLICY "Public can read active influencers"
ON public.influencers
FOR SELECT
TO anon, authenticated
USING (is_active = true);

-- Clicks
DROP POLICY IF EXISTS "Admins can read clicks" ON public.clicks;
CREATE POLICY "Admins can read clicks"
ON public.clicks
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Public can insert clicks" ON public.clicks;
CREATE POLICY "Public can insert clicks"
ON public.clicks
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- User roles
DROP POLICY IF EXISTS "Admins can read roles" ON public.user_roles;
CREATE POLICY "Admins can read roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'));

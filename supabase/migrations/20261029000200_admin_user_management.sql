ALTER TABLE public.admin_users
ADD COLUMN IF NOT EXISTS full_name text,
ADD COLUMN IF NOT EXISTS role text NOT NULL DEFAULT 'manager',
ADD COLUMN IF NOT EXISTS is_active boolean NOT NULL DEFAULT true;
ALTER TABLE public.admin_users ADD CONSTRAINT admin_users_role_check CHECK (role IN ('admin','manager'));
UPDATE public.admin_users SET role = 'admin' WHERE user_id IN (SELECT user_id FROM public.admin_users ORDER BY created_at ASC LIMIT 1);
CREATE OR REPLACE FUNCTION public.has_active_admin_access()
RETURNS boolean LANGUAGE sql STABLE SECURITY INVOKER SET search_path = public
AS $$ SELECT EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = (select auth.uid()) AND is_active = true) $$;
DROP POLICY IF EXISTS "Administrators can insert vehicles" ON public.vehicles;
DROP POLICY IF EXISTS "Administrators can update vehicles" ON public.vehicles;
DROP POLICY IF EXISTS "Administrators can delete vehicles" ON public.vehicles;
CREATE POLICY "Active managers can insert vehicles" ON public.vehicles FOR INSERT TO authenticated WITH CHECK ((select public.has_active_admin_access()));
CREATE POLICY "Active managers can update vehicles" ON public.vehicles FOR UPDATE TO authenticated USING ((select public.has_active_admin_access())) WITH CHECK ((select public.has_active_admin_access()));
CREATE POLICY "Active managers can delete vehicles" ON public.vehicles FOR DELETE TO authenticated USING ((select public.has_active_admin_access()));
DROP POLICY IF EXISTS "Administrators can view contacts" ON public.contacts;
DROP POLICY IF EXISTS "Administrators can delete contacts" ON public.contacts;
CREATE POLICY "Active managers can view contacts" ON public.contacts FOR SELECT TO authenticated USING ((select public.has_active_admin_access()));
CREATE POLICY "Active managers can delete contacts" ON public.contacts FOR DELETE TO authenticated USING ((select public.has_active_admin_access()));
DROP POLICY IF EXISTS "Administrators can upload vehicle images" ON storage.objects;
DROP POLICY IF EXISTS "Administrators can update vehicle images" ON storage.objects;
DROP POLICY IF EXISTS "Administrators can delete vehicle images" ON storage.objects;
CREATE POLICY "Active managers can upload vehicle images" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id='vehicles' AND (select public.has_active_admin_access()));
CREATE POLICY "Active managers can update vehicle images" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id='vehicles' AND (select public.has_active_admin_access())) WITH CHECK (bucket_id='vehicles' AND (select public.has_active_admin_access()));
CREATE POLICY "Active managers can delete vehicle images" ON storage.objects FOR DELETE TO authenticated USING (bucket_id='vehicles' AND (select public.has_active_admin_access()));
CREATE TABLE public.admin_users (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can view their membership" ON public.admin_users FOR SELECT TO authenticated
USING (user_id = (SELECT auth.uid()));
DROP POLICY "Authenticated users can insert vehicles" ON public.vehicles;
DROP POLICY "Authenticated users can update vehicles" ON public.vehicles;
DROP POLICY "Authenticated users can delete vehicles" ON public.vehicles;
CREATE POLICY "Administrators can insert vehicles" ON public.vehicles FOR INSERT TO authenticated
WITH CHECK (EXISTS (SELECT 1 FROM public.admin_users a WHERE a.user_id=(SELECT auth.uid())));
CREATE POLICY "Administrators can update vehicles" ON public.vehicles FOR UPDATE TO authenticated
USING (EXISTS (SELECT 1 FROM public.admin_users a WHERE a.user_id=(SELECT auth.uid())))
WITH CHECK (EXISTS (SELECT 1 FROM public.admin_users a WHERE a.user_id=(SELECT auth.uid())));
CREATE POLICY "Administrators can delete vehicles" ON public.vehicles FOR DELETE TO authenticated
USING (EXISTS (SELECT 1 FROM public.admin_users a WHERE a.user_id=(SELECT auth.uid())));
DROP POLICY "Authenticated users can view contacts" ON public.contacts;
DROP POLICY "Authenticated users can delete contacts" ON public.contacts;
CREATE POLICY "Administrators can view contacts" ON public.contacts FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM public.admin_users a WHERE a.user_id=(SELECT auth.uid())));
CREATE POLICY "Administrators can delete contacts" ON public.contacts FOR DELETE TO authenticated
USING (EXISTS (SELECT 1 FROM public.admin_users a WHERE a.user_id=(SELECT auth.uid())));
DROP POLICY "Authenticated users can upload vehicle images" ON storage.objects;
DROP POLICY "Authenticated users can update vehicle images" ON storage.objects;
DROP POLICY "Authenticated users can delete vehicle images" ON storage.objects;
CREATE POLICY "Administrators can upload vehicle images" ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id='vehicles' AND EXISTS (SELECT 1 FROM public.admin_users a WHERE a.user_id=(SELECT auth.uid())));
CREATE POLICY "Administrators can update vehicle images" ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id='vehicles' AND EXISTS (SELECT 1 FROM public.admin_users a WHERE a.user_id=(SELECT auth.uid())))
WITH CHECK (bucket_id='vehicles' AND EXISTS (SELECT 1 FROM public.admin_users a WHERE a.user_id=(SELECT auth.uid())));
CREATE POLICY "Administrators can delete vehicle images" ON storage.objects FOR DELETE TO authenticated
USING (bucket_id='vehicles' AND EXISTS (SELECT 1 FROM public.admin_users a WHERE a.user_id=(SELECT auth.uid())));
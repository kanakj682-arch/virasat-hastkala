CREATE POLICY "Anyone can upload karigar photos"
ON storage.objects FOR INSERT TO anon, authenticated
WITH CHECK (bucket_id = 'karigar-photos');
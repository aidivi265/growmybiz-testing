-- ==============================================================================
-- Growmybizz Supabase Storage Initialization Script
-- Target Bucket: 'growmybizz-media'
-- Description: Initializes the public media bucket in Supabase Storage with
--              Row Level Security (RLS) policies for unrestricted public reads
--              and secure service-role / authenticated admin uploads.
-- ==============================================================================

-- 1. Create or update the storage bucket 'growmybizz-media'
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'growmybizz-media',
    'growmybizz-media',
    true,
    26214400, -- 25 MB max file size limit
    ARRAY[
        'image/jpeg',
        'image/png',
        'image/webp',
        'image/svg+xml',
        'image/avif',
        'image/gif',
        'image/x-icon'
    ]::text[]
)
ON CONFLICT (id) DO UPDATE SET
    public = EXCLUDED.public,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

-- 2. Configure Row Level Security (RLS) Policies on storage.objects
DO $$
BEGIN
    -- Ensure RLS is enabled on storage.objects
    ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

    -- Policy 1: Unrestricted public read access (essential for website visitors, CDN, OG images)
    DROP POLICY IF EXISTS "Public can view growmybizz-media" ON storage.objects;
    DROP POLICY IF EXISTS "Public can view media" ON storage.objects;
    CREATE POLICY "Public can view growmybizz-media"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'growmybizz-media');

    -- Policy 2: Full management access for the backend service role
    DROP POLICY IF EXISTS "Service role full access on growmybizz-media" ON storage.objects;
    DROP POLICY IF EXISTS "Service role full access on storage" ON storage.objects;
    CREATE POLICY "Service role full access on growmybizz-media"
    ON storage.objects FOR ALL
    TO service_role
    USING (bucket_id = 'growmybizz-media')
    WITH CHECK (bucket_id = 'growmybizz-media');

    -- Policy 3: Authenticated users can upload media assets
    DROP POLICY IF EXISTS "Authenticated users can upload to growmybizz-media" ON storage.objects;
    CREATE POLICY "Authenticated users can upload to growmybizz-media"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'growmybizz-media');

    -- Policy 4: Authenticated users can update media assets
    DROP POLICY IF EXISTS "Authenticated users can update growmybizz-media" ON storage.objects;
    CREATE POLICY "Authenticated users can update growmybizz-media"
    ON storage.objects FOR UPDATE
    TO authenticated
    USING (bucket_id = 'growmybizz-media')
    WITH CHECK (bucket_id = 'growmybizz-media');

    -- Policy 5: Authenticated users can delete media assets
    DROP POLICY IF EXISTS "Authenticated users can delete growmybizz-media" ON storage.objects;
    CREATE POLICY "Authenticated users can delete growmybizz-media"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (bucket_id = 'growmybizz-media');

EXCEPTION
    WHEN undefined_table THEN
        RAISE NOTICE 'storage.objects table not found. Ensure Supabase Storage extension is enabled in your project.';
END $$;

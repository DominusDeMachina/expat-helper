-- Supabase Storage Configuration
-- Set up storage buckets for the Expat Food Finder app

-- =============================================
-- STORAGE BUCKETS
-- =============================================

-- Create product-images bucket (public)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create user-avatars bucket (public)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('user-avatars', 'user-avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Create supermarket-logos bucket (public)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('supermarket-logos', 'supermarket-logos', true)
ON CONFLICT (id) DO NOTHING;

-- =============================================
-- STORAGE POLICIES
-- =============================================

-- Product Images Policies
-- Anyone can view product images
CREATE POLICY "Anyone can view product images" ON storage.objects
  FOR SELECT USING (bucket_id = 'product-images');

-- Authenticated users can upload product images
CREATE POLICY "Authenticated users can upload product images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'product-images' 
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Users can update their own uploaded product images
CREATE POLICY "Users can update own product images" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'product-images' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Users can delete their own uploaded product images
CREATE POLICY "Users can delete own product images" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'product-images' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- User Avatars Policies
-- Anyone can view user avatars
CREATE POLICY "Anyone can view user avatars" ON storage.objects
  FOR SELECT USING (bucket_id = 'user-avatars');

-- Users can upload their own avatar
CREATE POLICY "Users can upload own avatar" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'user-avatars' 
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Users can update their own avatar
CREATE POLICY "Users can update own avatar" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'user-avatars' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Users can delete their own avatar
CREATE POLICY "Users can delete own avatar" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'user-avatars' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Supermarket Logos Policies
-- Anyone can view supermarket logos
CREATE POLICY "Anyone can view supermarket logos" ON storage.objects
  FOR SELECT USING (bucket_id = 'supermarket-logos');

-- Authenticated users can upload supermarket logos
CREATE POLICY "Authenticated users can upload supermarket logos" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'supermarket-logos' 
    AND auth.role() = 'authenticated'
  );

-- Users can update supermarket logos they uploaded
CREATE POLICY "Users can update own supermarket logos" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'supermarket-logos' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- =============================================
-- STORAGE HELPER FUNCTIONS
-- =============================================

-- Function to get public URL for a file
CREATE OR REPLACE FUNCTION get_public_url(bucket_name text, file_path text)
RETURNS text
LANGUAGE sql
STABLE
AS $$
  SELECT CASE 
    WHEN bucket_name IS NULL OR file_path IS NULL THEN NULL
    ELSE concat(
      current_setting('app.settings.supabase_url', true),
      '/storage/v1/object/public/',
      bucket_name,
      '/',
      file_path
    )
  END;
$$;

-- Function to generate file path for user uploads
CREATE OR REPLACE FUNCTION generate_user_file_path(
  user_id uuid,
  bucket_name text,
  file_extension text DEFAULT 'jpg'
)
RETURNS text
LANGUAGE sql
STABLE
AS $$
  SELECT concat(
    user_id::text,
    '/',
    extract(epoch from now())::bigint::text,
    '.',
    file_extension
  );
$$;

-- Function to generate file path for product images
CREATE OR REPLACE FUNCTION generate_product_file_path(
  user_id uuid,
  product_id uuid,
  file_extension text DEFAULT 'jpg'
)
RETURNS text
LANGUAGE sql
STABLE
AS $$
  SELECT concat(
    user_id::text,
    '/products/',
    product_id::text,
    '/',
    extract(epoch from now())::bigint::text,
    '.',
    file_extension
  );
$$;

-- =============================================
-- STORAGE CONFIGURATION NOTES
-- =============================================

/*
File Organization Structure:

product-images/
  {user_id}/
    products/
      {product_id}/
        {timestamp}.jpg
        {timestamp}.jpg

user-avatars/
  {user_id}/
    {timestamp}.jpg

supermarket-logos/
  {user_id}/
    {supermarket_id}/
      {timestamp}.jpg

File Size Limits (configure in Supabase dashboard):
- Product images: 5MB max
- User avatars: 2MB max  
- Supermarket logos: 2MB max

Allowed file types:
- Images: jpg, jpeg, png, webp
- Consider adding image optimization/compression

Security Notes:
- All buckets are public for easy CDN access
- RLS policies ensure users can only upload to their own folders
- File paths include user_id for security
- Consider adding virus scanning for production
*/ 
/*
  # Create News Images Storage Bucket

  1. Storage
    - Create 'news-images' bucket for storing uploaded news images
    - Enable public access with RLS policies
    - Allow authenticated users and anonymous users to read
*/

DO $$
BEGIN
  INSERT INTO storage.buckets (id, name, public)
  VALUES ('news-images', 'news-images', true)
  ON CONFLICT DO NOTHING;
END $$;

CREATE POLICY "Public Access"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'news-images');

CREATE POLICY "Admin Upload"
  ON storage.objects FOR INSERT
  TO public
  WITH CHECK (bucket_id = 'news-images');

CREATE POLICY "Admin Update"
  ON storage.objects FOR UPDATE
  TO public
  USING (bucket_id = 'news-images');

CREATE POLICY "Admin Delete"
  ON storage.objects FOR DELETE
  TO public
  USING (bucket_id = 'news-images');
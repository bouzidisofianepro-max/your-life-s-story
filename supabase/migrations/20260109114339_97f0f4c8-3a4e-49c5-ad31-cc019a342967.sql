-- Create storage bucket for event media
INSERT INTO storage.buckets (id, name, public)
VALUES ('event-media', 'event-media', true);

-- Allow authenticated users to upload files
CREATE POLICY "Users can upload media"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'event-media');

-- Allow public read access
CREATE POLICY "Public can view media"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'event-media');

-- Allow users to delete their own uploads
CREATE POLICY "Users can delete their media"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'event-media');
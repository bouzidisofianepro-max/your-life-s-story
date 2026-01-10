-- Drop the existing upload policy that requires authentication
DROP POLICY IF EXISTS "Users can upload media" ON storage.objects;

-- Create a new policy allowing anyone to upload to event-media bucket
CREATE POLICY "Anyone can upload media"
ON storage.objects
FOR INSERT
TO public
WITH CHECK (bucket_id = 'event-media');

-- Also update delete policy for consistency
DROP POLICY IF EXISTS "Users can delete their media" ON storage.objects;

CREATE POLICY "Anyone can delete media"
ON storage.objects
FOR DELETE
TO public
USING (bucket_id = 'event-media');
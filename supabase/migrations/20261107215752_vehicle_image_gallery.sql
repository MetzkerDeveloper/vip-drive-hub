ALTER TABLE public.vehicles
ADD COLUMN IF NOT EXISTS image_urls text[] NOT NULL DEFAULT '{}'::text[];

UPDATE public.vehicles
SET image_urls = ARRAY[image_url]
WHERE image_url IS NOT NULL
  AND cardinality(image_urls) = 0;

COMMENT ON COLUMN public.vehicles.image_urls IS
  'Ordered public image URLs for the vehicle; the first item is mirrored in image_url as the cover.';

ALTER TABLE public.vehicles
ADD COLUMN IF NOT EXISTS is_sold boolean NOT NULL DEFAULT false;

COMMENT ON COLUMN public.vehicles.is_sold IS 'True when a vehicle has been sold; false when available.';

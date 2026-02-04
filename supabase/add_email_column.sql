-- Add email column to clients table
ALTER TABLE public.clients
ADD COLUMN IF NOT EXISTS email TEXT;
-- Add index for email lookups
CREATE INDEX IF NOT EXISTS idx_clients_email ON public.clients(email);
-- Add comment
COMMENT ON COLUMN public.clients.email IS 'Client email address for promotions and notifications';
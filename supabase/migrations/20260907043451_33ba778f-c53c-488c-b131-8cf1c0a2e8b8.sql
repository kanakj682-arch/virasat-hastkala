ALTER TABLE public.karigar_kyc ADD COLUMN IF NOT EXISTS language text;
ALTER TABLE public.karigar_kyc ADD COLUMN IF NOT EXISTS phone_verified boolean NOT NULL DEFAULT false;
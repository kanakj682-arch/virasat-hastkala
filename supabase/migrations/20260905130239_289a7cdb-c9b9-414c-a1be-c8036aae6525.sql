CREATE TABLE public.karigar_kyc (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  aadhaar_number TEXT NOT NULL,
  craft_type TEXT NOT NULL,
  address TEXT,
  photo_path TEXT,
  photo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.buyer_enquiries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_name TEXT NOT NULL,
  contact_person TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  requirement_type TEXT NOT NULL,
  estimated_quantity TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT INSERT ON public.karigar_kyc TO anon, authenticated;
GRANT ALL ON public.karigar_kyc TO service_role;
GRANT INSERT ON public.buyer_enquiries TO anon, authenticated;
GRANT ALL ON public.buyer_enquiries TO service_role;

ALTER TABLE public.karigar_kyc ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.buyer_enquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit karigar KYC" ON public.karigar_kyc FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Anyone can submit buyer enquiries" ON public.buyer_enquiries FOR INSERT TO anon, authenticated WITH CHECK (true);
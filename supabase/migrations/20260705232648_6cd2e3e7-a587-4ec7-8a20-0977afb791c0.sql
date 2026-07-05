CREATE TABLE public.brand_strategy (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id uuid NOT NULL UNIQUE REFERENCES public.clients(id) ON DELETE CASCADE,
  data jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.brand_strategy TO authenticated;
GRANT ALL ON public.brand_strategy TO service_role;

ALTER TABLE public.brand_strategy ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Access brand strategy" ON public.brand_strategy
  FOR ALL
  USING (public.has_client_access(client_id))
  WITH CHECK (public.has_client_access(client_id));

CREATE TRIGGER trg_brand_strategy_updated
  BEFORE UPDATE ON public.brand_strategy
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
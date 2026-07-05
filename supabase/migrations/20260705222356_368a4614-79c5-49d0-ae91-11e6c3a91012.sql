CREATE TABLE public.baselines (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  label text NOT NULL DEFAULT 'Baseline',
  overall_score integer NOT NULL DEFAULT 0,
  category_scores jsonb NOT NULL DEFAULT '{}'::jsonb,
  audits_count integer NOT NULL DEFAULT 0,
  findings_count integer NOT NULL DEFAULT 0,
  issues_count integer NOT NULL DEFAULT 0,
  notes text,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.baselines TO authenticated;
GRANT ALL ON public.baselines TO service_role;

ALTER TABLE public.baselines ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can view client baselines"
  ON public.baselines FOR SELECT
  USING (public.has_client_access(client_id));

CREATE POLICY "Members can create client baselines"
  ON public.baselines FOR INSERT
  WITH CHECK (public.has_client_access(client_id));

CREATE POLICY "Members can update client baselines"
  ON public.baselines FOR UPDATE
  USING (public.has_client_access(client_id));

CREATE POLICY "Members can delete client baselines"
  ON public.baselines FOR DELETE
  USING (public.has_client_access(client_id));

CREATE INDEX idx_baselines_client ON public.baselines(client_id, created_at DESC);
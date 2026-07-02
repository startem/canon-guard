-- Governance: rules, audit schedules, approval roles (scoped per client)

CREATE TABLE public.governance_rules (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id uuid NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  severity public.severity_level NOT NULL DEFAULT 'medium',
  category text NOT NULL DEFAULT 'brand-consistency',
  consequences text,
  enabled boolean NOT NULL DEFAULT true,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.governance_rules TO authenticated;
GRANT ALL ON public.governance_rules TO service_role;
ALTER TABLE public.governance_rules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Members manage governance rules for their clients"
  ON public.governance_rules FOR ALL
  USING (public.has_client_access(client_id))
  WITH CHECK (public.has_client_access(client_id));
CREATE TRIGGER update_governance_rules_updated_at
  BEFORE UPDATE ON public.governance_rules
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.audit_schedules (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id uuid NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  audit_type text NOT NULL,
  frequency text NOT NULL DEFAULT 'weekly',
  day_of_week text,
  day_of_month integer,
  time_of_day text NOT NULL DEFAULT '09:00',
  next_run timestamptz,
  last_run timestamptz,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.audit_schedules TO authenticated;
GRANT ALL ON public.audit_schedules TO service_role;
ALTER TABLE public.audit_schedules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Members manage audit schedules for their clients"
  ON public.audit_schedules FOR ALL
  USING (public.has_client_access(client_id))
  WITH CHECK (public.has_client_access(client_id));
CREATE TRIGGER update_audit_schedules_updated_at
  BEFORE UPDATE ON public.audit_schedules
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.approval_roles (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id uuid NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  role_name text NOT NULL,
  assignee text,
  requires_messaging boolean NOT NULL DEFAULT false,
  requires_visuals boolean NOT NULL DEFAULT false,
  requires_legal boolean NOT NULL DEFAULT false,
  priority integer NOT NULL DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.approval_roles TO authenticated;
GRANT ALL ON public.approval_roles TO service_role;
ALTER TABLE public.approval_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Members manage approval roles for their clients"
  ON public.approval_roles FOR ALL
  USING (public.has_client_access(client_id))
  WITH CHECK (public.has_client_access(client_id));
CREATE TRIGGER update_approval_roles_updated_at
  BEFORE UPDATE ON public.approval_roles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
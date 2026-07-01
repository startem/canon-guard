
-- ===== Enums =====
CREATE TYPE public.app_role AS ENUM ('owner','admin','editor','viewer');
CREATE TYPE public.client_status AS ENUM ('active','inactive','draft');
CREATE TYPE public.audit_status AS ENUM ('pending','running','completed','failed');
CREATE TYPE public.severity_level AS ENUM ('low','medium','high','critical');
CREATE TYPE public.approval_status AS ENUM ('approved','pending','rejected');

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$
LANGUAGE plpgsql SET search_path = public;

-- ===== Profiles =====
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  full_name text,
  avatar_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- ===== Agencies =====
CREATE TABLE public.agencies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  owner_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  logo_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.agencies TO authenticated;
GRANT ALL ON public.agencies TO service_role;
ALTER TABLE public.agencies ENABLE ROW LEVEL SECURITY;

-- ===== Agency members =====
CREATE TABLE public.agency_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agency_id uuid NOT NULL REFERENCES public.agencies(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL DEFAULT 'viewer',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (agency_id, user_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.agency_members TO authenticated;
GRANT ALL ON public.agency_members TO service_role;
ALTER TABLE public.agency_members ENABLE ROW LEVEL SECURITY;

-- ===== Clients (must exist before client-scoped helpers) =====
CREATE TABLE public.clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agency_id uuid NOT NULL REFERENCES public.agencies(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  industry text,
  website text,
  logo_url text,
  status public.client_status NOT NULL DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.clients TO authenticated;
GRANT ALL ON public.clients TO service_role;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

-- ===== Security definer helpers =====
CREATE OR REPLACE FUNCTION public.has_agency_access(_agency_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.agency_members
    WHERE agency_id = _agency_id AND user_id = auth.uid()
  );
$$;

CREATE OR REPLACE FUNCTION public.has_agency_role(_agency_id uuid, _roles public.app_role[])
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.agency_members
    WHERE agency_id = _agency_id AND user_id = auth.uid() AND role = ANY(_roles)
  );
$$;

CREATE OR REPLACE FUNCTION public.has_client_access(_client_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.clients c
    JOIN public.agency_members m ON m.agency_id = c.agency_id
    WHERE c.id = _client_id AND m.user_id = auth.uid()
  );
$$;

CREATE OR REPLACE FUNCTION public.shares_agency(_other uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.agency_members a
    JOIN public.agency_members b ON a.agency_id = b.agency_id
    WHERE a.user_id = auth.uid() AND b.user_id = _other
  );
$$;

-- ===== Profiles policies =====
CREATE POLICY "View own or shared-agency profiles" ON public.profiles FOR SELECT
  USING (id = auth.uid() OR public.shares_agency(id));
CREATE POLICY "Insert own profile" ON public.profiles FOR INSERT
  WITH CHECK (id = auth.uid());
CREATE POLICY "Update own profile" ON public.profiles FOR UPDATE
  USING (id = auth.uid()) WITH CHECK (id = auth.uid());

-- ===== Agencies policies =====
CREATE POLICY "View agencies I belong to" ON public.agencies FOR SELECT
  USING (public.has_agency_access(id));
CREATE POLICY "Create own agency" ON public.agencies FOR INSERT
  WITH CHECK (owner_id = auth.uid());
CREATE POLICY "Owners/admins update agency" ON public.agencies FOR UPDATE
  USING (public.has_agency_role(id, ARRAY['owner','admin']::public.app_role[]));
CREATE POLICY "Owner deletes agency" ON public.agencies FOR DELETE
  USING (owner_id = auth.uid());

-- ===== Agency members policies =====
CREATE POLICY "View members of my agencies" ON public.agency_members FOR SELECT
  USING (public.has_agency_access(agency_id));
CREATE POLICY "Owners/admins add members" ON public.agency_members FOR INSERT
  WITH CHECK (public.has_agency_role(agency_id, ARRAY['owner','admin']::public.app_role[]));
CREATE POLICY "Owners/admins update members" ON public.agency_members FOR UPDATE
  USING (public.has_agency_role(agency_id, ARRAY['owner','admin']::public.app_role[]));
CREATE POLICY "Owners/admins remove members" ON public.agency_members FOR DELETE
  USING (public.has_agency_role(agency_id, ARRAY['owner','admin']::public.app_role[]));

-- ===== Clients policies =====
CREATE POLICY "View clients in my agencies" ON public.clients FOR SELECT
  USING (public.has_agency_access(agency_id));
CREATE POLICY "Members manage clients" ON public.clients FOR INSERT
  WITH CHECK (public.has_agency_role(agency_id, ARRAY['owner','admin','editor']::public.app_role[]));
CREATE POLICY "Members update clients" ON public.clients FOR UPDATE
  USING (public.has_agency_role(agency_id, ARRAY['owner','admin','editor']::public.app_role[]));
CREATE POLICY "Members delete clients" ON public.clients FOR DELETE
  USING (public.has_agency_role(agency_id, ARRAY['owner','admin']::public.app_role[]));
CREATE TRIGGER trg_clients_updated BEFORE UPDATE ON public.clients
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ===== Color tokens =====
CREATE TABLE public.color_tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  name text NOT NULL, description text, hex text NOT NULL, rgb text, cmyk text,
  usage jsonb NOT NULL DEFAULT '[]', category text NOT NULL DEFAULT 'primary',
  accessibility jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.color_tokens TO authenticated;
GRANT ALL ON public.color_tokens TO service_role;
ALTER TABLE public.color_tokens ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Access color tokens" ON public.color_tokens FOR ALL
  USING (public.has_client_access(client_id)) WITH CHECK (public.has_client_access(client_id));
CREATE TRIGGER trg_color_tokens_updated BEFORE UPDATE ON public.color_tokens
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ===== Messaging pillars =====
CREATE TABLE public.messaging_pillars (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  name text NOT NULL, description text, definition text,
  examples jsonb NOT NULL DEFAULT '[]', keywords jsonb NOT NULL DEFAULT '[]',
  required_coverage int NOT NULL DEFAULT 0, current_coverage int NOT NULL DEFAULT 0,
  asset_types jsonb NOT NULL DEFAULT '[]', priority text NOT NULL DEFAULT 'medium', icon text,
  created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.messaging_pillars TO authenticated;
GRANT ALL ON public.messaging_pillars TO service_role;
ALTER TABLE public.messaging_pillars ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Access messaging pillars" ON public.messaging_pillars FOR ALL
  USING (public.has_client_access(client_id)) WITH CHECK (public.has_client_access(client_id));
CREATE TRIGGER trg_messaging_pillars_updated BEFORE UPDATE ON public.messaging_pillars
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ===== Boilerplate items =====
CREATE TABLE public.boilerplate_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  name text NOT NULL, type text, content text, version text DEFAULT '1.0',
  regions jsonb NOT NULL DEFAULT '[]', audiences jsonb NOT NULL DEFAULT '[]',
  approval_status public.approval_status NOT NULL DEFAULT 'pending', usage_guidelines text,
  created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.boilerplate_items TO authenticated;
GRANT ALL ON public.boilerplate_items TO service_role;
ALTER TABLE public.boilerplate_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Access boilerplate" ON public.boilerplate_items FOR ALL
  USING (public.has_client_access(client_id)) WITH CHECK (public.has_client_access(client_id));
CREATE TRIGGER trg_boilerplate_updated BEFORE UPDATE ON public.boilerplate_items
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ===== Legal items =====
CREATE TABLE public.legal_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  name text NOT NULL, type text, content text,
  regions jsonb NOT NULL DEFAULT '[]', products jsonb NOT NULL DEFAULT '[]',
  mandatory boolean NOT NULL DEFAULT false, placement jsonb NOT NULL DEFAULT '[]',
  expiry_date date, approval_status public.approval_status NOT NULL DEFAULT 'pending',
  risk_level public.severity_level NOT NULL DEFAULT 'low',
  created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.legal_items TO authenticated;
GRANT ALL ON public.legal_items TO service_role;
ALTER TABLE public.legal_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Access legal items" ON public.legal_items FOR ALL
  USING (public.has_client_access(client_id)) WITH CHECK (public.has_client_access(client_id));
CREATE TRIGGER trg_legal_updated BEFORE UPDATE ON public.legal_items
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ===== Audits =====
CREATE TABLE public.audits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  type text NOT NULL, title text, score int,
  status public.audit_status NOT NULL DEFAULT 'pending', summary text, input_context jsonb,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(), completed_at timestamptz
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.audits TO authenticated;
GRANT ALL ON public.audits TO service_role;
ALTER TABLE public.audits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Access audits" ON public.audits FOR ALL
  USING (public.has_client_access(client_id)) WITH CHECK (public.has_client_access(client_id));

-- ===== Audit findings =====
CREATE TABLE public.audit_findings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  audit_id uuid NOT NULL REFERENCES public.audits(id) ON DELETE CASCADE,
  title text NOT NULL, description text,
  severity public.severity_level NOT NULL DEFAULT 'medium', category text,
  recommendation text, status text NOT NULL DEFAULT 'open',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.audit_findings TO authenticated;
GRANT ALL ON public.audit_findings TO service_role;
ALTER TABLE public.audit_findings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Access audit findings" ON public.audit_findings FOR ALL
  USING (public.has_client_access((SELECT client_id FROM public.audits WHERE id = audit_id)))
  WITH CHECK (public.has_client_access((SELECT client_id FROM public.audits WHERE id = audit_id)));

-- ===== Issues =====
CREATE TABLE public.issues (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  audit_id uuid REFERENCES public.audits(id) ON DELETE SET NULL,
  title text NOT NULL, description text,
  severity public.severity_level NOT NULL DEFAULT 'medium', status text NOT NULL DEFAULT 'open',
  category text, due_date date, assignee uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.issues TO authenticated;
GRANT ALL ON public.issues TO service_role;
ALTER TABLE public.issues ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Access issues" ON public.issues FOR ALL
  USING (public.has_client_access(client_id)) WITH CHECK (public.has_client_access(client_id));
CREATE TRIGGER trg_issues_updated BEFORE UPDATE ON public.issues
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ===== Notifications =====
CREATE TABLE public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agency_id uuid NOT NULL REFERENCES public.agencies(id) ON DELETE CASCADE,
  client_id uuid REFERENCES public.clients(id) ON DELETE CASCADE,
  title text NOT NULL, message text,
  severity public.severity_level NOT NULL DEFAULT 'low', category text,
  read boolean NOT NULL DEFAULT false, created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.notifications TO authenticated;
GRANT ALL ON public.notifications TO service_role;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Access notifications" ON public.notifications FOR ALL
  USING (public.has_agency_access(agency_id)) WITH CHECK (public.has_agency_access(agency_id));

-- ===== New user handler =====
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE _agency_id uuid; _name text;
BEGIN
  _name := COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email,'@',1));
  INSERT INTO public.profiles (id, email, full_name) VALUES (NEW.id, NEW.email, _name);
  INSERT INTO public.agencies (name, owner_id) VALUES (_name || '''s Agency', NEW.id)
    RETURNING id INTO _agency_id;
  INSERT INTO public.agency_members (agency_id, user_id, role) VALUES (_agency_id, NEW.id, 'owner');
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

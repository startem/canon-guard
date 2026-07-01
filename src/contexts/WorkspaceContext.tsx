import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./AuthContext";

export interface Agency {
  id: string;
  name: string;
  owner_id: string;
  logo_url: string | null;
}

export interface Client {
  id: string;
  agency_id: string;
  name: string;
  description: string | null;
  industry: string | null;
  website: string | null;
  logo_url: string | null;
  status: "active" | "inactive" | "draft";
}

interface WorkspaceContextType {
  agencies: Agency[];
  currentAgency: Agency | null;
  setCurrentAgencyId: (id: string) => void;
  clients: Client[];
  currentClient: Client | null;
  setCurrentClientId: (id: string | null) => void;
  role: string | null;
  loading: boolean;
  refreshClients: () => Promise<void>;
  refreshAgencies: () => Promise<void>;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

const AGENCY_KEY = "bp_current_agency";
const CLIENT_KEY = "bp_current_client";

export const WorkspaceProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [currentAgencyId, setAgencyIdState] = useState<string | null>(null);
  const [currentClientId, setClientIdState] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshAgencies = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from("agencies")
      .select("id, name, owner_id, logo_url")
      .order("created_at", { ascending: true });
    const list = (data ?? []) as Agency[];
    setAgencies(list);
    setAgencyIdState((prev) => {
      const stored = localStorage.getItem(AGENCY_KEY);
      if (prev && list.some((a) => a.id === prev)) return prev;
      if (stored && list.some((a) => a.id === stored)) return stored;
      return list[0]?.id ?? null;
    });
  }, [user]);

  const refreshClients = useCallback(async () => {
    if (!currentAgencyId) {
      setClients([]);
      return;
    }
    const { data } = await supabase
      .from("clients")
      .select("id, agency_id, name, description, industry, website, logo_url, status")
      .eq("agency_id", currentAgencyId)
      .order("created_at", { ascending: true });
    setClients((data ?? []) as Client[]);
  }, [currentAgencyId]);

  // Load agencies on auth
  useEffect(() => {
    if (!user) {
      setAgencies([]);
      setClients([]);
      setAgencyIdState(null);
      setClientIdState(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    refreshAgencies().finally(() => setLoading(false));
  }, [user, refreshAgencies]);

  // Load role + clients when agency changes
  useEffect(() => {
    if (!currentAgencyId || !user) return;
    localStorage.setItem(AGENCY_KEY, currentAgencyId);
    supabase
      .from("agency_members")
      .select("role")
      .eq("agency_id", currentAgencyId)
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data }) => setRole(data?.role ?? null));
    refreshClients();
  }, [currentAgencyId, user, refreshClients]);

  // Keep selected client valid
  useEffect(() => {
    setClientIdState((prev) => {
      const stored = localStorage.getItem(CLIENT_KEY);
      if (prev && clients.some((c) => c.id === prev)) return prev;
      if (stored && clients.some((c) => c.id === stored)) return stored;
      return clients[0]?.id ?? null;
    });
  }, [clients]);

  const setCurrentAgencyId = (id: string) => {
    setAgencyIdState(id);
    setClientIdState(null);
    localStorage.removeItem(CLIENT_KEY);
  };

  const setCurrentClientId = (id: string | null) => {
    setClientIdState(id);
    if (id) localStorage.setItem(CLIENT_KEY, id);
    else localStorage.removeItem(CLIENT_KEY);
  };

  const currentAgency = agencies.find((a) => a.id === currentAgencyId) ?? null;
  const currentClient = clients.find((c) => c.id === currentClientId) ?? null;

  return (
    <WorkspaceContext.Provider
      value={{
        agencies,
        currentAgency,
        setCurrentAgencyId,
        clients,
        currentClient,
        setCurrentClientId,
        role,
        loading,
        refreshClients,
        refreshAgencies,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
};

export const useWorkspace = () => {
  const ctx = useContext(WorkspaceContext);
  if (!ctx) throw new Error("useWorkspace must be used within a WorkspaceProvider");
  return ctx;
};
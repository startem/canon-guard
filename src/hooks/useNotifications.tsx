import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useWorkspace } from "@/contexts/WorkspaceContext";

export type NotificationSeverity = "low" | "medium" | "high" | "critical";

export interface AppNotification {
  id: string;
  agency_id: string;
  client_id: string | null;
  title: string;
  message: string;
  severity: NotificationSeverity;
  category: string;
  read: boolean;
  created_at: string;
}

export const useNotifications = () => {
  const { currentAgency, currentClient } = useWorkspace();
  const agencyId = currentAgency?.id ?? null;
  const clientId = currentClient?.id ?? null;

  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!agencyId) {
      setNotifications([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    let query = supabase
      .from("notifications")
      .select("*")
      .eq("agency_id", agencyId)
      .order("created_at", { ascending: false });
    const { data } = await query;
    setNotifications((data ?? []) as AppNotification[]);
    setLoading(false);
  }, [agencyId]);

  useEffect(() => {
    load();
  }, [load]);

  // Realtime updates for this agency
  useEffect(() => {
    if (!agencyId) return;
    const channel = supabase
      .channel(`notifications-${agencyId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "notifications", filter: `agency_id=eq.${agencyId}` },
        () => load()
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [agencyId, load]);

  const markAsRead = useCallback(async (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    await supabase.from("notifications").update({ read: true }).eq("id", id);
  }, []);

  const markAllAsRead = useCallback(async () => {
    if (!agencyId) return;
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    await supabase.from("notifications").update({ read: true }).eq("agency_id", agencyId).eq("read", false);
  }, [agencyId]);

  const remove = useCallback(async (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    await supabase.from("notifications").delete().eq("id", id);
  }, []);

  return { notifications, loading, clientId, markAsRead, markAllAsRead, remove, reload: load };
};

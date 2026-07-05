import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useWorkspace } from '@/contexts/WorkspaceContext';

// A flexible per-client store for the 6-step Strategy Builder flow.
// Each page owns a "section" key inside the JSONB `data` blob.
export type StrategySection =
  | 'strategy'
  | 'positioning'
  | 'personality'
  | 'identity'
  | 'experience'
  | 'visibility';

export type StrategyData = Partial<Record<StrategySection, any>>;

export const useBrandStrategy = () => {
  const { currentClient } = useWorkspace();
  const clientId = currentClient?.id ?? null;

  const [data, setData] = useState<StrategyData>({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    if (!clientId) {
      setData({});
      return;
    }
    setLoading(true);
    const { data: row } = await supabase
      .from('brand_strategy')
      .select('data')
      .eq('client_id', clientId)
      .maybeSingle();
    setData(((row?.data as StrategyData) ?? {}) as StrategyData);
    setLoading(false);
  }, [clientId]);

  useEffect(() => {
    load();
  }, [load]);

  // Persist a single section, merging with whatever else is stored.
  const saveSection = useCallback(
    async (section: StrategySection, value: any): Promise<boolean> => {
      if (!clientId) return false;
      setSaving(true);
      const next: StrategyData = { ...data, [section]: value };
      const { error } = await supabase
        .from('brand_strategy')
        .upsert({ client_id: clientId, data: next }, { onConflict: 'client_id' });
      if (!error) setData(next);
      setSaving(false);
      return !error;
    },
    [clientId, data]
  );

  return { clientId, data, loading, saving, reload: load, saveSection };
};
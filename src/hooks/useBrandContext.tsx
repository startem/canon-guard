import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useWorkspace } from '@/contexts/WorkspaceContext';

export interface Brand {
  id: string;
  name: string;
  type: 'main' | 'sub';
  parentId?: string;
  description: string;
  status: 'active' | 'inactive' | 'draft';
  createdAt: string;
  updatedAt: string;
  identity: {
    logoUrl?: string;
    colors: string[];
    fonts: string[];
    tone: string;
    personality: string[];
  };
  elements: {
    tagline?: string;
    mission?: string;
    vision?: string;
    values: string[];
  };
  naming: {
    guidelines: string;
    doNotUse: string[];
    approved: string[];
  };
}

export interface ColorToken {
  id: string;
  name: string;
  description: string;
  hex: string;
  rgb: string;
  cmyk: string;
  usage: string[];
  category: 'primary' | 'secondary' | 'accent' | 'neutral' | 'status';
  accessibility: {
    wcagAA: boolean;
    wcagAAA: boolean;
    contrastRatio: number;
  };
  brandId?: string;
}

export interface MessagingPillar {
  id: string;
  name: string;
  description: string;
  definition: string;
  examples: string[];
  keywords: string[];
  requiredCoverage: number;
  currentCoverage: number;
  assetTypes: string[];
  priority: 'high' | 'medium' | 'low';
  icon: string;
  brandId?: string;
}

export interface BoilerplateItem {
  id: string;
  name: string;
  type: string;
  content: string;
  version: string;
  regions: string[];
  audiences: string[];
  lastUpdated: string;
  approvalStatus: 'approved' | 'pending' | 'rejected';
  characterCount: number;
  usageGuidelines: string;
  brandId?: string;
}

export interface LegalItem {
  id: string;
  name: string;
  type: string;
  content: string;
  regions: string[];
  products: string[];
  mandatory: boolean;
  placement: string[];
  expiryDate?: string;
  lastReviewed: string;
  approvalStatus: 'approved' | 'pending' | 'rejected';
  riskLevel: 'low' | 'medium' | 'high';
  brandId?: string;
}

interface BrandContextType {
  // Brands
  brands: Brand[];
  selectedBrandId: string | null;
  addBrand: (brand: Brand) => void;
  updateBrand: (brand: Brand) => void;
  deleteBrand: (brandId: string) => void;
  setSelectedBrand: (brandId: string | null) => void;
  
  // Color Tokens
  colorTokens: ColorToken[];
  addColorToken: (token: ColorToken) => void;
  updateColorToken: (token: ColorToken) => void;
  deleteColorToken: (tokenId: string) => void;
  
  // Messaging Pillars
  messagingPillars: MessagingPillar[];
  addMessagingPillar: (pillar: MessagingPillar) => void;
  updateMessagingPillar: (pillar: MessagingPillar) => void;
  deleteMessagingPillar: (pillarId: string) => void;
  
  // Boilerplate
  boilerplateItems: BoilerplateItem[];
  addBoilerplateItem: (item: BoilerplateItem) => void;
  updateBoilerplateItem: (item: BoilerplateItem) => void;
  deleteBoilerplateItem: (itemId: string) => void;
  
  // Legal
  legalItems: LegalItem[];
  addLegalItem: (item: LegalItem) => void;
  updateLegalItem: (item: LegalItem) => void;
  deleteLegalItem: (itemId: string) => void;
  
  // Filtering
  getItemsByBrand: <T extends { brandId?: string }>(items: T[], brandId?: string) => T[];
}

const BrandContext = createContext<BrandContextType | undefined>(undefined);

export const useBrandContext = () => {
  const context = useContext(BrandContext);
  if (!context) {
    throw new Error('useBrandContext must be used within a BrandProvider');
  }
  return context;
};

interface BrandProviderProps {
  children: ReactNode;
}

// ---- DB <-> frontend mappers ----
const toColorToken = (r: any): ColorToken => ({
  id: r.id,
  name: r.name,
  description: r.description ?? '',
  hex: r.hex,
  rgb: r.rgb ?? '',
  cmyk: r.cmyk ?? '',
  usage: (r.usage as string[]) ?? [],
  category: r.category,
  accessibility: (r.accessibility as ColorToken['accessibility']) ?? { wcagAA: false, wcagAAA: false, contrastRatio: 0 },
  brandId: r.client_id,
});

const toPillar = (r: any): MessagingPillar => ({
  id: r.id,
  name: r.name,
  description: r.description ?? '',
  definition: r.definition ?? '',
  examples: (r.examples as string[]) ?? [],
  keywords: (r.keywords as string[]) ?? [],
  requiredCoverage: r.required_coverage ?? 0,
  currentCoverage: r.current_coverage ?? 0,
  assetTypes: (r.asset_types as string[]) ?? [],
  priority: r.priority,
  icon: r.icon ?? '',
  brandId: r.client_id,
});

const toBoilerplate = (r: any): BoilerplateItem => ({
  id: r.id,
  name: r.name,
  type: r.type ?? '',
  content: r.content ?? '',
  version: r.version ?? '1.0',
  regions: (r.regions as string[]) ?? [],
  audiences: (r.audiences as string[]) ?? [],
  lastUpdated: r.updated_at ?? new Date().toISOString(),
  approvalStatus: r.approval_status,
  characterCount: (r.content ?? '').length,
  usageGuidelines: r.usage_guidelines ?? '',
  brandId: r.client_id,
});

const toLegal = (r: any): LegalItem => ({
  id: r.id,
  name: r.name,
  type: r.type ?? '',
  content: r.content ?? '',
  regions: (r.regions as string[]) ?? [],
  products: (r.products as string[]) ?? [],
  mandatory: r.mandatory ?? false,
  placement: (r.placement as string[]) ?? [],
  expiryDate: r.expiry_date ?? undefined,
  lastReviewed: r.updated_at ?? new Date().toISOString(),
  approvalStatus: r.approval_status,
  riskLevel: r.risk_level,
  brandId: r.client_id,
});

export const BrandProvider = ({ children }: BrandProviderProps) => {
  const { currentClient } = useWorkspace();
  const clientId = currentClient?.id ?? null;

  const [brands, setBrands] = useState<Brand[]>([]);
  const [selectedBrandId, setSelectedBrandId] = useState<string | null>(null);
  const [colorTokens, setColorTokens] = useState<ColorToken[]>([]);
  const [messagingPillars, setMessagingPillars] = useState<MessagingPillar[]>([]);
  const [boilerplateItems, setBoilerplateItems] = useState<BoilerplateItem[]>([]);
  const [legalItems, setLegalItems] = useState<LegalItem[]>([]);

  // ---- loaders ----
  const loadColors = useCallback(async () => {
    if (!clientId) { setColorTokens([]); return; }
    const { data } = await supabase.from('color_tokens').select('*').eq('client_id', clientId).order('created_at');
    setColorTokens((data ?? []).map(toColorToken));
  }, [clientId]);

  const loadPillars = useCallback(async () => {
    if (!clientId) { setMessagingPillars([]); return; }
    const { data } = await supabase.from('messaging_pillars').select('*').eq('client_id', clientId).order('created_at');
    setMessagingPillars((data ?? []).map(toPillar));
  }, [clientId]);

  const loadBoilerplate = useCallback(async () => {
    if (!clientId) { setBoilerplateItems([]); return; }
    const { data } = await supabase.from('boilerplate_items').select('*').eq('client_id', clientId).order('created_at');
    setBoilerplateItems((data ?? []).map(toBoilerplate));
  }, [clientId]);

  const loadLegal = useCallback(async () => {
    if (!clientId) { setLegalItems([]); return; }
    const { data } = await supabase.from('legal_items').select('*').eq('client_id', clientId).order('created_at');
    setLegalItems((data ?? []).map(toLegal));
  }, [clientId]);

  useEffect(() => {
    loadColors();
    loadPillars();
    loadBoilerplate();
    loadLegal();
  }, [loadColors, loadPillars, loadBoilerplate, loadLegal]);

  // Brand operations (in-memory grouping within a client)
  const addBrand = (brand: Brand) => setBrands(prev => [...prev, brand]);
  const updateBrand = (brand: Brand) => setBrands(prev => prev.map(b => b.id === brand.id ? brand : b));
  const deleteBrand = (brandId: string) => setBrands(prev => prev.filter(b => b.id !== brandId));
  const setSelectedBrand = (brandId: string | null) => setSelectedBrandId(brandId);

  // Color Token operations
  const addColorToken = async (token: ColorToken) => {
    if (!clientId) return;
    await supabase.from('color_tokens').insert({
      client_id: clientId,
      name: token.name,
      description: token.description,
      hex: token.hex,
      rgb: token.rgb,
      cmyk: token.cmyk,
      usage: token.usage,
      category: token.category,
      accessibility: token.accessibility,
    });
    await loadColors();
  };
  const updateColorToken = async (token: ColorToken) => {
    await supabase.from('color_tokens').update({
      name: token.name,
      description: token.description,
      hex: token.hex,
      rgb: token.rgb,
      cmyk: token.cmyk,
      usage: token.usage,
      category: token.category,
      accessibility: token.accessibility,
    }).eq('id', token.id);
    await loadColors();
  };
  const deleteColorToken = async (tokenId: string) => {
    await supabase.from('color_tokens').delete().eq('id', tokenId);
    await loadColors();
  };

  // Messaging Pillar operations
  const addMessagingPillar = async (pillar: MessagingPillar) => {
    if (!clientId) return;
    await supabase.from('messaging_pillars').insert({
      client_id: clientId,
      name: pillar.name,
      description: pillar.description,
      definition: pillar.definition,
      examples: pillar.examples,
      keywords: pillar.keywords,
      required_coverage: pillar.requiredCoverage,
      current_coverage: pillar.currentCoverage,
      asset_types: pillar.assetTypes,
      priority: pillar.priority,
      icon: pillar.icon,
    });
    await loadPillars();
  };
  const updateMessagingPillar = async (pillar: MessagingPillar) => {
    await supabase.from('messaging_pillars').update({
      name: pillar.name,
      description: pillar.description,
      definition: pillar.definition,
      examples: pillar.examples,
      keywords: pillar.keywords,
      required_coverage: pillar.requiredCoverage,
      current_coverage: pillar.currentCoverage,
      asset_types: pillar.assetTypes,
      priority: pillar.priority,
      icon: pillar.icon,
    }).eq('id', pillar.id);
    await loadPillars();
  };
  const deleteMessagingPillar = async (pillarId: string) => {
    await supabase.from('messaging_pillars').delete().eq('id', pillarId);
    await loadPillars();
  };

  // Boilerplate operations
  const addBoilerplateItem = async (item: BoilerplateItem) => {
    if (!clientId) return;
    await supabase.from('boilerplate_items').insert({
      client_id: clientId,
      name: item.name,
      type: item.type,
      content: item.content,
      version: item.version,
      regions: item.regions,
      audiences: item.audiences,
      approval_status: item.approvalStatus,
      usage_guidelines: item.usageGuidelines,
    });
    await loadBoilerplate();
  };
  const updateBoilerplateItem = async (item: BoilerplateItem) => {
    await supabase.from('boilerplate_items').update({
      name: item.name,
      type: item.type,
      content: item.content,
      version: item.version,
      regions: item.regions,
      audiences: item.audiences,
      approval_status: item.approvalStatus,
      usage_guidelines: item.usageGuidelines,
    }).eq('id', item.id);
    await loadBoilerplate();
  };
  const deleteBoilerplateItem = async (itemId: string) => {
    await supabase.from('boilerplate_items').delete().eq('id', itemId);
    await loadBoilerplate();
  };

  // Legal operations
  const addLegalItem = async (item: LegalItem) => {
    if (!clientId) return;
    await supabase.from('legal_items').insert({
      client_id: clientId,
      name: item.name,
      type: item.type,
      content: item.content,
      regions: item.regions,
      products: item.products,
      mandatory: item.mandatory,
      placement: item.placement,
      expiry_date: item.expiryDate || null,
      approval_status: item.approvalStatus,
      risk_level: item.riskLevel,
    });
    await loadLegal();
  };
  const updateLegalItem = async (item: LegalItem) => {
    await supabase.from('legal_items').update({
      name: item.name,
      type: item.type,
      content: item.content,
      regions: item.regions,
      products: item.products,
      mandatory: item.mandatory,
      placement: item.placement,
      expiry_date: item.expiryDate || null,
      approval_status: item.approvalStatus,
      risk_level: item.riskLevel,
    }).eq('id', item.id);
    await loadLegal();
  };
  const deleteLegalItem = async (itemId: string) => {
    await supabase.from('legal_items').delete().eq('id', itemId);
    await loadLegal();
  };

  // Filtering helper — data is already scoped to the current client
  const getItemsByBrand = <T extends { brandId?: string }>(items: T[], _brandId?: string) => items;

  const value: BrandContextType = {
    brands,
    selectedBrandId,
    addBrand,
    updateBrand,
    deleteBrand,
    setSelectedBrand,
    colorTokens,
    addColorToken,
    updateColorToken,
    deleteColorToken,
    messagingPillars,
    addMessagingPillar,
    updateMessagingPillar,
    deleteMessagingPillar,
    boilerplateItems,
    addBoilerplateItem,
    updateBoilerplateItem,
    deleteBoilerplateItem,
    legalItems,
    addLegalItem,
    updateLegalItem,
    deleteLegalItem,
    getItemsByBrand,
  };

  return (
    <BrandContext.Provider value={value}>
      {children}
    </BrandContext.Provider>
  );
};
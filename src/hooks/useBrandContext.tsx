import { createContext, useContext, useState, ReactNode } from 'react';

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

export const BrandProvider = ({ children }: BrandProviderProps) => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [selectedBrandId, setSelectedBrandId] = useState<string | null>(null);
  const [colorTokens, setColorTokens] = useState<ColorToken[]>([]);
  const [messagingPillars, setMessagingPillars] = useState<MessagingPillar[]>([]);
  const [boilerplateItems, setBoilerplateItems] = useState<BoilerplateItem[]>([]);
  const [legalItems, setLegalItems] = useState<LegalItem[]>([]);

  // Brand operations
  const addBrand = (brand: Brand) => {
    setBrands(prev => [...prev, brand]);
  };

  const updateBrand = (brand: Brand) => {
    setBrands(prev => prev.map(b => b.id === brand.id ? brand : b));
  };

  const deleteBrand = (brandId: string) => {
    setBrands(prev => prev.filter(b => b.id !== brandId));
    // Also clean up related items
    setColorTokens(prev => prev.filter(item => item.brandId !== brandId));
    setMessagingPillars(prev => prev.filter(item => item.brandId !== brandId));
    setBoilerplateItems(prev => prev.filter(item => item.brandId !== brandId));
    setLegalItems(prev => prev.filter(item => item.brandId !== brandId));
  };

  const setSelectedBrand = (brandId: string | null) => {
    setSelectedBrandId(brandId);
  };

  // Color Token operations
  const addColorToken = (token: ColorToken) => {
    setColorTokens(prev => [...prev, { ...token, brandId: selectedBrandId || undefined }]);
  };

  const updateColorToken = (token: ColorToken) => {
    setColorTokens(prev => prev.map(t => t.id === token.id ? token : t));
  };

  const deleteColorToken = (tokenId: string) => {
    setColorTokens(prev => prev.filter(t => t.id !== tokenId));
  };

  // Messaging Pillar operations
  const addMessagingPillar = (pillar: MessagingPillar) => {
    setMessagingPillars(prev => [...prev, { ...pillar, brandId: selectedBrandId || undefined }]);
  };

  const updateMessagingPillar = (pillar: MessagingPillar) => {
    setMessagingPillars(prev => prev.map(p => p.id === pillar.id ? pillar : p));
  };

  const deleteMessagingPillar = (pillarId: string) => {
    setMessagingPillars(prev => prev.filter(p => p.id !== pillarId));
  };

  // Boilerplate operations
  const addBoilerplateItem = (item: BoilerplateItem) => {
    setBoilerplateItems(prev => [...prev, { ...item, brandId: selectedBrandId || undefined }]);
  };

  const updateBoilerplateItem = (item: BoilerplateItem) => {
    setBoilerplateItems(prev => prev.map(i => i.id === item.id ? item : i));
  };

  const deleteBoilerplateItem = (itemId: string) => {
    setBoilerplateItems(prev => prev.filter(i => i.id !== itemId));
  };

  // Legal operations
  const addLegalItem = (item: LegalItem) => {
    setLegalItems(prev => [...prev, { ...item, brandId: selectedBrandId || undefined }]);
  };

  const updateLegalItem = (item: LegalItem) => {
    setLegalItems(prev => prev.map(i => i.id === item.id ? item : i));
  };

  const deleteLegalItem = (itemId: string) => {
    setLegalItems(prev => prev.filter(i => i.id !== itemId));
  };

  // Filtering helper
  const getItemsByBrand = <T extends { brandId?: string }>(items: T[], brandId?: string) => {
    if (!brandId) return items;
    return items.filter(item => item.brandId === brandId);
  };

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
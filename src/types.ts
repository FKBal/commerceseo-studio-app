export type PlatformId = 'etsy' | 'amazon' | 'shopify' | 'ebay';

export interface PlatformConfig {
  id: PlatformId;
  name: string;
  shortName: string;
  description: string;
  limits: {
    title: number;
    description?: number;
    tags?: number;
    tagLength?: number;
    bullets?: number;
    bulletLength?: number;
    metaTitle?: number;
    metaDescription?: number;
  };
}

export interface GeneratedResult {
  title: string;
  tags?: string[];
  description?: string;
  bullets?: string[];
  searchTerms?: string;
  metaTitle?: string;
  metaDescription?: string;
  urlHandle?: string;
  itemSpecifics?: { label: string; value: string }[];
}

export type ToneOfVoice = 'Professional' | 'Luxury' | 'Casual' | 'Playful' | 'Minimalist';

export interface StoreProfile {
  id: string;
  name: string;
  platform: PlatformId;
  tone: ToneOfVoice;
  createdAt: number;
}

export interface HistoryEntry {
  id: number;
  platform: PlatformId;
  timestamp: string;
  result: GeneratedResult;
  storeId?: string;
  storeName?: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  features: string[];
  highlight?: boolean;
  badge?: string;
}

export interface ToastState {
  message: string;
  visible: boolean;
}

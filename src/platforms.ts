import type { PlatformConfig, PlatformId, GeneratedResult } from './types';

export const PLATFORMS: PlatformConfig[] = [
  {
    id: 'etsy',
    name: 'Etsy',
    shortName: 'Etsy',
    description: 'Handmade & vintage marketplace',
    limits: { title: 140, description: 500, tags: 13, tagLength: 20 },
  },
  {
    id: 'amazon',
    name: 'Amazon',
    shortName: 'Amazon',
    description: 'E-commerce marketplace',
    limits: { title: 75, bullets: 5, bulletLength: 125 },
  },
  {
    id: 'shopify',
    name: 'Shopify',
    shortName: 'Shopify',
    description: 'DTC store platform',
    limits: { title: 140, metaTitle: 60, metaDescription: 160 },
  },
  {
    id: 'ebay',
    name: 'eBay',
    shortName: 'eBay',
    description: 'Auction & marketplace',
    limits: { title: 80 },
  },
];

export function getPlatform(id: PlatformId): PlatformConfig {
  return PLATFORMS.find((p) => p.id === id) ?? PLATFORMS[0];
}

// ─── Mock generation pools ───────────────────────────────

const TITLE_PREFIXES = ['Handmade', 'Vintage', 'Custom', 'Personalized', 'Artisan', 'Premium', 'Professional', 'Classic'];
const PRODUCT_NOUNS = ['Ceramic Mug', 'Leather Wallet', 'Wooden Clock', 'Linen Tote Bag', 'Soy Candle', 'Wall Hanging', 'Coaster Set', 'Knitted Scarf'];
const ATTRIBUTES = ['Eco Friendly', 'Gift for Her', 'Gift for Him', 'Housewarming', 'Birthday Present', 'Wedding Favor', 'Office Decor', 'Farmhouse Style', 'Modern Aesthetic', 'Sustainable', 'Handcrafted', 'Unique Design'];
const TAG_POOL = [
  'eco friendly gift', 'rustic home decor', 'handmade leather', 'minimalist wallet', 'custom name gift',
  'artisan coffee cup', 'farmhouse style mug', 'handcrafted pottery', 'organic home goods', 'boho wall hanging',
  'unique birthday', 'sustainable living', 'wedding favor gift', 'housewarming gift', 'modern office decor',
  'gift for coffee', 'natural clay mug', 'cozy kitchen decor', 'small batch goods', 'reusable eco cup',
];
const BRANDS = ['ArtisanCraft', 'NordicHome', 'PureGoods', 'Heritage Co', 'ModernCraft'];
const MATERIALS = ['Ceramic', 'Genuine Leather', 'Solid Wood', 'Organic Cotton', 'Stainless Steel'];
const CONDITIONS = ['New', 'New with tags', 'Refurbished', 'Pre-owned'];

const DESC_INTROS = [
  'Elevate your everyday ritual with this beautifully crafted piece.',
  'Add a touch of artisan charm to your home with this one-of-a-kind creation.',
  'Searching for that perfect gift? Look no further — this is sure to delight.',
  'Bring warmth and character to any space with this handcrafted treasure.',
];
const DESC_BODIES = [
  'Each piece is meticulously made by hand using time-honored techniques, ensuring no two are exactly alike. The subtle variations in texture and tone are what make your item truly yours.',
  'Crafted from premium, sustainably sourced materials, this piece is designed to last a lifetime. Its timeless design complements both modern and traditional interiors.',
  'Whether you are treating yourself or searching for a memorable gift, this item checks every box. Thoughtfully designed, expertly finished, and packed with care.',
];
const DESC_CLOSERS = [
  'Ships in 1-3 business days. Eco-friendly packaging. 30-day return policy.',
  'Ready to ship in 1-2 business days. Plastic-free packaging. 30-day satisfaction guarantee.',
  'Each order is gift-ready. Ships within 2 business days. 100% happiness guarantee.',
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 50);
}

// ─── Platform-specific generators ────────────────────────

function generateEtsy(description: string): GeneratedResult {
  const prefix = pick(TITLE_PREFIXES);
  const noun = pick(PRODUCT_NOUNS);
  const attrs = shuffle(ATTRIBUTES);
  let title = `${prefix} ${noun} - ${attrs.slice(0, 4).join(', ')}`;
  if (title.length > 140) title = title.slice(0, 137) + '...';

  const tags = shuffle(TAG_POOL.filter((t) => t.length <= 20)).slice(0, 13);
  const intro = pick(DESC_INTROS);
  const body = pick(DESC_BODIES);
  const closer = pick(DESC_CLOSERS);
  const trimmed = description.trim();
  const ref = trimmed ? ` Inspired by your vision of "${trimmed.slice(0, 80)}${trimmed.length > 80 ? '...' : ''}", ` : ' ';

  return { title, tags, description: `${intro}${ref}${body}\n\n${closer}` };
}

function generateAmazon(_description: string): GeneratedResult {
  const brand = pick(BRANDS);
  const noun = pick(PRODUCT_NOUNS);
  const attrs = shuffle(ATTRIBUTES);
  let title = `${brand} ${noun} - ${attrs.slice(0, 2).join(', ')}`;
  if (title.length > 75) title = title.slice(0, 72) + '...';

  const bullets = [
    `Premium ${pick(MATERIALS).toLowerCase()} construction for lasting durability and everyday use`,
    `Perfect ${pick(['gift', 'addition', 'accent piece'])} for ${pick(ATTRIBUTES).toLowerCase()} enthusiasts`,
    `Compact and lightweight design measures ${pick(['4 x 2 x 1', '6 x 3 x 2', '5 x 5 x 3'])} inches`,
    `Easy to clean and maintain with simple ${pick(['wipe down', 'hand wash', 'spot clean'])} care`,
    `Backed by 100% satisfaction guarantee and ${pick(['30-day', '60-day', '1-year'])} warranty`,
  ].map((b) => b.slice(0, 125));

  const searchTerms = shuffle(TAG_POOL).slice(0, 15).join(', ');

  return { title, bullets, searchTerms };
}

function generateShopify(description: string): GeneratedResult {
  const noun = pick(PRODUCT_NOUNS);
  const prefix = pick(TITLE_PREFIXES);
  const fullTitle = `${prefix} ${noun} - ${pick(ATTRIBUTES)}`;
  const metaTitle = fullTitle.slice(0, 60);
  const trimmed = description.trim();
  const ref = trimmed ? ` ${trimmed.slice(0, 80)}` : '';
  const metaDescription = `${pick(DESC_INTROS)}${ref}. ${pick(DESC_CLOSERS)}`.slice(0, 160);
  const urlHandle = slugify(fullTitle);

  return { title: fullTitle, metaTitle, metaDescription, urlHandle };
}

function generateEbay(_description: string): GeneratedResult {
  const brand = pick(BRANDS);
  const noun = pick(PRODUCT_NOUNS);
  const condition = pick(CONDITIONS);
  const material = pick(MATERIALS);
  let title = `${brand} ${noun} ${material} ${condition}`;
  if (title.length > 80) title = title.slice(0, 77) + '...';

  const itemSpecifics = [
    { label: 'Brand', value: brand },
    { label: 'Type', value: noun },
    { label: 'Material', value: material },
    { label: 'Condition', value: condition },
    { label: 'Country of Manufacture', value: pick(['United States', 'Germany', 'Japan', 'Italy']) },
  ];

  return { title, itemSpecifics };
}

export function generateListing(platform: PlatformId, description: string): GeneratedResult {
  switch (platform) {
    case 'etsy': return generateEtsy(description);
    case 'amazon': return generateAmazon(description);
    case 'shopify': return generateShopify(description);
    case 'ebay': return generateEbay(description);
  }
}

// ─── SEO Health Score ────────────────────────────────────

export interface ScoreBreakdown {
  label: string;
  score: number;
  positive: boolean;
}

export function calculateHealthScore(platform: PlatformId, result: GeneratedResult): { total: number; items: ScoreBreakdown[] } {
  const config = getPlatform(platform);
  const items: ScoreBreakdown[] = [];

  // Randomized base score between 68 and 94
  const baseScore = Math.floor(Math.random() * 27) + 68;
  let totalScore = baseScore;

  // Title length check
  const titleLen = result.title.length;
  const titleLimit = config.limits.title;
  if (titleLen >= titleLimit * 0.8 && titleLen <= titleLimit) {
    items.push({ label: 'Title length compliant', score: 20, positive: true });
  } else if (titleLen > titleLimit) {
    items.push({ label: 'Title exceeds limit', score: -15, positive: false });
    totalScore -= 10;
  } else {
    items.push({ label: 'Title too short', score: -10, positive: false });
    totalScore -= 5;
  }

  // Platform-specific checks with randomization
  if (platform === 'etsy') {
    const tagCount = result.tags?.length ?? 0;
    if (tagCount === 13) {
      items.push({ label: 'All 13 tags utilized', score: 20, positive: true });
    } else {
      items.push({ label: `Only ${tagCount}/13 tags used`, score: -10, positive: false });
      totalScore -= 8;
    }

    const descLen = result.description?.length ?? 0;
    if (descLen >= 200) {
      items.push({ label: 'Description well-detailed', score: 15, positive: true });
    } else {
      items.push({ label: 'Description needs more detail', score: -5, positive: false });
      totalScore -= 3;
    }

    const keywordBonus = Math.random() > 0.3;
    items.push({ label: 'Primary keywords detected', score: keywordBonus ? 15 : 8, positive: keywordBonus });
    if (!keywordBonus) totalScore -= 5;

    items.push({ label: 'Long-tail tags present', score: 10, positive: true });
  } else if (platform === 'amazon') {
    const bulletCount = result.bullets?.length ?? 0;
    if (bulletCount === 5) {
      items.push({ label: 'All 5 bullet points filled', score: 20, positive: true });
    } else {
      items.push({ label: `Only ${bulletCount}/5 bullets`, score: -10, positive: false });
      totalScore -= 8;
    }

    if (result.searchTerms && result.searchTerms.length > 50) {
      items.push({ label: 'Backend search terms present', score: 15, positive: true });
    } else {
      items.push({ label: 'Backend search terms sparse', score: -5, positive: false });
      totalScore -= 3;
    }

    const brandBonus = Math.random() > 0.2;
    items.push({ label: 'Brand name in title', score: brandBonus ? 15 : 10, positive: brandBonus });
    items.push({ label: 'Key features highlighted', score: 10, positive: true });
  } else if (platform === 'shopify') {
    const metaTitleLen = result.metaTitle?.length ?? 0;
    if (metaTitleLen <= 60 && metaTitleLen >= 30) {
      items.push({ label: 'Meta title optimal length', score: 20, positive: true });
    } else {
      items.push({ label: 'Meta title needs adjustment', score: -10, positive: false });
      totalScore -= 5;
    }

    const metaDescLen = result.metaDescription?.length ?? 0;
    if (metaDescLen <= 160 && metaDescLen >= 80) {
      items.push({ label: 'Meta description optimal', score: 15, positive: true });
    } else {
      items.push({ label: 'Meta description needs work', score: -5, positive: false });
      totalScore -= 3;
    }

    if (result.urlHandle) items.push({ label: 'URL slug generated', score: 15, positive: true });
    const handleBonus = Math.random() > 0.25;
    items.push({ label: 'SEO-friendly handle', score: handleBonus ? 10 : 5, positive: handleBonus });
  } else if (platform === 'ebay') {
    const specCount = result.itemSpecifics?.length ?? 0;
    if (specCount >= 4) {
      items.push({ label: `${specCount} item specifics filled`, score: 20, positive: true });
    } else {
      items.push({ label: 'Item specifics incomplete', score: -10, positive: false });
      totalScore -= 8;
    }

    items.push({ label: 'Brand in title', score: 15, positive: true });
    const condBonus = Math.random() > 0.15;
    items.push({ label: 'Condition specified', score: condBonus ? 15 : 10, positive: condBonus });
    items.push({ label: 'Material listed', score: 10, positive: true });
  }

  const total = Math.max(0, Math.min(100, totalScore));
  return { total, items };
}

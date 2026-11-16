export const DEFAULT_CAKE_CONFIG = {
  tiers: 2,
  shape: 'round',
  sponge: 'vanilla',
  finish: 'buttercream',
  primaryColor: '#F7E7CE',
  twoTone: true,
  secondaryColor: '#E8B4B8',
  hasDrip: true,
  dripFlavor: 'dark_chocolate',
  hasTopBorder: true,
  hasBottomBorder: true,
  toppings: ['strawberries', 'gold_leaf', 'macarons'],
  candles: 3,
  inscription: 'Happy Birthday',
  inscriptionFont: 'script',
  dietary: [],
};

export const SPONGE_FLAVORS = [
  { id: 'vanilla', name: 'Madagascar Vanilla Bean', color: '#F5E4B7', priceInr: 0, priceUsd: 0 },
  { id: 'chocolate', name: '70% Belgian Chocolate', color: '#4A2C1D', priceInr: 150, priceUsd: 5 },
  { id: 'red_velvet', name: 'Classic Red Velvet', color: '#8E2430', priceInr: 150, priceUsd: 5 },
  { id: 'lemon', name: 'Lemon Elderflower', color: '#F3E59A', priceInr: 200, priceUsd: 7 },
  { id: 'pistachio', name: 'Roasted Iranian Pistachio', color: '#A9BA7C', priceInr: 250, priceUsd: 9 },
];

export const FINISH_STYLES = [
  { id: 'buttercream', name: 'Smooth Swiss Buttercream', desc: 'Velvety matte finish', priceInr: 0, priceUsd: 0 },
  { id: 'rustic', name: 'Rustic Palette Knife', desc: 'Artisanal horizontal ridges', priceInr: 100, priceUsd: 4 },
  { id: 'fondant', name: 'Satin Rolled Fondant', desc: 'Porcelain-smooth couture finish', priceInr: 300, priceUsd: 12 },
  { id: 'naked', name: 'Semi-Naked Crumb Coat', desc: 'Exposed sponge layers', priceInr: 0, priceUsd: 0 },
];

export const COLOR_SWATCHES = [
  { name: 'Chantilly Cream', hex: '#FAF3E6' },
  { name: 'Champagne Silk', hex: '#F7E7CE' },
  { name: 'Dusty Rose', hex: '#E8B4B8' },
  { name: 'Blush Peony', hex: '#F2D2D7' },
  { name: 'Sage Pistachio', hex: '#CBD5C0' },
  { name: 'French Lavender', hex: '#D4C7E3' },
  { name: 'Robin Egg Blue', hex: '#C2DCE2' },
  { name: 'Espresso Ganache', hex: '#4B3226' },
];

export const DRIP_FLAVORS = [
  { id: 'dark_chocolate', name: 'Dark Belgian Ganache', color: '#2B170E' },
  { id: 'white_chocolate', name: 'Ivory White Chocolate', color: '#FBF6EA' },
  { id: 'salted_caramel', name: 'Salted Amber Caramel', color: '#C67628' },
  { id: 'pastel_pink', name: 'Ruby Pastel Rose', color: '#E598A3' },
];

export const TOPPING_OPTIONS = [
  { id: 'strawberries', name: 'Fresh Strawberries', priceInr: 200, priceUsd: 8 },
  { id: 'blueberries', name: 'Wild Blueberries', priceInr: 180, priceUsd: 7 },
  { id: 'macarons', name: 'French Macarons', priceInr: 250, priceUsd: 10 },
  { id: 'gold_leaf', name: '24K Edible Gold Leaf', priceInr: 300, priceUsd: 12 },
  { id: 'sprinkles', name: 'Pastel Confetti Sprinkles', priceInr: 120, priceUsd: 5 },
  { id: 'chocolate_shards', name: 'Tempered Choc Shards', priceInr: 200, priceUsd: 8 },
];

export const DIETARY_OPTIONS = ['Eggless', 'Gluten-Free', 'Nut-Free'];

export function calculatePricingAndServings(config, currency = 'INR') {
  const isInr = currency === 'INR';
  const lineItems = [];

  const basePrice = isInr ? 1200 : 45;
  lineItems.push({
    label: `Base Cake (6" Tier)`,
    amount: basePrice,
  });

  if (config.tiers > 1) {
    const extraTiers = config.tiers - 1;
    const tierCost = extraTiers * (isInr ? 900 : 35);
    const tierSizes = config.tiers === 2 ? '8" Base' : '8" + 10" Base';
    lineItems.push({
      label: `${extraTiers} Additional Tier${extraTiers > 1 ? 's' : ''} (${tierSizes})`,
      amount: tierCost,
    });
  }

  const sponge = SPONGE_FLAVORS.find((s) => s.id === config.sponge);
  if (sponge && (isInr ? sponge.priceInr : sponge.priceUsd) > 0) {
    lineItems.push({
      label: `${sponge.name} Sponge`,
      amount: isInr ? sponge.priceInr : sponge.priceUsd,
    });
  }

  const finish = FINISH_STYLES.find((f) => f.id === config.finish);
  if (finish && (isInr ? finish.priceInr : finish.priceUsd) > 0) {
    lineItems.push({
      label: finish.name,
      amount: isInr ? finish.priceInr : finish.priceUsd,
    });
  }

  if (config.hasDrip) {
    lineItems.push({
      label: 'Artisanal Ganache/Caramel Drip',
      amount: isInr ? 150 : 5,
    });
  }

  if (config.hasTopBorder || config.hasBottomBorder) {
    lineItems.push({
      label: 'Hand-Piped Cream Borders',
      amount: isInr ? 100 : 4,
    });
  }

  config.toppings.forEach((tId) => {
    const t = TOPPING_OPTIONS.find((item) => item.id === tId);
    if (t) {
      lineItems.push({
        label: t.name,
        amount: isInr ? t.priceInr : t.priceUsd,
      });
    }
  });

  if (config.candles > 0) {
    lineItems.push({
      label: `${config.candles} Gold Taper Candle${config.candles > 1 ? 's' : ''}`,
      amount: config.candles * (isInr ? 20 : 1),
    });
  }

  if (config.dietary.length > 0) {
    lineItems.push({
      label: `Specialty (${config.dietary.join(', ')})`,
      amount: config.dietary.length * (isInr ? 150 : 5),
    });
  }

  const total = lineItems.reduce((sum, item) => sum + item.amount, 0);

  const servingsMap = {
    1: '10–12',
    2: '28–34',
    3: '55–65',
  };

  return {
    total,
    currencySymbol: isInr ? '₹' : '$',
    formattedTotal: isInr
      ? `₹${total.toLocaleString('en-IN')}`
      : `$${total.toLocaleString('en-US')}`,
    lineItems,
    servings: servingsMap[config.tiers] || '12',
  };
}

export function generateRandomCake() {
  const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const shuffledToppings = [...TOPPING_OPTIONS]
    .sort(() => 0.5 - Math.random())
    .slice(0, Math.floor(Math.random() * 3) + 1)
    .map((t) => t.id);

  const primary = randomItem(COLOR_SWATCHES).hex;
  const secondary = randomItem(COLOR_SWATCHES).hex;

  return {
    tiers: randomItem([1, 2, 2, 3]),
    shape: randomItem(['round', 'round', 'square']),
    sponge: randomItem(SPONGE_FLAVORS).id,
    finish: randomItem(FINISH_STYLES).id,
    primaryColor: primary,
    twoTone: Math.random() > 0.35,
    secondaryColor: secondary,
    hasDrip: Math.random() > 0.3,
    dripFlavor: randomItem(DRIP_FLAVORS).id,
    hasTopBorder: Math.random() > 0.3,
    hasBottomBorder: Math.random() > 0.2,
    toppings: shuffledToppings,
    candles: Math.floor(Math.random() * 6),
    inscription: randomItem(['Happy Birthday', 'Bon Anniversaire', 'Celebrate!', 'Sweet Wishes', '']),
    inscriptionFont: randomItem(['script', 'serif', 'playful']),
    dietary: Math.random() > 0.7 ? ['Eggless'] : [],
  };
}

export function encodeConfigToUrl(config) {
  try {
    const json = JSON.stringify(config);
    const encoded = btoa(encodeURIComponent(json));
    const url = new URL(window.location.origin + '/');
    url.searchParams.set('design', encoded);
    return url.toString();
  } catch {
    return window.location.href;
  }
}

export function decodeConfigFromUrl() {
  try {
    const params = new URLSearchParams(window.location.search);
    const encoded = params.get('design');
    if (!encoded) return null;
    const json = decodeURIComponent(atob(encoded));
    return { ...DEFAULT_CAKE_CONFIG, ...JSON.parse(json) };
  } catch {
    return null;
  }
}

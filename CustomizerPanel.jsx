import React, { useState } from 'react';
import {
  Layers,
  Palette,
  Droplets,
  Sparkles,
  MessageSquareHeart,
  ChevronRight,
  ChevronLeft,
  ChevronUp,
  ChevronDown,
  ShoppingBag,
  Users,
  Check,
} from 'lucide-react';
import {
  SPONGE_FLAVORS,
  FINISH_STYLES,
  COLOR_SWATCHES,
  DRIP_FLAVORS,
  TOPPING_OPTIONS,
  DIETARY_OPTIONS,
  calculatePricingAndServings,
} from '../utils/cakeConfig';

const STEPS = [
  { id: 0, label: 'Size & Sponge', icon: Layers },
  { id: 1, label: 'Frosting', icon: Palette },
  { id: 2, label: 'Drips & Piping', icon: Droplets },
  { id: 3, label: 'Toppings', icon: Sparkles },
  { id: 4, label: 'Inscription', icon: MessageSquareHeart },
];

export default function CustomizerPanel({
  config,
  onChange,
  currency,
  setCurrency,
  onProceedToCheckout,
}) {
  const [activeStep, setActiveStep] = useState(0);
  const [showBreakdown, setShowBreakdown] = useState(false);

  const pricing = calculatePricingAndServings(config, currency);
  const isInr = currency === 'INR';

  const updateField = (key, value) => {
    onChange((prev) => ({ ...prev, [key]: value }));
  };

  const toggleArrayItem = (key, item) => {
    onChange((prev) => {
      const exists = prev[key].includes(item);
      return {
        ...prev,
        [key]: exists ? prev[key].filter((i) => i !== item) : [...prev[key], item],
      };
    });
  };

  return (
    <div className="flex flex-col h-full bg-[#FAF7F2] border-l border-[#2C1E16]/10">
      <div className="px-6 pt-5 pb-3 border-b border-[#2C1E16]/10 flex items-center justify-between bg-[#FAF7F2]">
        <div>
          <h1 className="font-serif text-2xl font-bold tracking-tight text-[#2C1E16]">
            L’Atelier Sucré
          </h1>
          <p className="text-xs text-[#2C1E16]/65">Bespoke Couture Cake Configurator</p>
        </div>

        <div className="flex items-center bg-[#EFE8DC] p-0.5 rounded-lg border border-[#2C1E16]/10 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setCurrency('INR')}
            className={`px-2.5 py-1 rounded-md transition ${
              isInr ? 'bg-[#2C1E16] text-[#FAF7F2]' : 'text-[#2C1E16]/70'
            }`}
          >
            ₹ INR
          </button>
          <button
            type="button"
            onClick={() => setCurrency('USD')}
            className={`px-2.5 py-1 rounded-md transition ${
              !isInr ? 'bg-[#2C1E16] text-[#FAF7F2]' : 'text-[#2C1E16]/70'
            }`}
          >
            $ USD
          </button>
        </div>
      </div>

      <div className="px-4 py-2.5 bg-[#F4EDE2] border-b border-[#2C1E16]/10 overflow-x-auto">
        <div className="flex items-center justify-between gap-1 min-w-max">
          {STEPS.map((step) => {
            const Icon = step.icon;
            const active = activeStep === step.id;
            return (
              <button
                key={step.id}
                type="button"
                onClick={() => setActiveStep(step.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition ${
                  active
                    ? 'bg-[#2C1E16] text-[#FAF7F2] shadow-sm'
                    : 'text-[#2C1E16]/70 hover:bg-[#2C1E16]/5'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${active ? 'text-[#D48C94]' : 'text-[#C59B43]'}`} />
                <span>{step.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
        {activeStep === 0 && (
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#2C1E16]/65 mb-2.5">
                1. Number of Tiers
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { count: 1, title: '1 Tier', sub: '6" Petite', serves: '10–12' },
                  { count: 2, title: '2 Tiers', sub: '6" + 8"', serves: '28–34' },
                  { count: 3, title: '3 Tiers', sub: '6" + 8" + 10"', serves: '55–65' },
                ].map((item) => {
                  const selected = config.tiers === item.count;
                  return (
                    <button
                      key={item.count}
                      type="button"
                      onClick={() => updateField('tiers', item.count)}
                      className={`p-3 rounded-2xl border text-left transition ${
                        selected
                          ? 'border-[#2C1E16] bg-[#2C1E16] text-[#FAF7F2] shadow-md'
                          : 'border-[#2C1E16]/15 bg-white/70 hover:border-[#C59B43]'
                      }`}
                    >
                      <div className="font-serif text-lg font-bold">{item.title}</div>
                      <div className={`text-xs ${selected ? 'text-[#D48C94]' : 'text-[#2C1E16]/65'}`}>
                        {item.sub}
                      </div>
                      <div className={`text-[11px] mt-1 ${selected ? 'text-[#FAF7F2]/80' : 'text-[#2C1E16]/50'}`}>
                        {item.serves} slices
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#2C1E16]/65 mb-2.5">
                2. Cake Silhouette
              </label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: 'round', label: 'Classic Cylinder Round' },
                  { id: 'square', label: 'Architectural Square' },
                ].map((shape) => {
                  const selected = config.shape === shape.id;
                  return (
                    <button
                      key={shape.id}
                      type="button"
                      onClick={() => updateField('shape', shape.id)}
                      className={`py-3 px-4 rounded-xl border text-sm font-medium transition ${
                        selected
                          ? 'border-[#D48C94] bg-[#D48C94]/15 text-[#2C1E16] font-semibold'
                          : 'border-[#2C1E16]/15 bg-white/70 text-[#2C1E16]/80'
                      }`}
                    >
                      {shape.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#2C1E16]/65 mb-2.5">
                3. Artisanal Sponge Flavor
              </label>
              <div className="space-y-2">
                {SPONGE_FLAVORS.map((flavor) => {
                  const selected = config.sponge === flavor.id;
                  const extra = isInr ? flavor.priceInr : flavor.priceUsd;
                  return (
                    <button
                      key={flavor.id}
                      type="button"
                      onClick={() => updateField('sponge', flavor.id)}
                      className={`w-full flex items-center justify-between p-3 rounded-xl border transition ${
                        selected
                          ? 'border-[#2C1E16] bg-white shadow-sm'
                          : 'border-[#2C1E16]/10 bg-white/50 hover:bg-white/80'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className="w-5 h-5 rounded-full border border-black/15 shadow-inner"
                          style={{ backgroundColor: flavor.color }}
                        />
                        <span className="text-sm font-medium">{flavor.name}</span>
                      </div>
                      <span className="text-xs font-semibold text-[#C59B43]">
                        {extra === 0 ? 'Included' : `+${isInr ? `₹${extra}` : `$${extra}`}`}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {activeStep === 1 && (
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#2C1E16]/65 mb-2.5">
                1. Frosting Texture & Finish
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {FINISH_STYLES.map((style) => {
                  const selected = config.finish === style.id;
                  const extra = isInr ? style.priceInr : style.priceUsd;
                  return (
                    <button
                      key={style.id}
                      type="button"
                      onClick={() => updateField('finish', style.id)}
                      className={`p-3 rounded-xl border text-left transition ${
                        selected
                          ? 'border-[#2C1E16] bg-white shadow-sm'
                          : 'border-[#2C1E16]/12 bg-white/50 hover:bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold">{style.name}</span>
                        {extra > 0 && (
                          <span className="text-[11px] font-bold text-[#C59B43]">
                            +{isInr ? `₹${extra}` : `$${extra}`}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#2C1E16]/60 mt-0.5">{style.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#2C1E16]/65">
                  2. Primary Frosting Palette
                </label>
                <label className="flex items-center gap-1.5 text-xs font-medium cursor-pointer">
                  <span>Custom Hex:</span>
                  <input
                    type="color"
                    value={config.primaryColor}
                    onChange={(e) => updateField('primaryColor', e.target.value)}
                    className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
                  />
                </label>
              </div>
              <div className="grid grid-cols-4 gap-2.5">
                {COLOR_SWATCHES.map((swatch) => {
                  const selected =
                    config.primaryColor.toLowerCase() === swatch.hex.toLowerCase();
                  return (
                    <button
                      key={swatch.hex}
                      type="button"
                      onClick={() => updateField('primaryColor', swatch.hex)}
                      className={`flex flex-col items-center p-2 rounded-xl border transition ${
                        selected
                          ? 'border-[#2C1E16] bg-white shadow-sm'
                          : 'border-transparent hover:bg-white/60'
                      }`}
                    >
                      <span
                        className="w-8 h-8 rounded-full border border-black/15 shadow-inner mb-1"
                        style={{ backgroundColor: swatch.hex }}
                      />
                      <span className="text-[11px] text-center leading-tight font-medium">
                        {swatch.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/80 border border-[#2C1E16]/10 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold">Two-Tone / Ombré Tiers</div>
                  <div className="text-xs text-[#2C1E16]/60">
                    Blend a contrasting base tier color (for 2+ tiers)
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={config.twoTone}
                  onChange={(e) => updateField('twoTone', e.target.checked)}
                  className="w-5 h-5 accent-[#2C1E16] rounded cursor-pointer"
                />
              </div>

              {config.twoTone && (
                <div className="pt-2 border-t border-[#2C1E16]/10 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {COLOR_SWATCHES.slice(0, 6).map((s) => (
                      <button
                        key={s.hex}
                        type="button"
                        onClick={() => updateField('secondaryColor', s.hex)}
                        className={`w-6 h-6 rounded-full border ${
                          config.secondaryColor.toLowerCase() === s.hex.toLowerCase()
                            ? 'ring-2 ring-[#2C1E16] ring-offset-1'
                            : 'border-black/20'
                        }`}
                        style={{ backgroundColor: s.hex }}
                      />
                    ))}
                  </div>
                  <input
                    type="color"
                    value={config.secondaryColor}
                    onChange={(e) => updateField('secondaryColor', e.target.value)}
                    className="w-7 h-7 rounded cursor-pointer"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {activeStep === 2 && (
          <div className="space-y-6">
            <div className="p-4 rounded-2xl bg-white/80 border border-[#2C1E16]/10 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold">Glossy Patisserie Drip</div>
                  <div className="text-xs text-[#2C1E16]/60">
                    Hand-poured ganache/caramel drips (+{isInr ? '₹150' : '$5'})
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={config.hasDrip}
                  onChange={(e) => updateField('hasDrip', e.target.checked)}
                  className="w-5 h-5 accent-[#2C1E16] cursor-pointer"
                />
              </div>

              {config.hasDrip && (
                <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-[#2C1E16]/10">
                  {DRIP_FLAVORS.map((drip) => {
                    const selected = config.dripFlavor === drip.id;
                    return (
                      <button
                        key={drip.id}
                        type="button"
                        onClick={() => updateField('dripFlavor', drip.id)}
                        className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-left transition ${
                          selected
                            ? 'border-[#2C1E16] bg-[#FAF7F2] font-semibold'
                            : 'border-[#2C1E16]/10 bg-white'
                        }`}
                      >
                        <span
                          className="w-5 h-5 rounded-full border border-black/20 shrink-0"
                          style={{ backgroundColor: drip.color }}
                        />
                        <span className="text-xs">{drip.name}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#2C1E16]/65">
                Hand-Piped Shell Borders
              </label>

              <label className="flex items-center justify-between p-3.5 rounded-xl bg-white/80 border border-[#2C1E16]/10 cursor-pointer">
                <div>
                  <div className="text-sm font-medium">Top Crown Cream Border</div>
                  <div className="text-xs text-[#2C1E16]/60">Delicate shell piping on upper rim</div>
                </div>
                <input
                  type="checkbox"
                  checked={config.hasTopBorder}
                  onChange={(e) => updateField('hasTopBorder', e.target.checked)}
                  className="w-5 h-5 accent-[#2C1E16]"
                />
              </label>

              <label className="flex items-center justify-between p-3.5 rounded-xl bg-white/80 border border-[#2C1E16]/10 cursor-pointer">
                <div>
                  <div className="text-sm font-medium">Base Tier Pearl/Shell Border</div>
                  <div className="text-xs text-[#2C1E16]/60">Classic framing around every tier base</div>
                </div>
                <input
                  type="checkbox"
                  checked={config.hasBottomBorder}
                  onChange={(e) => updateField('hasBottomBorder', e.target.checked)}
                  className="w-5 h-5 accent-[#2C1E16]"
                />
              </label>
            </div>
          </div>
        )}

        {activeStep === 3 && (
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#2C1E16]/65 mb-2.5">
                1. Artisanal Toppings (Multi-Select)
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                {TOPPING_OPTIONS.map((topping) => {
                  const selected = config.toppings.includes(topping.id);
                  const price = isInr ? topping.priceInr : topping.priceUsd;
                  return (
                    <button
                      key={topping.id}
                      type="button"
                      onClick={() => toggleArrayItem('toppings', topping.id)}
                      className={`p-3 rounded-xl border text-left transition flex items-start justify-between ${
                        selected
                          ? 'border-[#2C1E16] bg-[#2C1E16] text-[#FAF7F2]'
                          : 'border-[#2C1E16]/12 bg-white/75 hover:bg-white'
                      }`}
                    >
                      <div>
                        <div className="text-xs font-semibold">{topping.name}</div>
                        <div
                          className={`text-[11px] mt-1 ${
                            selected ? 'text-[#D48C94]' : 'text-[#C59B43] font-semibold'
                          }`}
                        >
                          +{isInr ? `₹${price}` : `$${price}`}
                        </div>
                      </div>
                      {selected && <Check className="w-4 h-4 text-[#D48C94] shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/80 border border-[#2C1E16]/10">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-semibold">Gold-Dipped Taper Candles</label>
                <span className="text-sm font-bold text-[#C59B43]">{config.candles} Candles</span>
              </div>
              <input
                type="range"
                min={0}
                max={10}
                value={config.candles}
                onChange={(e) => updateField('candles', Number(e.target.value))}
                className="w-full accent-[#2C1E16] cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-[#2C1E16]/50 mt-1">
                <span>None (0)</span>
                <span>5</span>
                <span>10</span>
              </div>
            </div>
          </div>
        )}

        {activeStep === 4 && (
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#2C1E16]/65">
                  1. Piped Cake Inscription
                </label>
                <span className="text-xs text-[#2C1E16]/55">
                  {config.inscription.length}/30
                </span>
              </div>
              <input
                type="text"
                maxLength={30}
                value={config.inscription}
                onChange={(e) => updateField('inscription', e.target.value)}
                placeholder="e.g., Happy Birthday Aarav"
                className="w-full px-4 py-3 rounded-xl bg-white border border-[#2C1E16]/20 text-sm focus:outline-none focus:border-[#2C1E16]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#2C1E16]/65 mb-2">
                2. Calligraphy Style
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {[
                  { id: 'script', label: 'Script', preview: 'font-script text-xl' },
                  { id: 'serif', label: 'Modern Serif', preview: 'font-serif text-base font-bold' },
                  { id: 'playful', label: 'Playful Sans', preview: 'font-sans text-sm font-bold' },
                ].map((f) => {
                  const selected = config.inscriptionFont === f.id;
                  return (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => updateField('inscriptionFont', f.id)}
                      className={`p-3 rounded-xl border text-center transition ${
                        selected
                          ? 'border-[#2C1E16] bg-white shadow-sm'
                          : 'border-[#2C1E16]/12 bg-white/50'
                      }`}
                    >
                      <div className={f.preview}>Aa</div>
                      <div className="text-[11px] text-[#2C1E16]/70 mt-1">{f.label}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#2C1E16]/65 mb-2">
                3. Dietary Preferences
              </label>
              <div className="flex flex-wrap gap-2">
                {DIETARY_OPTIONS.map((diet) => {
                  const selected = config.dietary.includes(diet);
                  return (
                    <button
                      key={diet}
                      type="button"
                      onClick={() => toggleArrayItem('dietary', diet)}
                      className={`px-3.5 py-2 rounded-full text-xs font-semibold border transition ${
                        selected
                          ? 'bg-[#2C1E16] text-[#FAF7F2] border-[#2C1E16]'
                          : 'bg-white text-[#2C1E16] border-[#2C1E16]/15 hover:border-[#C59B43]'
                      }`}
                    >
                      {selected ? `✓ ${diet}` : `+ ${diet}`}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        <div className="pt-4 flex items-center justify-between border-t border-[#2C1E16]/10">
          <button
            type="button"
            disabled={activeStep === 0}
            onClick={() => setActiveStep((s) => Math.max(0, s - 1))}
            className="flex items-center gap-1 px-3.5 py-2 rounded-xl text-xs font-semibold text-[#2C1E16] disabled:opacity-35 hover:bg-[#2C1E16]/5 transition"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          {activeStep < STEPS.length - 1 && (
            <button
              type="button"
              onClick={() => setActiveStep((s) => Math.min(STEPS.length - 1, s + 1))}
              className="flex items-center gap-1 px-4 py-2 rounded-xl text-xs font-semibold bg-[#EFE8DC] hover:bg-[#E4DAC8] text-[#2C1E16] transition"
            >
              <span>Next: {STEPS[activeStep + 1].label}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {showBreakdown && (
        <div className="px-6 py-3 bg-[#F3ECE1] border-t border-[#2C1E16]/10 max-h-48 overflow-y-auto text-xs space-y-1.5">
          <div className="font-bold uppercase tracking-wider text-[#2C1E16]/60 mb-1">
            Itemized Estimate
          </div>
          {pricing.lineItems.map((item, idx) => (
            <div key={idx} className="flex justify-between text-[#2C1E16]/85">
              <span>{item.label}</span>
              <span className="font-semibold">
                {pricing.currencySymbol}
                {item.amount.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      )}

      <div className="px-6 py-4 bg-white border-t border-[#2C1E16]/12 shadow-[0_-4px_20px_rgba(44,30,22,0.05)]">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif text-2xl font-bold text-[#2C1E16]">
                {pricing.formattedTotal}
              </span>
              <button
                type="button"
                onClick={() => setShowBreakdown((prev) => !prev)}
                className="flex items-center gap-0.5 text-[11px] font-semibold text-[#C59B43] hover:underline"
              >
                <span>Breakdown</span>
                {showBreakdown ? (
                  <ChevronDown className="w-3.5 h-3.5" />
                ) : (
                  <ChevronUp className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-[#2C1E16]/65">
              <Users className="w-3.5 h-3.5 text-[#D48C94]" />
              <span>Est. {pricing.servings} generous slices</span>
            </div>
          </div>

          <button
            type="button"
            onClick={onProceedToCheckout}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#2C1E16] hover:bg-[#3E2B20] text-[#FAF7F2] text-sm font-semibold shadow-md transition active:scale-[0.98]"
          >
            <ShoppingBag className="w-4 h-4 text-[#D48C94]" />
            <span>Proceed to Order</span>
          </button>
        </div>
      </div>
    </div>
  );
}

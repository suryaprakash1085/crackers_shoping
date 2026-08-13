import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/PageHeader";
import { settingsStore, AppCustom } from "@/lib/appSettings";
import { usePagePermissions } from "@/hooks/useAccessControl";
import { api } from "@/lib/api";
import { Palette, Type, Layers, Sparkles, ToggleLeft, RotateCcw, LayoutGrid, Table2 } from "lucide-react";

/* ── colour presets ──────────────────────────────────────────────── */
const PRIMARY_COLORS = [
  { name: "Festive Pink",   hsl: "330 82% 60%" },
  { name: "Crimson",        hsl: "0 85% 55%"   },
  { name: "Sunset Orange",  hsl: "24 95% 53%"  },
  { name: "Gold",           hsl: "45 95% 50%"  },
  { name: "Emerald",        hsl: "150 70% 45%" },
  { name: "Ocean Blue",     hsl: "210 90% 55%" },
  { name: "Royal Purple",   hsl: "270 80% 55%" },
  { name: "Hot Magenta",    hsl: "310 90% 55%" },
];

const SECONDARY_COLORS = [
  { name: "Violet",      hsl: "265 80% 58%" },
  { name: "Indigo",      hsl: "240 80% 58%" },
  { name: "Teal",        hsl: "175 70% 45%" },
  { name: "Rose",        hsl: "350 85% 60%" },
  { name: "Amber",       hsl: "38 92% 52%"  },
  { name: "Sky",         hsl: "200 88% 52%" },
];

const FONTS = [
  { label: "Space Grotesk",  value: "Space Grotesk, system-ui, sans-serif" },
  { label: "Poppins",        value: "Poppins, system-ui, sans-serif"       },
  { label: "Outfit",         value: "Outfit, system-ui, sans-serif"        },
  { label: "Inter",          value: "Inter, system-ui, sans-serif"         },
  { label: "Fredoka",        value: "Fredoka, system-ui, sans-serif"       },
  { label: "Georgia",        value: "Georgia, serif"                       },
  { label: "Courier New",    value: "'Courier New', monospace"             },
];

/* ── helpers ─────────────────────────────────────────────────────── */
const Section = ({ icon: Icon, title, children }: { icon: React.ElementType; title: string; children: React.ReactNode }) => (
  <Card className="p-6 space-y-5">
    <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
      <div className="w-7 h-7 rounded-lg bg-violet-50 border border-violet-100 grid place-items-center text-violet-500">
        <Icon className="w-3.5 h-3.5" />
      </div>
      <h3 className="font-semibold text-base text-slate-800">{title}</h3>
    </div>
    {children}
  </Card>
);

const ColorGrid = ({ colors, value, onChange }: {
  colors: { name: string; hsl: string }[];
  value: string;
  onChange: (h: string) => void;
}) => (
  <div className="grid grid-cols-4 gap-2">
    {colors.map((c) => (
      <button
        key={c.hsl}
        type="button"
        onClick={() => onChange(c.hsl)}
        title={c.name}
        className={`h-9 rounded-xl border-2 transition-all flex items-center justify-center gap-1.5 px-2 ${
          value === c.hsl
            ? "border-slate-800 scale-105 shadow-md"
            : "border-transparent hover:border-slate-300 hover:scale-105"
        }`}
        style={{ background: `hsl(${c.hsl} / 0.18)` }}
      >
        <span className="w-3.5 h-3.5 rounded-full shrink-0" style={{ background: `hsl(${c.hsl})` }} />
        <span className="text-[10px] font-medium text-slate-700 truncate hidden sm:block">{c.name}</span>
      </button>
    ))}
  </div>
);

const ToggleRow = ({ label, desc, checked, onChange }: {
  label: string; desc?: string; checked: boolean; onChange: (v: boolean) => void;
}) => (
  <div className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-slate-50 transition">
    <div>
      <p className="text-sm font-medium text-slate-800">{label}</p>
      {desc && <p className="text-xs text-slate-500 mt-0.5">{desc}</p>}
    </div>
    <Switch checked={checked} onCheckedChange={onChange} />
  </div>
);

/* ── main component ──────────────────────────────────────────────── */
export default function Customization() {
  const perms = usePagePermissions("customization");
  const [v, setV] = useState<AppCustom>(() => ({
    ...settingsStore.defaults.app,
    ...settingsStore.getApp(),
  }));
  const [saving, setSaving] = useState(false);

  // Load from API on mount (overrides localStorage if DB has data)
  useEffect(() => {
    api.get<{ data: Partial<AppCustom> }>("/app-settings")
      .then((res) => {
        if (res.data && Object.keys(res.data).length > 0) {
          const merged = {
            ...settingsStore.defaults.app,
            ...res.data,
            productCard: { ...settingsStore.defaults.app.productCard, ...(res.data as any).productCard },
            quickOrder: { ...settingsStore.defaults.app.quickOrder, ...(res.data as any).quickOrder },
          };
          settingsStore.setApp(merged);
          setV(merged);
        }
      })
      .catch(() => {}); // DB not ready — use localStorage fallback
  }, []);

  const upd = <K extends keyof AppCustom>(k: K, val: AppCustom[K]) =>
    setV((p) => ({ ...p, [k]: val }));

  const updProductCard = <K extends keyof AppCustom["productCard"]>(k: K, val: AppCustom["productCard"][K]) =>
    setV((p) => ({ ...p, productCard: { ...p.productCard, [k]: val } }));

  const updQuickOrder = <K extends keyof AppCustom["quickOrder"]>(k: K, val: AppCustom["quickOrder"][K]) =>
    setV((p) => ({ ...p, quickOrder: { ...p.quickOrder, [k]: val } }));

  const save = async () => {
    setSaving(true);
    try {
      await api.put("/app-settings", v);
      settingsStore.setApp(v);
      toast.success("Customization saved and applied!");
    } catch (err: any) {
      toast.error(err.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const reset = async () => {
    const def = settingsStore.defaults.app;
    setV(def);
    try {
      await api.put("/app-settings", def);
      settingsStore.setApp(def);
      toast.success("Reset to defaults");
    } catch {
      settingsStore.setApp(def);
      toast.success("Reset to defaults (offline)");
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="App Customization"
        description="Control the look, feel and animations of your store"
        icon={<Palette className="w-5 h-5" />}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* ── 1. Primary Colour ──────────────────────────────────────── */}
        <Section icon={Palette} title="Primary Colour">
          <ColorGrid colors={PRIMARY_COLORS} value={v.primaryHsl} onChange={(h) => upd("primaryHsl", h)} />
          <div>
            <Label className="text-xs text-slate-500">Custom HSL value</Label>
            <div className="flex gap-2 mt-1">
              <span className="w-8 h-9 rounded-lg border border-slate-200 shrink-0" style={{ background: `hsl(${v.primaryHsl})` }} />
              <Input
                value={v.primaryHsl}
                onChange={(e) => upd("primaryHsl", e.target.value)}
                placeholder="330 82% 60%"
              />
            </div>
          </div>
        </Section>

        {/* ── 2. Accent / Secondary Colour ──────────────────────────── */}
        <Section icon={Palette} title="Accent / Secondary Colour">
          <ColorGrid colors={SECONDARY_COLORS} value={v.accentSecondaryHsl} onChange={(h) => upd("accentSecondaryHsl", h)} />
          <div>
            <Label className="text-xs text-slate-500">Custom HSL value</Label>
            <div className="flex gap-2 mt-1">
              <span className="w-8 h-9 rounded-lg border border-slate-200 shrink-0" style={{ background: `hsl(${v.accentSecondaryHsl})` }} />
              <Input
                value={v.accentSecondaryHsl}
                onChange={(e) => upd("accentSecondaryHsl", e.target.value)}
                placeholder="265 80% 58%"
              />
            </div>
          </div>
        </Section>

        {/* ── 3. Typography ─────────────────────────────────────────── */}
        <Section icon={Type} title="Typography">
          <div>
            <Label>Font Family</Label>
            <Select value={v.fontFamily} onValueChange={(val) => upd("fontFamily", val)}>
              <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
              <SelectContent>
                {FONTS.map((f) => (
                  <SelectItem key={f.value} value={f.value} style={{ fontFamily: f.value }}>
                    {f.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Base Font Size — <span className="text-primary font-bold">{v.fontSize}px</span></Label>
            <input
              type="range" min={12} max={22} step={1} value={v.fontSize}
              onChange={(e) => upd("fontSize", Number(e.target.value))}
              className="w-full mt-2 accent-violet-500"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>12px — Small</span><span>17px — Default</span><span>22px — Large</span>
            </div>
          </div>
          <div>
            <Label>Site Tagline</Label>
            <Input
              className="mt-1"
              value={v.tagline}
              onChange={(e) => upd("tagline", e.target.value)}
              placeholder="Light up your celebrations"
            />
          </div>
          {/* live preview */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <p className="text-xs text-slate-400 mb-1">Live preview</p>
            <p style={{ fontFamily: v.fontFamily, fontSize: v.fontSize }}>
              The quick brown fox jumps over the lazy dog. 🎆
            </p>
          </div>
        </Section>

        {/* ── 4. Layout & Shape ─────────────────────────────────────── */}
        <Section icon={Layers} title="Layout & Shape">
          <div>
            <Label>
              Border Radius —{" "}
              <span className="text-primary font-bold">
                {v.borderRadius < 3 ? "Sharp" : v.borderRadius < 7 ? "Subtle" : v.borderRadius < 13 ? "Rounded" : "Pill"}
              </span>
            </Label>
            <input
              type="range" min={0} max={20} step={1} value={v.borderRadius}
              onChange={(e) => upd("borderRadius", Number(e.target.value))}
              className="w-full mt-2 accent-violet-500"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>Sharp</span><span>Subtle</span><span>Rounded</span><span>Pill</span>
            </div>
            {/* visual preview */}
            <div className="flex gap-3 mt-3">
              {["Button", "Card", "Badge"].map((label, i) => (
                <div
                  key={label}
                  className="flex-1 py-2 text-center text-xs font-semibold bg-primary/10 text-primary border border-primary/30"
                  style={{ borderRadius: `${(v.borderRadius / 10)}rem` }}
                >
                  {label}
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label>Card Shadow Intensity</Label>
            <div className="grid grid-cols-3 gap-2 mt-2">
              {(["none", "soft", "strong"] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => upd("shadowStyle", s)}
                  className={`p-3 rounded-xl border-2 text-sm font-medium capitalize transition ${
                    v.shadowStyle === s ? "border-violet-500 bg-violet-50 text-violet-700" : "border-slate-200 text-slate-600 hover:border-slate-300"
                  }`}
                  style={{
                    boxShadow: s === "none" ? "none" : s === "soft" ? "0 8px 24px -8px rgba(15,23,42,0.15)" : "0 16px 40px -8px rgba(15,23,42,0.3)",
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label>Navbar Style</Label>
            <div className="grid grid-cols-3 gap-2 mt-2">
              {(["light", "glass", "dark"] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => upd("navStyle", s)}
                  className={`p-3 rounded-xl border-2 text-sm font-medium capitalize transition ${
                    v.navStyle === s ? "border-violet-500 bg-violet-50 text-violet-700" : "border-slate-200 text-slate-600 hover:border-slate-300"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </Section>

        {/* ── 5. Animations & Effects ───────────────────────────────── */}
        <Section icon={Sparkles} title="Animations & Effects">
          <ToggleRow
            label="Fireworks Animation"
            desc="Full-screen rocket + burst animation on all user pages"
            checked={v.enableFireworks}
            onChange={(c) => upd("enableFireworks", c)}
          />
          <ToggleRow
            label="Floating Sparks"
            desc="Small glowing particles that float up from the bottom"
            checked={v.enableFloatingSparks}
            onChange={(c) => upd("enableFloatingSparks", c)}
          />
          <div>
            <Label>Animation Speed</Label>
            <div className="grid grid-cols-3 gap-2 mt-2">
              {(["slow", "normal", "fast"] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => upd("sparkSpeed", s)}
                  disabled={!v.enableFloatingSparks && !v.enableFireworks}
                  className={`p-2.5 rounded-xl border-2 text-sm font-medium capitalize transition ${
                    v.sparkSpeed === s ? "border-violet-500 bg-violet-50 text-violet-700" : "border-slate-200 text-slate-600 hover:border-slate-300"
                  } disabled:opacity-40 disabled:cursor-not-allowed`}
                >
                  {s === "slow" ? "🐢 Slow" : s === "normal" ? "✨ Normal" : "⚡ Fast"}
                </button>
              ))}
            </div>
          </div>
        </Section>

        {/* ── 6. Feature Toggles ────────────────────────────────────── */}
        <Section icon={ToggleLeft} title="Feature Toggles">
          <ToggleRow
            label="Shopping Cart"
            desc="Show the cart icon and allow adding items"
            checked={v.enableCart}
            onChange={(c) => upd("enableCart", c)}
          />
          <ToggleRow
            label="Offers Banner"
            desc="Show the promotional offers banner section"
            checked={v.showOffersBanner}
            onChange={(c) => upd("showOffersBanner", c)}
          />
        </Section>

        {/* ── 7. Product Page — Card Design ───────────────────────────── */}
        <Section icon={LayoutGrid} title="Product Page — Card Design">
          <div>
            <Label>Card Background</Label>
            <div className="grid grid-cols-3 gap-2 mt-2">
              {(["flat", "glass", "gradient"] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => updProductCard("style", s)}
                  className={`p-3 rounded-xl border-2 text-sm font-medium capitalize transition ${
                    v.productCard.style === s ? "border-violet-500 bg-violet-50 text-violet-700" : "border-slate-200 text-slate-600 hover:border-slate-300"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label>
              Card Corner Radius — <span className="text-primary font-bold">{v.productCard.radius}px</span>
            </Label>
            <input
              type="range" min={0} max={32} step={1} value={v.productCard.radius}
              onChange={(e) => updProductCard("radius", Number(e.target.value))}
              className="w-full mt-2 accent-violet-500"
            />
          </div>

          <div>
            <Label>Card Shadow</Label>
            <div className="grid grid-cols-3 gap-2 mt-2">
              {(["none", "soft", "strong"] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => updProductCard("shadow", s)}
                  className={`p-3 rounded-xl border-2 text-sm font-medium capitalize transition ${
                    v.productCard.shadow === s ? "border-violet-500 bg-violet-50 text-violet-700" : "border-slate-200 text-slate-600 hover:border-slate-300"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label>Product Image Size</Label>
            <div className="grid grid-cols-3 gap-2 mt-2">
              {(["compact", "normal", "large"] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => updProductCard("imageSize", s)}
                  className={`p-3 rounded-xl border-2 text-sm font-medium capitalize transition ${
                    v.productCard.imageSize === s ? "border-violet-500 bg-violet-50 text-violet-700" : "border-slate-200 text-slate-600 hover:border-slate-300"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label>Grid Columns (desktop)</Label>
            <div className="grid grid-cols-3 gap-2 mt-2">
              {([2, 3, 4] as const).map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => updProductCard("columns", n)}
                  className={`p-3 rounded-xl border-2 text-sm font-medium transition ${
                    v.productCard.columns === n ? "border-violet-500 bg-violet-50 text-violet-700" : "border-slate-200 text-slate-600 hover:border-slate-300"
                  }`}
                >
                  {n} columns
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label>Hover Effect</Label>
            <div className="grid grid-cols-3 gap-2 mt-2">
              {(["lift", "zoom", "none"] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => updProductCard("hoverEffect", s)}
                  className={`p-3 rounded-xl border-2 text-sm font-medium capitalize transition ${
                    v.productCard.hoverEffect === s ? "border-violet-500 bg-violet-50 text-violet-700" : "border-slate-200 text-slate-600 hover:border-slate-300"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <ToggleRow
            label="Show Product Badge"
            desc="Small ribbon (e.g. New/Bestseller) on the top-left of the card"
            checked={v.productCard.showBadge}
            onChange={(c) => updProductCard("showBadge", c)}
          />

          <div>
            <Label className="text-xs text-slate-500">Price Colour (blank = theme primary)</Label>
            <div className="flex gap-2 mt-1">
              <span
                className="w-8 h-9 rounded-lg border border-slate-200 shrink-0"
                style={{ background: v.productCard.priceColorHsl ? `hsl(${v.productCard.priceColorHsl})` : "hsl(var(--primary))" }}
              />
              <Input
                value={v.productCard.priceColorHsl}
                onChange={(e) => updProductCard("priceColorHsl", e.target.value)}
                placeholder="e.g. 150 70% 45%"
              />
            </div>
          </div>

          {/* live preview */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <p className="text-xs text-slate-400 mb-2">Live preview</p>
            <div
              className="w-40 p-4"
              style={{
                borderRadius: `${v.productCard.radius}px`,
                background: v.productCard.style === "flat" ? "#fff" : v.productCard.style === "glass" ? "linear-gradient(145deg, rgba(255,255,255,0.98), rgba(248,245,255,0.95))" : "linear-gradient(135deg, #fdf2f8 0%, #f5e8ff 50%, #ffe8d6 100%)",
                boxShadow: v.productCard.shadow === "none" ? "none" : v.productCard.shadow === "soft" ? "0 8px 24px -8px rgba(15,23,42,0.15)" : "0 16px 40px -8px rgba(15,23,42,0.3)",
                border: "1px solid #e2e8f0",
              }}
            >
              <div className="h-16 rounded-lg bg-slate-100 mb-2" />
              <p className="text-sm font-semibold">Sample Product</p>
              <p className="text-sm font-bold" style={{ color: v.productCard.priceColorHsl ? `hsl(${v.productCard.priceColorHsl})` : undefined }}>
                ₹499
              </p>
            </div>
          </div>
        </Section>

        {/* ── 8. Quick Order Page — Table Design ──────────────────────── */}
        <Section icon={Table2} title="Quick Order Page — Table Design">
          <div>
            <Label>Category Header Style</Label>
            <div className="grid grid-cols-3 gap-2 mt-2">
              {(["primary", "dark", "light"] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => updQuickOrder("headerStyle", s)}
                  className={`p-3 rounded-xl border-2 text-sm font-medium capitalize transition ${
                    v.quickOrder.headerStyle === s ? "border-violet-500 bg-violet-50 text-violet-700" : "border-slate-200 text-slate-600 hover:border-slate-300"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label>Row Style</Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {(["plain", "striped"] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => updQuickOrder("rowStyle", s)}
                  className={`p-3 rounded-xl border-2 text-sm font-medium capitalize transition ${
                    v.quickOrder.rowStyle === s ? "border-violet-500 bg-violet-50 text-violet-700" : "border-slate-200 text-slate-600 hover:border-slate-300"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label>Row Density</Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {(["compact", "comfortable"] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => updQuickOrder("density", s)}
                  className={`p-3 rounded-xl border-2 text-sm font-medium capitalize transition ${
                    v.quickOrder.density === s ? "border-violet-500 bg-violet-50 text-violet-700" : "border-slate-200 text-slate-600 hover:border-slate-300"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label>Product Image Size</Label>
            <div className="grid grid-cols-3 gap-2 mt-2">
              {(["small", "medium", "large"] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => updQuickOrder("imageSize", s)}
                  className={`p-3 rounded-xl border-2 text-sm font-medium capitalize transition ${
                    v.quickOrder.imageSize === s ? "border-violet-500 bg-violet-50 text-violet-700" : "border-slate-200 text-slate-600 hover:border-slate-300"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <ToggleRow
            label="Categories Expanded by Default"
            desc="Off = customers must tap each category to open it"
            checked={v.quickOrder.defaultExpanded}
            onChange={(c) => updQuickOrder("defaultExpanded", c)}
          />

          {/* live preview */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <p className="text-xs text-slate-400 mb-2">Live preview</p>
            <div className="rounded-lg overflow-hidden border border-slate-200">
              <div
                className="px-3 py-2 text-xs font-semibold uppercase tracking-wide"
                style={{
                  background: v.quickOrder.headerStyle === "primary" ? `hsl(${v.primaryHsl})` : v.quickOrder.headerStyle === "dark" ? "hsl(224 71% 12%)" : "hsl(210 40% 96%)",
                  color: v.quickOrder.headerStyle === "light" ? "hsl(224 71% 12%)" : "#fff",
                }}
              >
                Sample Category
              </div>
              {[0, 1].map((i) => (
                <div
                  key={i}
                  className={`px-3 flex items-center justify-between text-sm ${v.quickOrder.density === "compact" ? "py-1.5" : "py-3"}`}
                  style={{ background: v.quickOrder.rowStyle === "striped" && i % 2 === 0 ? "#f1f5f9" : "#fff" }}
                >
                  <span>Sample Product {i + 1}</span>
                  <span className="font-semibold">₹299</span>
                </div>
              ))}
            </div>
          </div>
        </Section>

      </div>

      {/* ── Save bar ──────────────────────────────────────────────────── */}
      {perms.put && (
        <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200 sticky bottom-4 shadow-lg">
          <div className="flex items-center gap-2">
            <Badge className="bg-violet-100 text-violet-700 border-violet-200">Live preview</Badge>
            <span className="text-sm text-slate-500">Changes apply to the site immediately on save</span>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={reset} disabled={saving} className="gap-1.5">
              <RotateCcw className="w-3.5 h-3.5" /> Reset defaults
            </Button>
            <Button onClick={save} size="lg" disabled={saving} className="bg-violet-600 hover:bg-violet-700 text-white min-w-[130px]">
              {saving ? "Saving…" : "Save & Apply"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

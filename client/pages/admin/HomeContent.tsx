import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Home as HomeIcon, Save, RotateCcw, Plus, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";
import { ImagePicker } from "@/components/admin/ImagePicker";
import { settingsStore, HomeSettings } from "@/lib/appSettings";
import { ICON_NAMES, Icon } from "@/lib/iconMap";

const inputCls = "bg-slate-50 border-slate-200 text-slate-900";
const sectionCard = "p-6 bg-white border-slate-200 space-y-4";
const UPLOAD_URL = "/api/page-content/upload";

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="space-y-1.5">
    <Label className="text-xs text-slate-400 uppercase tracking-wider">{label}</Label>
    {children}
  </div>
);

const IconSelect = ({ value, onChange }: { value: string; onChange: (v: string) => void }) => (
  <Select value={value} onValueChange={onChange}>
    <SelectTrigger className={inputCls}><SelectValue /></SelectTrigger>
    <SelectContent className="bg-white border-slate-200 text-slate-900 max-h-64">
      {ICON_NAMES.map((n) => (
        <SelectItem key={n} value={n}>
          <span className="inline-flex items-center gap-2"><Icon name={n} className="w-4 h-4" /> {n}</span>
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
);

const ShowToggle = ({ label, checked, onChange }: { label: string; checked: boolean; onChange: (b: boolean) => void }) => (
  <div className="flex items-center justify-between border border-slate-200 rounded-lg px-4 py-3 bg-slate-50">
    <div className="font-medium text-slate-900">{label}</div>
    <Switch checked={checked} onCheckedChange={onChange} />
  </div>
);

export default function HomeContent() {
  const [v, setV] = useState<HomeSettings>(settingsStore.getHome());
  const [saving, setSaving] = useState(false);
  const set = <K extends keyof HomeSettings>(k: K, val: HomeSettings[K]) => setV((p) => ({ ...p, [k]: val }));

  const save = async () => {
    setSaving(true);
    try {
      await settingsStore.setHome(v);
      toast.success("Home page updated for all visitors");
    } catch {
      toast.error("Saved locally, but couldn't reach the server — changes may not show for other visitors yet.");
    } finally {
      setSaving(false);
    }
  };
  const reset = () => { setV(settingsStore.defaults.home); toast.info("Reset — click Save to apply"); };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Home Page Content"
        description="Edit every section, text, and image on the home page"
        icon={<HomeIcon className="w-5 h-5" />}
        action={
          <div className="flex gap-2">
            <Button variant="outline" onClick={reset} className="border-slate-200 bg-slate-50 text-slate-700"><RotateCcw className="w-4 h-4 mr-2" />Reset</Button>
            <Button onClick={save} disabled={saving} className="bg-orange-600 hover:bg-orange-500"><Save className="w-4 h-4 mr-2" />{saving ? "Saving..." : "Save"}</Button>
          </div>
        }
      />

      <Tabs defaultValue="hero" className="w-full">
        <TabsList className="bg-slate-100 border border-slate-200 flex-wrap h-auto">
          <TabsTrigger value="hero">Hero</TabsTrigger>
          <TabsTrigger value="features">Feature Strip</TabsTrigger>
          <TabsTrigger value="featured">Best Sellers</TabsTrigger>
          <TabsTrigger value="offer">Offer Banner</TabsTrigger>
          <TabsTrigger value="why">Why Choose Us</TabsTrigger>
        </TabsList>

        <TabsContent value="hero" className="mt-4">
          <Card className={sectionCard}>
            <ShowToggle label="Show Hero Section" checked={v.hero.show} onChange={(b) => set("hero", { ...v.hero, show: b })} />
            <div className="grid md:grid-cols-2 gap-4">
              <Field label="Badge Text"><Input className={inputCls} value={v.hero.badge} onChange={(e) => set("hero", { ...v.hero, badge: e.target.value })} /></Field>
              <Field label="Accent Colour"><Input type="color" className={`${inputCls} h-10`} value={v.hero.accentHex} onChange={(e) => set("hero", { ...v.hero, accentHex: e.target.value })} /></Field>
              <Field label="Title"><Input className={inputCls} value={v.hero.title} onChange={(e) => set("hero", { ...v.hero, title: e.target.value })} /></Field>
              <Field label="Title Highlight"><Input className={inputCls} value={v.hero.titleHighlight} onChange={(e) => set("hero", { ...v.hero, titleHighlight: e.target.value })} /></Field>
            </div>
            <Field label="Subtitle"><Textarea className={inputCls} value={v.hero.subtitle} onChange={(e) => set("hero", { ...v.hero, subtitle: e.target.value })} /></Field>
            <div className="grid md:grid-cols-2 gap-4">
              <Field label="Primary Button Text"><Input className={inputCls} value={v.hero.ctaPrimary} onChange={(e) => set("hero", { ...v.hero, ctaPrimary: e.target.value })} /></Field>
              <Field label="Primary Button Link"><Input className={inputCls} value={v.hero.ctaPrimaryLink} onChange={(e) => set("hero", { ...v.hero, ctaPrimaryLink: e.target.value })} /></Field>
              <Field label="Secondary Button Text"><Input className={inputCls} value={v.hero.ctaSecondary} onChange={(e) => set("hero", { ...v.hero, ctaSecondary: e.target.value })} /></Field>
              <Field label="Secondary Button Link"><Input className={inputCls} value={v.hero.ctaSecondaryLink} onChange={(e) => set("hero", { ...v.hero, ctaSecondaryLink: e.target.value })} /></Field>
            </div>
            <ImagePicker label="Hero Image" value={v.hero.image} onChange={(url) => set("hero", { ...v.hero, image: url })} uploadUrl={UPLOAD_URL} />
          </Card>
        </TabsContent>

        <TabsContent value="features" className="mt-4">
          <Card className={sectionCard}>
            <ShowToggle label="Show Feature Strip" checked={v.featureStrip.show} onChange={(b) => set("featureStrip", { ...v.featureStrip, show: b })} />
            <div className="grid md:grid-cols-2 gap-4">
              {v.featureStrip.items.map((it, i) => (
                <Card key={i} className="p-4 bg-slate-50 border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <Field label="Icon"><IconSelect value={it.icon} onChange={(val) => {
                      const next = [...v.featureStrip.items]; next[i] = { ...it, icon: val };
                      set("featureStrip", { ...v.featureStrip, items: next });
                    }} /></Field>
                    <Button variant="ghost" size="icon" onClick={() => {
                      set("featureStrip", { ...v.featureStrip, items: v.featureStrip.items.filter((_, idx) => idx !== i) });
                    }} className="text-red-400 mt-4"><Trash2 className="w-4 h-4" /></Button>
                  </div>
                  <Field label="Title"><Input className={inputCls} value={it.title} onChange={(e) => {
                    const next = [...v.featureStrip.items]; next[i] = { ...it, title: e.target.value };
                    set("featureStrip", { ...v.featureStrip, items: next });
                  }} /></Field>
                  <Field label="Description"><Input className={inputCls} value={it.desc} onChange={(e) => {
                    const next = [...v.featureStrip.items]; next[i] = { ...it, desc: e.target.value };
                    set("featureStrip", { ...v.featureStrip, items: next });
                  }} /></Field>
                </Card>
              ))}
            </div>
            <Button variant="outline" onClick={() => set("featureStrip", { ...v.featureStrip, items: [...v.featureStrip.items, { icon: "Star", title: "", desc: "" }] })} className="border-slate-200 bg-slate-50 text-slate-700">
              <Plus className="w-4 h-4 mr-2" />Add Feature
            </Button>
          </Card>
        </TabsContent>

        <TabsContent value="featured" className="mt-4">
          <Card className={sectionCard}>
            <ShowToggle label="Show Best Sellers Section" checked={v.featured.show} onChange={(b) => set("featured", { ...v.featured, show: b })} />
            <div className="grid md:grid-cols-3 gap-4">
              <Field label="Eyebrow"><Input className={inputCls} value={v.featured.eyebrow} onChange={(e) => set("featured", { ...v.featured, eyebrow: e.target.value })} /></Field>
              <Field label="Title"><Input className={inputCls} value={v.featured.title} onChange={(e) => set("featured", { ...v.featured, title: e.target.value })} /></Field>
              <Field label="Title Highlight"><Input className={inputCls} value={v.featured.titleHighlight} onChange={(e) => set("featured", { ...v.featured, titleHighlight: e.target.value })} /></Field>
            </div>
            <p className="text-xs text-slate-400">Products shown here come from Admin → Products (best sellers auto-pull from your product list).</p>
          </Card>
        </TabsContent>

        <TabsContent value="offer" className="mt-4">
          <Card className={sectionCard}>
            <ShowToggle label="Show Offer Banner" checked={v.offer.show} onChange={(b) => set("offer", { ...v.offer, show: b })} />
            <div className="grid md:grid-cols-2 gap-4">
              <Field label="Badge Text"><Input className={inputCls} value={v.offer.badge} onChange={(e) => set("offer", { ...v.offer, badge: e.target.value })} /></Field>
              <Field label="Accent Colour"><Input type="color" className={`${inputCls} h-10`} value={v.offer.accentHex} onChange={(e) => set("offer", { ...v.offer, accentHex: e.target.value })} /></Field>
              <Field label="Title"><Input className={inputCls} value={v.offer.title} onChange={(e) => set("offer", { ...v.offer, title: e.target.value })} /></Field>
              <Field label="Title Highlight"><Input className={inputCls} value={v.offer.titleHighlight} onChange={(e) => set("offer", { ...v.offer, titleHighlight: e.target.value })} /></Field>
            </div>
            <Field label="Description"><Textarea className={inputCls} value={v.offer.description} onChange={(e) => set("offer", { ...v.offer, description: e.target.value })} /></Field>
            <div className="grid md:grid-cols-2 gap-4">
              <Field label="Button Text"><Input className={inputCls} value={v.offer.cta} onChange={(e) => set("offer", { ...v.offer, cta: e.target.value })} /></Field>
              <Field label="Button Link"><Input className={inputCls} value={v.offer.ctaLink} onChange={(e) => set("offer", { ...v.offer, ctaLink: e.target.value })} /></Field>
            </div>
            <ImagePicker label="Offer Image" value={v.offer.image} onChange={(url) => set("offer", { ...v.offer, image: url })} uploadUrl={UPLOAD_URL} />
          </Card>
        </TabsContent>

        <TabsContent value="why" className="mt-4">
          <Card className={sectionCard}>
            <ShowToggle label="Show Why Choose Us" checked={v.why.show} onChange={(b) => set("why", { ...v.why, show: b })} />
            <div className="grid md:grid-cols-2 gap-4">
              <Field label="Title"><Input className={inputCls} value={v.why.title} onChange={(e) => set("why", { ...v.why, title: e.target.value })} /></Field>
              <Field label="Title Highlight"><Input className={inputCls} value={v.why.titleHighlight} onChange={(e) => set("why", { ...v.why, titleHighlight: e.target.value })} /></Field>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {v.why.items.map((it, i) => (
                <Card key={i} className="p-4 bg-slate-50 border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <Field label="Icon"><IconSelect value={it.icon} onChange={(val) => {
                      const next = [...v.why.items]; next[i] = { ...it, icon: val };
                      set("why", { ...v.why, items: next });
                    }} /></Field>
                    <Button variant="ghost" size="icon" onClick={() => {
                      set("why", { ...v.why, items: v.why.items.filter((_, idx) => idx !== i) });
                    }} className="text-red-400 mt-4"><Trash2 className="w-4 h-4" /></Button>
                  </div>
                  <Field label="Title"><Input className={inputCls} value={it.title} onChange={(e) => {
                    const next = [...v.why.items]; next[i] = { ...it, title: e.target.value };
                    set("why", { ...v.why, items: next });
                  }} /></Field>
                  <Field label="Description"><Input className={inputCls} value={it.desc} onChange={(e) => {
                    const next = [...v.why.items]; next[i] = { ...it, desc: e.target.value };
                    set("why", { ...v.why, items: next });
                  }} /></Field>
                  <Field label="Colour Hue (0-360)"><Input className={inputCls} value={it.colorHue} onChange={(e) => {
                    const next = [...v.why.items]; next[i] = { ...it, colorHue: e.target.value };
                    set("why", { ...v.why, items: next });
                  }} /></Field>
                </Card>
              ))}
            </div>
            <Button variant="outline" onClick={() => set("why", { ...v.why, items: [...v.why.items, { icon: "Star", title: "", desc: "", colorHue: "200" }] })} className="border-slate-200 bg-slate-50 text-slate-700">
              <Plus className="w-4 h-4 mr-2" />Add Item
            </Button>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

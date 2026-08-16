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
import { Layers, Save, RotateCcw, Plus, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";
import { ImagePicker } from "@/components/admin/ImagePicker";
import { settingsStore, ServicesSettings } from "@/lib/appSettings";
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

export default function ServicesContent() {
  const [v, setV] = useState<ServicesSettings>(settingsStore.getServices());
  const [saving, setSaving] = useState(false);
  const set = <K extends keyof ServicesSettings>(k: K, val: ServicesSettings[K]) => setV((p) => ({ ...p, [k]: val }));

  const save = async () => {
    setSaving(true);
    try {
      await settingsStore.setServices(v);
      toast.success("Services page updated for all visitors");
    } catch {
      toast.error("Saved locally, but couldn't reach the server — changes may not show for other visitors yet.");
    } finally {
      setSaving(false);
    }
  };
  const reset = () => { setV(settingsStore.defaults.services); toast.info("Reset — click Save to apply"); };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Services Page Content"
        description="Edit every section, text, and image on the services page"
        icon={<Layers className="w-5 h-5" />}
        action={
          <div className="flex gap-2">
            <Button variant="outline" onClick={reset} className="border-slate-200 bg-slate-50 text-slate-700"><RotateCcw className="w-4 h-4 mr-2" />Reset</Button>
            <Button onClick={save} disabled={saving} className="bg-orange-600 hover:bg-orange-500"><Save className="w-4 h-4 mr-2" />{saving ? "Saving..." : "Save"}</Button>
          </div>
        }
      />

      <Tabs defaultValue="header" className="w-full">
        <TabsList className="bg-slate-100 border border-slate-200">
          <TabsTrigger value="header">Header</TabsTrigger>
          <TabsTrigger value="items">Service Cards</TabsTrigger>
          <TabsTrigger value="cta">CTA Banner</TabsTrigger>
        </TabsList>

        <TabsContent value="header" className="mt-4">
          <Card className={sectionCard}>
            <ShowToggle label="Show Header" checked={v.header.show} onChange={(b) => set("header", { ...v.header, show: b })} />
            <div className="grid md:grid-cols-3 gap-4">
              <Field label="Badge"><Input className={inputCls} value={v.header.badge} onChange={(e) => set("header", { ...v.header, badge: e.target.value })} /></Field>
              <Field label="Title"><Input className={inputCls} value={v.header.title} onChange={(e) => set("header", { ...v.header, title: e.target.value })} /></Field>
              <Field label="Title Highlight"><Input className={inputCls} value={v.header.titleHighlight} onChange={(e) => set("header", { ...v.header, titleHighlight: e.target.value })} /></Field>
            </div>
            <Field label="Description"><Textarea className={inputCls} value={v.header.description} onChange={(e) => set("header", { ...v.header, description: e.target.value })} /></Field>
          </Card>
        </TabsContent>

        <TabsContent value="items" className="mt-4">
          <Card className={sectionCard}>
            <ShowToggle label="Show Service Cards" checked={v.items.show} onChange={(b) => set("items", { ...v.items, show: b })} />
            <div className="grid md:grid-cols-2 gap-4">
              {v.items.list.map((it, i) => (
                <Card key={i} className="p-4 bg-slate-50 border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Card {i + 1}</span>
                    <Button variant="ghost" size="icon" onClick={() => {
                      set("items", { ...v.items, list: v.items.list.filter((_, idx) => idx !== i) });
                    }} className="text-red-400"><Trash2 className="w-4 h-4" /></Button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Icon"><IconSelect value={it.icon} onChange={(val) => {
                      const next = [...v.items.list]; next[i] = { ...it, icon: val };
                      set("items", { ...v.items, list: next });
                    }} /></Field>
                    <Field label="Colour Hue (0-360)"><Input className={inputCls} value={it.colorHue} onChange={(e) => {
                      const next = [...v.items.list]; next[i] = { ...it, colorHue: e.target.value };
                      set("items", { ...v.items, list: next });
                    }} /></Field>
                  </div>
                  <Field label="Title"><Input className={inputCls} value={it.title} onChange={(e) => {
                    const next = [...v.items.list]; next[i] = { ...it, title: e.target.value };
                    set("items", { ...v.items, list: next });
                  }} /></Field>
                  <Field label="Description"><Textarea className={inputCls} value={it.desc} onChange={(e) => {
                    const next = [...v.items.list]; next[i] = { ...it, desc: e.target.value };
                    set("items", { ...v.items, list: next });
                  }} /></Field>
                  <Field label="Learn More Link"><Input className={inputCls} value={it.link} onChange={(e) => {
                    const next = [...v.items.list]; next[i] = { ...it, link: e.target.value };
                    set("items", { ...v.items, list: next });
                  }} /></Field>
                  <ImagePicker
                    label="Card Image (optional — overrides icon)"
                    value={it.image}
                    onChange={(url) => {
                      const next = [...v.items.list]; next[i] = { ...it, image: url };
                      set("items", { ...v.items, list: next });
                    }}
                    uploadUrl={UPLOAD_URL}
                  />
                </Card>
              ))}
            </div>
            <Button
              variant="outline"
              onClick={() => set("items", { ...v.items, list: [...v.items.list, { icon: "Star", image: "", title: "", desc: "", link: "/contact", colorHue: "200" }] })}
              className="border-slate-200 bg-slate-50 text-slate-700"
            >
              <Plus className="w-4 h-4 mr-2" />Add Service Card
            </Button>
          </Card>
        </TabsContent>

        <TabsContent value="cta" className="mt-4">
          <Card className={sectionCard}>
            <ShowToggle label="Show CTA Banner" checked={v.cta.show} onChange={(b) => set("cta", { ...v.cta, show: b })} />
            <Field label="Title"><Input className={inputCls} value={v.cta.title} onChange={(e) => set("cta", { ...v.cta, title: e.target.value })} /></Field>
            <Field label="Description"><Textarea className={inputCls} value={v.cta.description} onChange={(e) => set("cta", { ...v.cta, description: e.target.value })} /></Field>
            <div className="grid md:grid-cols-2 gap-4">
              <Field label="Button Text"><Input className={inputCls} value={v.cta.buttonLabel} onChange={(e) => set("cta", { ...v.cta, buttonLabel: e.target.value })} /></Field>
              <Field label="Button Link"><Input className={inputCls} value={v.cta.buttonLink} onChange={(e) => set("cta", { ...v.cta, buttonLink: e.target.value })} /></Field>
            </div>
            <ImagePicker label="Banner Image" value={v.cta.image} onChange={(url) => set("cta", { ...v.cta, image: url })} uploadUrl={UPLOAD_URL} />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

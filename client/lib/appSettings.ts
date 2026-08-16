import { useEffect, useState } from "react";
import { api } from "./api";

export type AppCustom = {
  // Theme
  primaryHsl: string;
  accentSecondaryHsl: string;
  tagline: string;

  // Typography
  fontFamily: string;
  fontSize: number;

  // Layout & shape
  borderRadius: number;        // 0–20 → maps to rem on --radius
  shadowStyle: "none" | "soft" | "strong";
  navStyle: "light" | "glass" | "dark";

  // Animations & effects
  enableFireworks: boolean;
  enableFloatingSparks: boolean;
  sparkSpeed: "slow" | "normal" | "fast";

  // Features
  enableCart: boolean;
  showOffersBanner: boolean;

  // Product page — card design
  productCard: ProductCardDesign;

  // Quick Order page — table/list design
  quickOrder: QuickOrderDesign;
};

export type ProductCardDesign = {
  style: "flat" | "glass" | "gradient";
  radius: number;              // 0–24 → px
  shadow: "none" | "soft" | "strong";
  imageSize: "compact" | "normal" | "large";
  columns: 2 | 3 | 4;
  hoverEffect: "lift" | "zoom" | "none";
  showBadge: boolean;
  priceColorHsl: string;       // "" = use theme primary
};

export type QuickOrderDesign = {
  headerStyle: "primary" | "dark" | "light";
  rowStyle: "plain" | "striped";
  density: "compact" | "comfortable";
  imageSize: "small" | "medium" | "large";
  defaultExpanded: boolean;
};

type PdfSettings = {
  headerTitle: string;
  footerNote: string;
  terms: string;
  accentHex: string;
  companyName: string;
  companyPhone: string;
  companyEmail: string;
  companyAddress: string;
  baseFontSize: number;
  gstin: string;
  companyLogoUrl: string;
  invoicePrefix: string;
  placeOfSupply: string;
  bankName: string;
  bankAccName: string;
  bankAccNo: string;
  bankAccType: string;
  bankIfsc: string;
  bankUpi: string;
  qrDataUrl: string;
  authorizedFor: string;
  thankYouNote: string;
  supportContact: string;
  copyLabel: string;
  showBankDetails: boolean;
  showQr: boolean;
  showThankYou: boolean;
};

type EmailSettings = {
  smtpHost: string;
  smtpPort: number;
  smtpUser: string;
  smtpPass: string;
  fromName: string;
  fromEmail: string;
  secure: boolean;
};

/* ---------------- Home / About CMS ---------------- */

export type HomeSettings = {
  hero: {
    show: boolean;
    badge: string;
    title: string;
    titleHighlight: string;
    subtitle: string;
    ctaPrimary: string;
    ctaPrimaryLink: string;
    ctaSecondary: string;
    ctaSecondaryLink: string;
    image: string;
    accentHex: string;
  };
  featureStrip: {
    show: boolean;
    items: { icon: string; title: string; desc: string }[];
  };
  featured: {
    show: boolean;
    eyebrow: string;
    title: string;
    titleHighlight: string;
  };
  offer: {
    show: boolean;
    badge: string;
    title: string;
    titleHighlight: string;
    description: string;
    cta: string;
    ctaLink: string;
    image: string;
    accentHex: string;
  };
  why: {
    show: boolean;
    title: string;
    titleHighlight: string;
    items: { icon: string; title: string; desc: string; colorHue: string }[];
  };
};

export type AboutSettings = {
  header: {
    show: boolean;
    badge: string;
    title: string;
    titleHighlight: string;
    description: string;
  };
  pillars: {
    show: boolean;
    items: { icon: string; title: string; desc: string }[];
  };
  timeline: {
    show: boolean;
    title: string;
    titleHighlight: string;
    items: { year: string; title: string; desc: string }[];
  };
  stats: {
    show: boolean;
    items: { n: string; l: string }[];
  };
};

export type ServicesSettings = {
  header: {
    show: boolean;
    badge: string;
    title: string;
    titleHighlight: string;
    description: string;
  };
  items: {
    show: boolean;
    list: { icon: string; image: string; title: string; desc: string; link: string; colorHue: string }[];
  };
  cta: {
    show: boolean;
    title: string;
    description: string;
    buttonLabel: string;
    buttonLink: string;
    image: string;
  };
};

const APP_KEY = "app_customization";
const PDF_KEY = "pdf_settings";
const EMAIL_KEY = "email_settings";
const HOME_KEY = "home_settings";
const ABOUT_KEY = "about_settings";
const SERVICES_KEY = "services_settings";

const defaults = {
  app: {
    primaryHsl: "330 82% 60%",
    accentSecondaryHsl: "265 80% 58%",
    tagline: "Light up your celebrations",
    fontFamily: "Space Grotesk, system-ui, sans-serif",
    fontSize: 16,
    borderRadius: 9,
    shadowStyle: "soft",
    navStyle: "light",
    enableFireworks: true,
    enableFloatingSparks: true,
    sparkSpeed: "normal",
    enableCart: true,
    showOffersBanner: true,
    productCard: {
      style: "flat",
      radius: 16,
      shadow: "soft",
      imageSize: "normal",
      columns: 3,
      hoverEffect: "lift",
      showBadge: true,
      priceColorHsl: "",
    },
    quickOrder: {
      headerStyle: "primary",
      rowStyle: "plain",
      density: "comfortable",
      imageSize: "medium",
      defaultExpanded: true,
    },
  } as AppCustom,
  pdf: {
    headerTitle: "TAX INVOICE",
    footerNote: "Thank you for your order! Light it up safely.",
    terms: "• Invoice was created on a computer and is invalid without the signature and seal.\n• Goods once sold will not be taken back or exchanged.\n• Subject to local jurisdiction.",
    accentHex: "#ed4599", // matches default Primary Colour (330 82% 60%) — PDF stays in the site's 2-colour palette instead of a third accent
    companyPhone: "+91 98765 43210",
    companyEmail: "info@firecrackers.com",
    companyAddress: "123 Festival St, Sivakasi, Tamil Nadu",
    baseFontSize: 10,
    gstin: "33ABCDE1234F1Z5",
    companyLogoUrl: "",
    invoicePrefix: "ORD",
    placeOfSupply: "Tamil Nadu (33)",
    bankName: "ICICI Bank",
    bankAccName: "Fire Crackers Co.",
    bankAccNo: "0747020303030486",
    bankAccType: "SAVINGS",
    bankIfsc: "ICBA0000747",
    bankUpi: "firecrackers@icici",
    qrDataUrl: "",
    authorizedFor: "For Fire Crackers Co.",
    thankYouNote: "Thank You for your business with Fire Crackers Co.",
    supportContact: "+91 98765 43210",
    copyLabel: "Original Copy",
    showBankDetails: true,
    showQr: true,
    showThankYou: true,
  } as PdfSettings,
  email: {
    smtpHost: "smtp.gmail.com",
    smtpPort: 587,
    smtpUser: "",
    smtpPass: "",
    fromName: "Fire Crackers",
    fromEmail: "noreply@firecrackers.com",
    secure: false,
  } as EmailSettings,
  home: {
    hero: {
      show: true,
      badge: "Diwali 2026 Special",
      title: "Celebrate the",
      titleHighlight: "Festival of Lights",
      subtitle: "Best quality fire crackers for your happy & safe Diwali celebration. Light up the sky with us. ✨",
      ctaPrimary: "Shop Now",
      ctaPrimaryLink: "/products",
      ctaSecondary: "Explore Offers",
      ctaSecondaryLink: "/offers",
      image: "",
      accentHex: "#ed4599", // matches default Primary Colour — badge text stays in the site's 2-colour palette
    },
    featureStrip: {
      show: true,
      items: [
        { icon: "Award", title: "Best Quality", desc: "Premium licensed products" },
        { icon: "Truck", title: "Safe Delivery", desc: "All over India" },
        { icon: "ShieldCheck", title: "Best Prices", desc: "Affordable for everyone" },
        { icon: "Headset", title: "24/7 Support", desc: "We're here to help" },
      ],
    },
    featured: {
      show: true,
      eyebrow: "Featured Products",
      title: "Our",
      titleHighlight: "Best Sellers",
    },
    offer: {
      show: true,
      badge: "Limited Time Only",
      title: "Biggest",
      titleHighlight: "Festival Offers",
      description: "Get amazing discounts on all your favourite crackers. Limited time only — grab them before they're gone!",
      cta: "View Offers",
      ctaLink: "/offers",
      image: "",
      accentHex: "#ed4599", // matches default Primary Colour
    },
    why: {
      show: true,
      title: "Why",
      titleHighlight: "Choose Us",
      items: [
        { icon: "Award", title: "Best Quality", desc: "We use the best raw materials.", colorHue: "340" },
        { icon: "ShieldCheck", title: "Safe & Secure", desc: "Your safety is our top priority.", colorHue: "200" },
        { icon: "Sparkles", title: "Wide Variety", desc: "Largest collection of crackers.", colorHue: "42" },
        { icon: "Truck", title: "Fast Delivery", desc: "Quick delivery at your door.", colorHue: "265" },
      ],
    },
  } as HomeSettings,
  about: {
    header: {
      show: true,
      badge: "About Us",
      title: "Lighting up Moments,",
      titleHighlight: "Creating Happiness",
      description: "We are one of the leading fire crackers manufacturers and suppliers with a mission to spread happiness and celebrate every moment with safety and quality.",
    },
    pillars: {
      show: true,
      items: [
        { icon: "Heart", title: "Our Story", desc: "Born from a love for celebrations, we have been crafting joy for over 15 years." },
        { icon: "Target", title: "Our Mission", desc: "Bring safe, high-quality crackers to every home that wants to celebrate." },
        { icon: "Eye", title: "Our Vision", desc: "To be India's most loved and trusted festive brand." },
      ],
    },
    timeline: {
      show: true,
      title: "Our",
      titleHighlight: "Journey",
      items: [
        { year: "2010", title: "Our Beginning", desc: "Started a small family workshop" },
        { year: "2014", title: "Growing Strong", desc: "Expanded to 10+ cities" },
        { year: "2018", title: "New Innovations", desc: "Launched eco-friendly crackers" },
        { year: "2023", title: "Trusted by Millions", desc: "10K+ happy customers" },
      ],
    },
    stats: {
      show: true,
      items: [
        { n: "500+", l: "Products" },
        { n: "10K+", l: "Happy Customers" },
        { n: "50+", l: "Cities Delivered" },
        { n: "15+", l: "Years Experience" },
      ],
    },
  } as AboutSettings,
  services: {
    header: {
      show: true,
      badge: "Our Services",
      title: "We provide the",
      titleHighlight: "best services",
      description: "For your celebrations, big or small.",
    },
    items: {
      show: true,
      list: [
        { icon: "Package", image: "", title: "Bulk Orders", desc: "Get the best deals on bulk purchases for weddings, festivals & more.", link: "/contact", colorHue: "6" },
        { icon: "Sparkles", image: "", title: "Event Fireworks", desc: "Make your events more special with professional firework displays.", link: "/contact", colorHue: "340" },
        { icon: "Gift", image: "", title: "Custom Gift Boxes", desc: "Custom designed festive gift boxes for your loved ones.", link: "/contact", colorHue: "42" },
      ],
    },
    cta: {
      show: true,
      title: "Need Help With Bulk Order?",
      description: "Get in touch with our team for the best quotes and offers.",
      buttonLabel: "Contact Us",
      buttonLink: "/contact",
      image: "",
    },
  } as ServicesSettings,
};

const read = <T,>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      const merged: any = { ...(fallback as any) };
      for (const k of Object.keys(parsed)) {
        const fv = (fallback as any)[k];
        const pv = parsed[k];
        if (fv && typeof fv === "object" && !Array.isArray(fv) && pv && typeof pv === "object" && !Array.isArray(pv)) {
          merged[k] = { ...fv, ...pv };
        } else {
          merged[k] = pv;
        }
      }
      return merged;
    }
    return parsed;
  } catch {
    return fallback;
  }
};

// Pushes a CMS page's content (home/about/services) to the server so every
// visitor sees the admin's changes, not just the browser that saved them.
// Fire-and-forget from the caller's point of view — local state/localStorage
// has already been updated synchronously, this just persists it. Errors are
// surfaced to whoever calls save() via the returned promise.
const pushPageContentToServer = async (key: "home" | "about" | "services", value: unknown) => {
  await api.put(`/page-content/${key}`, value);
};

export const settingsStore = {
  getApp: () => read(APP_KEY, defaults.app),
  getPdf: () => read(PDF_KEY, defaults.pdf),
  getEmail: () => read(EMAIL_KEY, defaults.email),
  getHome: () => read(HOME_KEY, defaults.home),
  getAbout: () => read(ABOUT_KEY, defaults.about),
  getServices: () => read(SERVICES_KEY, defaults.services),
  setApp: (v: AppCustom) => {
    localStorage.setItem(APP_KEY, JSON.stringify(v));
    window.dispatchEvent(new Event("settings-change"));
  },
  setPdf: (v: PdfSettings) => {
    localStorage.setItem(PDF_KEY, JSON.stringify(v));
    window.dispatchEvent(new Event("settings-change"));
  },
  setEmail: (v: EmailSettings) => {
    localStorage.setItem(EMAIL_KEY, JSON.stringify(v));
    window.dispatchEvent(new Event("settings-change"));
  },
  // These three also sync to the server (page_content table) so the content
  // is the same for every visitor, not just whoever clicked Save.
  setHome: (v: HomeSettings) => {
    localStorage.setItem(HOME_KEY, JSON.stringify(v));
    window.dispatchEvent(new Event("settings-change"));
    return pushPageContentToServer("home", v);
  },
  setAbout: (v: AboutSettings) => {
    localStorage.setItem(ABOUT_KEY, JSON.stringify(v));
    window.dispatchEvent(new Event("settings-change"));
    return pushPageContentToServer("about", v);
  },
  setServices: (v: ServicesSettings) => {
    localStorage.setItem(SERVICES_KEY, JSON.stringify(v));
    window.dispatchEvent(new Event("settings-change"));
    return pushPageContentToServer("services", v);
  },
  defaults,
};

export type { AppCustom, PdfSettings, EmailSettings };

export const useAppCustomization = () => {
  const [v, setV] = useState<AppCustom>(settingsStore.getApp());
  useEffect(() => {
    const h = () => setV(settingsStore.getApp());
    window.addEventListener("settings-change", h);
    window.addEventListener("storage", h);
    return () => {
      window.removeEventListener("settings-change", h);
      window.removeEventListener("storage", h);
    };
  }, []);
  return v;
};

export const useHomeSettings = () => {
  const [v, setV] = useState<HomeSettings>(settingsStore.getHome());
  useEffect(() => {
    const h = () => setV(settingsStore.getHome());
    window.addEventListener("settings-change", h);
    window.addEventListener("storage", h);
    return () => {
      window.removeEventListener("settings-change", h);
      window.removeEventListener("storage", h);
    };
  }, []);
  return v;
};

export const useAboutSettings = () => {
  const [v, setV] = useState<AboutSettings>(settingsStore.getAbout());
  useEffect(() => {
    const h = () => setV(settingsStore.getAbout());
    window.addEventListener("settings-change", h);
    window.addEventListener("storage", h);
    return () => {
      window.removeEventListener("settings-change", h);
      window.removeEventListener("storage", h);
    };
  }, []);
  return v;
};

export const useServicesSettings = () => {
  const [v, setV] = useState<ServicesSettings>(settingsStore.getServices());
  useEffect(() => {
    const h = () => setV(settingsStore.getServices());
    window.addEventListener("settings-change", h);
    window.addEventListener("storage", h);
    return () => {
      window.removeEventListener("settings-change", h);
      window.removeEventListener("storage", h);
    };
  }, []);
  return v;
};

/**
 * Fetches the real app-customization settings from the server (public DB values)
 * and syncs them into the local store. Without this, visitors who've never
 * loaded /admin/customization in their browser only ever see the hard-coded
 * defaults (e.g. enableFireworks defaults to true) instead of what the admin
 * actually configured. Call this once near the app root, for every visitor.
 */
export const useSyncAppSettingsFromServer = () => {
  useEffect(() => {
    let cancelled = false;
    fetch("/api/app-settings")
      .then((res) => res.json())
      .then((res) => {
        if (cancelled) return;
        if (res?.data && Object.keys(res.data).length > 0) {
          const merged = { ...defaults.app, ...res.data };
          settingsStore.setApp(merged);
        }
      })
      .catch(() => {
        // Server unreachable — fall back to whatever is already in localStorage/defaults
      });
    return () => {
      cancelled = true;
    };
  }, []);
};

/**
 * Fetches the real Home / About / Services page content from the server
 * (page_content table) and syncs it into the local store, the same way
 * useSyncAppSettingsFromServer does for the theme. Without this, visitors
 * who never opened the admin panel in their own browser would only ever
 * see the hard-coded defaults instead of what the admin actually wrote.
 * Call this once near the app root, for every visitor.
 */
export const useSyncCmsContentFromServer = () => {
  useEffect(() => {
    let cancelled = false;
    const sync = async (key: "home" | "about" | "services", fallback: any, setter: (v: any) => void) => {
      try {
        const res = await fetch(`/api/page-content/${key}`);
        const json = await res.json();
        if (cancelled) return;
        if (json?.data && Object.keys(json.data).length > 0) {
          const merged: any = { ...fallback };
          for (const k of Object.keys(json.data)) {
            const fv = fallback[k];
            const sv = json.data[k];
            merged[k] = fv && typeof fv === "object" && !Array.isArray(fv) && sv && typeof sv === "object" && !Array.isArray(sv)
              ? { ...fv, ...sv }
              : sv;
          }
          setter(merged);
        }
      } catch {
        // Server unreachable — fall back to whatever is already in localStorage/defaults
      }
    };
    sync("home", defaults.home, (v) => { localStorage.setItem(HOME_KEY, JSON.stringify(v)); window.dispatchEvent(new Event("settings-change")); });
    sync("about", defaults.about, (v) => { localStorage.setItem(ABOUT_KEY, JSON.stringify(v)); window.dispatchEvent(new Event("settings-change")); });
    sync("services", defaults.services, (v) => { localStorage.setItem(SERVICES_KEY, JSON.stringify(v)); window.dispatchEvent(new Event("settings-change")); });
    return () => {
      cancelled = true;
    };
  }, []);
};

export const useApplyAppCustomization = () => {
  const v = useAppCustomization();
  useEffect(() => {
    const root = document.documentElement;
    // Colors
    if (v.primaryHsl) root.style.setProperty("--primary", v.primaryHsl);
    if (v.accentSecondaryHsl) root.style.setProperty("--secondary", v.accentSecondaryHsl);
    // Typography
    root.style.setProperty("--app-font", v.fontFamily);
    root.style.setProperty("--app-font-size", `${v.fontSize}px`);
    document.body.style.fontFamily = v.fontFamily;
    document.body.style.fontSize = `${v.fontSize}px`;
    // Border radius
    root.style.setProperty("--radius", `${(v.borderRadius ?? 9) / 10}rem`);
    // Shadows
    const shadows: Record<string, string> = {
      none:   "0 1px 3px rgba(15,23,42,0.06)",
      soft:   "0 18px 48px -20px rgba(15,23,42,0.15)",
      strong: "0 24px 64px -16px rgba(15,23,42,0.28)",
    };
    root.style.setProperty("--shadow-card", shadows[v.shadowStyle ?? "soft"]);
    // Spark speed → CSS animation duration multiplier via custom prop
    const speedMap: Record<string, string> = { slow: "1.8", normal: "1", fast: "0.5" };
    root.style.setProperty("--spark-speed", speedMap[v.sparkSpeed ?? "normal"]);

    // ── Product card design ──────────────────────────────────────
    const pc = v.productCard ?? defaults.app.productCard;
    const pcShadows: Record<string, string> = {
      none: "0 1px 3px rgba(15,23,42,0.06)",
      soft: "0 18px 48px -20px rgba(15,23,42,0.15)",
      strong: "0 24px 64px -16px rgba(15,23,42,0.28)",
    };
    const pcBackgrounds: Record<string, string> = {
      flat: "hsl(var(--card))",
      glass: "var(--gradient-card)",
      gradient: "var(--gradient-pink)",
    };
    const pcImageHeights: Record<string, string> = { compact: "128px", normal: "176px", large: "224px" };
    root.style.setProperty("--product-card-radius", `${pc.radius ?? 16}px`);
    root.style.setProperty("--product-card-shadow", pcShadows[pc.shadow ?? "soft"]);
    root.style.setProperty("--product-card-bg", pcBackgrounds[pc.style ?? "flat"]);
    root.style.setProperty("--product-card-image-h", pcImageHeights[pc.imageSize ?? "normal"]);
    root.style.setProperty(
      "--product-price-color",
      pc.priceColorHsl ? `hsl(${pc.priceColorHsl})` : "hsl(var(--primary))",
    );

    // ── Quick Order table design ─────────────────────────────────
    const qo = v.quickOrder ?? defaults.app.quickOrder;
    const qoHeaderStyles: Record<string, string> = {
      primary: "hsl(var(--primary))",
      dark: "hsl(224 71% 12%)",
      light: "hsl(210 40% 96%)",
    };
    const qoHeaderText: Record<string, string> = {
      primary: "hsl(var(--primary-foreground))",
      dark: "#fff",
      light: "hsl(224 71% 12%)",
    };
    const qoImageSizes: Record<string, string> = { small: "40px", medium: "56px", large: "72px" };
    const qoRowPad: Record<string, string> = { compact: "0.5rem", comfortable: "0.75rem" };
    root.style.setProperty("--qo-header-bg", qoHeaderStyles[qo.headerStyle ?? "primary"]);
    root.style.setProperty("--qo-header-text", qoHeaderText[qo.headerStyle ?? "primary"]);
    root.style.setProperty("--qo-image-size", qoImageSizes[qo.imageSize ?? "medium"]);
    root.style.setProperty("--qo-row-pad", qoRowPad[qo.density ?? "comfortable"]);
    root.style.setProperty("--qo-row-stripe", qo.rowStyle === "striped" ? "hsl(var(--muted) / 0.5)" : "transparent");
  }, [v]);
};

export const hexToRgb = (hex: string): [number, number, number] => {
  const h = hex.replace("#", "");
  const n = parseInt(h.length === 3 ? h.split("").map(c => c + c).join("") : h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};

// Converts a "H S% L%" theme string (e.g. "330 82% 60%") to "#rrggbb", so
// the live Primary Colour can be handed to code that only speaks hex
// (jsPDF invoice rendering, native <input type="color"> pickers).
export const hslStringToHex = (hsl: string): string => {
  const m = hsl.trim().match(/^(-?\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)%\s+(\d+(?:\.\d+)?)%$/);
  if (!m) return "#ea580c";
  const h = Number(m[1]), s = Number(m[2]) / 100, l = Number(m[3]) / 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const b = l - c / 2;
  let [r, g, bl] = h < 60 ? [c, x, 0] : h < 120 ? [x, c, 0] : h < 180 ? [0, c, x]
    : h < 240 ? [0, x, c] : h < 300 ? [x, 0, c] : [c, 0, x];
  const toHex = (n: number) => Math.round((n + b) * 255).toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(bl)}`;
};

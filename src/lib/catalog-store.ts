import { useSyncExternalStore } from "react";
import { opportunities as baseOpportunities, products as baseProducts, type Opportunity, type Product } from "@/lib/kala-data";
import { usePublished } from "@/lib/draft-store";

export type ProductEdit = Partial<Pick<Product, "title" | "price" | "description" | "image" | "imageAlt" | "tags">>;

const KEY = "sih2026:product-edits";
let edits: Record<string, ProductEdit> = {};
let hydrated = false;
let version = 0;
const listeners = new Set<() => void>();

function hydrate() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) edits = JSON.parse(raw) as Record<string, ProductEdit>;
  } catch { /* ignore corrupt storage */ }
}

function subscribe(listener: () => void) {
  hydrate();
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}

/** Save an edit for a published product; changes appear everywhere instantly. */
export function saveProductEdit(id: string, patch: ProductEdit) {
  hydrate();
  edits = { ...edits, [id]: { ...edits[id], ...patch } };
  version += 1;
  if (typeof window !== "undefined") {
    try { window.localStorage.setItem(KEY, JSON.stringify(edits)); } catch { /* quota */ }
  }
  listeners.forEach((l) => l());
}

function useEdits(): Record<string, ProductEdit> {
  useSyncExternalStore(subscribe, () => { hydrate(); return version; }, () => 0);
  return edits;
}

/** Every product on show: newly published items first, then the featured catalogue. */
export function useCatalogProducts(): Product[] {
  const published = usePublished();
  const current = useEdits();
  return [...published, ...baseProducts].map((product) => ({ ...product, ...current[product.id] }));
}

/** Opportunities refresh as the catalogue grows or products are edited. */
export function useDynamicOpportunities(): Opportunity[] {
  const catalogue = useCatalogProducts();
  const generated: Opportunity[] = catalogue.slice(0, 3).map((product, index) => ({
    id: `match-${product.id}`,
    title: `Export enquiry for ${product.title}`,
    buyer: ["Global Craft Bazaar", "Anaya Home, Dubai", "Terra Living, Berlin"][index % 3] ?? "Global Craft Bazaar",
    score: 96 - index * 3,
    quantity: `${60 + index * 40} units`,
    budget: product.price === "Price on request" ? "Open budget" : `${product.price} / unit`,
    location: ["Mumbai", "Dubai", "Berlin"][index % 3] ?? "Mumbai",
    deadline: "Rolling requirement",
    requirement: `Buyer is actively sourcing ${product.category.toLowerCase()} similar to ${product.title}.`,
    category: product.category,
    materials: (product.tags ?? []).join(", ") || "Handmade materials",
    reasons: ["Matched to your latest catalogue update", "Price band fits the buyer brief", "Capacity suits the order size", "Direct payout to the artisan"],
  }));
  return [...generated, ...baseOpportunities];
}

/** Simple on-device marketing copy generator used by the edit modal. */
export function generateMarketingCopy(input: { title: string; category: string; price: string }) {
  const name = input.title || "this handmade piece";
  const caption = `✨ ${name} — made slowly, by hand.\n\nEvery curve carries the maker's touch, so no two are ever the same. Bring home a piece of living Indian craft at ${input.price || "a fair artisan price"}.\n\n#HandmadeInIndia #ArtisanMade #SlowCraft #VocalForLocal #${(input.category || "craft").replace(/[^a-zA-Z]/g, "")}`;
  const keywords = [
    `buy ${name.toLowerCase()} online`,
    `handmade ${input.category.toLowerCase() || "craft"}`,
    "authentic indian handicraft",
    "artisan direct purchase",
    "eco friendly handmade gift",
  ];
  return { caption, keywords };
}

/** Deterministic authenticity score so the badge stays stable per product. */
export function trustScore(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i += 1) hash = (hash * 31 + id.charCodeAt(i)) % 1000;
  return 92 + (hash % 8);
}

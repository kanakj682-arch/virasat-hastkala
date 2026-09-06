import { useSyncExternalStore } from "react";
import type { Product } from "@/lib/kala-data";

export type Draft = { photo: string | null; transcript: string; title: string; category: string; craft: string; material: string; price: string; description: string; tags: string[] };

const DRAFT_KEY = "sih2026:draft";
const PUBLISHED_KEY = "sih2026:published";

export const emptyDraft: Draft = { photo: null, transcript: "", title: "", category: "", craft: "", material: "", price: "", description: "", tags: [] };

let draft: Draft = emptyDraft;
let published: Product[] = [];
let hydrated = false;
const listeners = new Set<() => void>();

function emit() { listeners.forEach((l) => l()); }

function hydrate() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  try {
    const d = window.localStorage.getItem(DRAFT_KEY);
    if (d) draft = { ...emptyDraft, ...(JSON.parse(d) as Partial<Draft>) };
    const p = window.localStorage.getItem(PUBLISHED_KEY);
    if (p) published = JSON.parse(p) as Product[];
  } catch { /* ignore corrupt storage */ }
}

function persist() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    window.localStorage.setItem(PUBLISHED_KEY, JSON.stringify(published));
  } catch { /* quota or private mode */ }
}

function subscribe(listener: () => void) { hydrate(); listeners.add(listener); return () => { listeners.delete(listener); }; }

export function useDraft(): Draft { return useSyncExternalStore(subscribe, () => { hydrate(); return draft; }, () => emptyDraft); }
export function usePublished(): Product[] { return useSyncExternalStore(subscribe, () => { hydrate(); return published; }, () => [] as Product[]); }

export function updateDraft(patch: Partial<Draft>) { hydrate(); draft = { ...draft, ...patch }; persist(); emit(); }
export function resetDraft() { hydrate(); draft = emptyDraft; persist(); emit(); }

export function publishDraft(fallbackImage: string): Product {
  hydrate();
  const product: Product = {
    id: `draft-${Date.now()}`,
    title: draft.title || "Untitled craft",
    category: draft.category || "Handmade craft",
    price: draft.price || "Price on request",
    status: "Published",
    image: draft.photo || fallbackImage,
    imageAlt: draft.title || "Newly published handmade craft product",
  };
  published = [product, ...published];
  draft = emptyDraft;
  persist();
  emit();
  return product;
}

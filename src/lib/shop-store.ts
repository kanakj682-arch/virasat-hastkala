import { useSyncExternalStore } from "react";
import type { Product } from "@/lib/kala-data";

export type Role = "buyer" | "artisan";
export type CartLine = { id: string; title: string; price: number; image: string; artisan: string; qty: number };
export type Order = {
  id: string;
  placedOn: string;
  total: number;
  artisan: string;
  items: { title: string; qty: number }[];
  stage: 0 | 1 | 2 | 3;
};

type Shape = { role: Role; cart: CartLine[]; wishlist: string[]; savedArtisans: string[]; orders: Order[] };

const KEY = "sih2026:shop";
const listeners = new Set<() => void>();
let hydrated = false;
let version = 0;

/** Two example orders so the delivery timeline is never empty for a first-time buyer. */
const demoOrders: Order[] = [
  { id: "KS-24817", placedOn: "28 Aug 2026", total: 9998, artisan: "Meena Devi", items: [{ title: "Handmade Silk Saree", qty: 2 }], stage: 2 },
  { id: "KS-24655", placedOn: "12 Aug 2026", total: 2499, artisan: "Ramesh Vishwakarma", items: [{ title: "Vintage Brass Idol", qty: 1 }], stage: 3 },
];

let state: Shape = { role: "buyer", cart: [], wishlist: [], savedArtisans: [], orders: [] };

function hydrate() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) state = { ...state, ...(JSON.parse(raw) as Partial<Shape>) };
  } catch { /* ignore corrupt storage */ }
}

function commit(next: Partial<Shape>) {
  hydrate();
  state = { ...state, ...next };
  version += 1;
  if (typeof window !== "undefined") {
    try { window.localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* quota */ }
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  hydrate();
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}

function useShop(): Shape {
  useSyncExternalStore(subscribe, () => { hydrate(); return version; }, () => 0);
  return state;
}

/** Turn "₹4,999" into 4999 so totals and price filters can do maths. */
export function priceNumber(product: Pick<Product, "price" | "priceValue">) {
  if (typeof product.priceValue === "number") return product.priceValue;
  const digits = (product.price ?? "").replace(/[^\d]/g, "");
  return digits ? Number(digits) : 0;
}

export function useRole() { return useShop().role; }
export function setRole(role: Role) { commit({ role }); }
export function toggleRole() { hydrate(); commit({ role: state.role === "buyer" ? "artisan" : "buyer" }); }

export function useCart() { return useShop().cart; }
export function useCartCount() { return useShop().cart.reduce((sum, line) => sum + line.qty, 0); }
export function useCartTotal() { return useShop().cart.reduce((sum, line) => sum + line.qty * line.price, 0); }

export function addToCart(product: Product, qty = 1) {
  hydrate();
  const existing = state.cart.find((line) => line.id === product.id);
  const cart = existing
    ? state.cart.map((line) => (line.id === product.id ? { ...line, qty: line.qty + qty } : line))
    : [...state.cart, { id: product.id, title: product.title, price: priceNumber(product), image: product.image, artisan: product.artisan ?? "Verified artisan", qty }];
  commit({ cart });
}
export function setQty(id: string, qty: number) {
  hydrate();
  commit({ cart: qty <= 0 ? state.cart.filter((line) => line.id !== id) : state.cart.map((line) => (line.id === id ? { ...line, qty } : line)) });
}
export function removeFromCart(id: string) { setQty(id, 0); }
export function clearCart() { commit({ cart: [] }); }

export function useWishlist() { return useShop().wishlist; }
export function toggleWishlist(id: string) {
  hydrate();
  const wishlist = state.wishlist.includes(id) ? state.wishlist.filter((item) => item !== id) : [...state.wishlist, id];
  commit({ wishlist });
  return wishlist.includes(id);
}

export function useSavedArtisans() { return useShop().savedArtisans; }
export function toggleSavedArtisan(id: string) {
  hydrate();
  const savedArtisans = state.savedArtisans.includes(id) ? state.savedArtisans.filter((item) => item !== id) : [...state.savedArtisans, id];
  commit({ savedArtisans });
  return savedArtisans.includes(id);
}

export function useOrders(): Order[] { return [...useShop().orders, ...demoOrders]; }

/** Record a paid order so it appears in the buyer's delivery timeline. */
export function placeOrder(lines: CartLine[]): Order {
  hydrate();
  const order: Order = {
    id: `KS-${Math.floor(10000 + Math.random() * 89999)}`,
    placedOn: new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
    total: lines.reduce((sum, line) => sum + line.qty * line.price, 0),
    artisan: lines[0]?.artisan ?? "Verified artisan",
    items: lines.map((line) => ({ title: line.title, qty: line.qty })),
    stage: 0,
  };
  commit({ orders: [order, ...state.orders] });
  return order;
}

/** Transparent payment split: 90% straight to the artisan, 10% platform + logistics. */
export function paymentSplit(total: number) {
  const artisan = Math.round(total * 0.9);
  return { total, artisan, platform: total - artisan };
}

export const orderStages = ["Order placed", "Packed by artisan", "In transit", "Delivered"] as const;

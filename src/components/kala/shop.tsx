import { useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import QRCode from "qrcode";
import { toast } from "sonner";
import { BadgeCheck, Heart, Leaf, Minus, Plus, ShoppingBag, Sparkles, Store, Trash2, UsersRound, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Brand, Button } from "@/components/kala/ui";
import { ArtisanStoriesButton } from "@/components/kala/artisan-stories";
import { HelpSupport } from "@/components/kala/help-support";
import { craftTypes, products, regions, type Product } from "@/lib/kala-data";
import {
  addToCart, clearCart, paymentSplit, placeOrder, priceNumber, removeFromCart, setQty, setRole,
  toggleWishlist, useCart, useCartCount, useCartTotal, useRole, useWishlist, type CartLine,
} from "@/lib/shop-store";

const rupees = (value: number) => `₹${value.toLocaleString("en-IN")}`;

/** The three promises we make on every listing, revealed on hover. */
const trustBadges = [
  { icon: BadgeCheck, label: "GI Tag Verified" },
  { icon: Leaf, label: "100% Eco-Friendly" },
  { icon: UsersRound, label: "Direct Impact: Supports 1 Artisan Family" },
];

export function RoleToggle() {
  const role = useRole();
  return (
    <div className="flex items-center rounded-xl border border-border bg-card p-0.5" role="group" aria-label="Choose how you browse">
      <Link to="/" onClick={() => setRole("buyer")} aria-pressed={role === "buyer"}
        className={cn("min-h-9 rounded-lg px-2.5 text-xs font-semibold transition-colors", role === "buyer" ? "bg-terracotta text-primary-foreground" : "text-muted-foreground hover:bg-muted")}>
        Browse as Buyer
      </Link>
      <Link to="/dashboard" onClick={() => setRole("artisan")} aria-pressed={role === "artisan"}
        className={cn("min-h-9 rounded-lg px-2.5 text-xs font-semibold transition-colors", role === "artisan" ? "bg-indigo text-primary-foreground" : "text-muted-foreground hover:bg-muted")}>
        Artisan Portal
      </Link>
    </div>
  );
}

export function CartButton({ onClick }: { onClick: () => void }) {
  const count = useCartCount();
  const wishlist = useWishlist();
  return (
    <button type="button" onClick={onClick} aria-label={`Cart and wishlist, ${count} items in cart`}
      className="relative inline-flex min-h-10 items-center gap-2 rounded-xl border border-border bg-card px-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted">
      <ShoppingBag className="size-4" />
      <span className="hidden sm:inline">Cart / Wishlist</span>
      {(count > 0 || wishlist.length > 0) && (
        <span className="grid min-w-5 place-items-center rounded-full bg-terracotta px-1 font-mono text-[10px] text-primary-foreground">{count || wishlist.length}</span>
      )}
    </button>
  );
}

/** Sticky site header for buyer mode: primary navigation, role toggle and the cart drawer. */
export function ShopHeader() {
  const [cartOpen, setCartOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-10">
        <Brand />
        <nav className="order-3 flex w-full items-center gap-1 overflow-x-auto text-sm text-muted-foreground lg:order-none lg:w-auto lg:gap-4">
          <Link to="/" activeOptions={{ exact: true }} activeProps={{ className: "text-foreground font-semibold" }} className="whitespace-nowrap rounded-lg px-2 py-1.5 hover:text-foreground">Home</Link>
          <Link to="/buyer/profile" activeProps={{ className: "text-foreground font-semibold" }} className="whitespace-nowrap rounded-lg px-2 py-1.5 hover:text-foreground">My Profile</Link>
          <Link to="/add-product" activeProps={{ className: "text-foreground font-semibold" }} className="whitespace-nowrap rounded-lg px-2 py-1.5 hover:text-foreground">Add Product</Link>
          <span className="whitespace-nowrap"><ArtisanStoriesButton /></span>
          <span className="whitespace-nowrap"><HelpSupport compact={false} /></span>
        </nav>
        <div className="flex items-center gap-2">
          <CartButton onClick={() => setCartOpen(true)} />
          <span className="hidden sm:inline-flex"><RoleToggle /></span>
        </div>
      </div>
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </header>
  );
}

export function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const cart = useCart();
  const total = useCartTotal();
  const wishlist = useWishlist();
  const [checkout, setCheckout] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;
  const saved = products.filter((product) => wishlist.includes(product.id));

  return (
    <>
      <div className="fixed inset-0 z-50 bg-ink/50 backdrop-blur-sm" onClick={onClose} />
      <aside role="dialog" aria-label="Cart and wishlist" className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l border-border bg-card shadow-2xl">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="font-display text-lg font-bold text-ink">Cart / Wishlist</h2>
          <button type="button" onClick={onClose} aria-label="Close cart" className="grid size-9 place-items-center rounded-xl hover:bg-muted"><X className="size-4" /></button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {cart.length === 0 ? (
            <p className="rounded-xl bg-muted/60 p-4 text-sm text-muted-foreground">Your cart is empty. Add a piece from the catalogue to see the artisan payment split before you pay.</p>
          ) : (
            <ul className="space-y-3">
              {cart.map((line) => (
                <li key={line.id} className="flex gap-3 rounded-xl border border-border p-3">
                  <img src={line.image} alt={line.title} className="size-16 shrink-0 rounded-lg object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-ink">{line.title}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">by {line.artisan}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <button type="button" aria-label={`Reduce quantity of ${line.title}`} onClick={() => setQty(line.id, line.qty - 1)} className="grid size-7 place-items-center rounded-lg border border-border hover:bg-muted"><Minus className="size-3" /></button>
                      <span className="min-w-6 text-center text-sm font-semibold">{line.qty}</span>
                      <button type="button" aria-label={`Increase quantity of ${line.title}`} onClick={() => setQty(line.id, line.qty + 1)} className="grid size-7 place-items-center rounded-lg border border-border hover:bg-muted"><Plus className="size-3" /></button>
                      <span className="ml-auto text-sm font-bold text-ink">{rupees(line.price * line.qty)}</span>
                      <button type="button" aria-label={`Remove ${line.title}`} onClick={() => removeFromCart(line.id)} className="grid size-7 place-items-center rounded-lg text-muted-foreground hover:bg-muted hover:text-destructive"><Trash2 className="size-3.5" /></button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
          <h3 className="mt-7 flex items-center gap-2 font-display text-sm font-bold text-ink"><Heart className="size-4 text-terracotta" />Wishlist ({saved.length})</h3>
          {saved.length === 0 ? (
            <p className="mt-2 text-xs text-muted-foreground">Tap the heart on any craft to save it here.</p>
          ) : (
            <ul className="mt-3 space-y-2">
              {saved.map((product) => (
                <li key={product.id} className="flex items-center gap-3 rounded-xl border border-border p-2.5">
                  <img src={product.image} alt={product.imageAlt} className="size-11 shrink-0 rounded-lg object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-ink">{product.title}</p>
                    <p className="text-xs text-muted-foreground">{product.price}</p>
                  </div>
                  <Button variant="quiet" className="min-h-9 px-2.5 text-xs" onClick={() => { addToCart(product); toast.success(`${product.title} added to cart`); }}>Add</Button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="border-t border-border px-5 py-4">
          <div className="flex items-center justify-between text-sm"><span className="text-muted-foreground">Cart total</span><span className="font-display text-xl font-bold text-ink">{rupees(total)}</span></div>
          <Button className="mt-3 min-h-12 w-full" disabled={cart.length === 0} onClick={() => setCheckout(true)}>Buy Now · see artisan split</Button>
        </div>
      </aside>
      {checkout && <CheckoutModal lines={cart} onClose={() => setCheckout(false)} onPaid={() => { setCheckout(false); onClose(); }} />}
    </>
  );
}

/** Checkout with the transparent 90/10 split and a scannable UPI QR code. */
export function CheckoutModal({ lines, onClose, onPaid }: { lines: CartLine[]; onClose: () => void; onPaid?: () => void }) {
  const total = lines.reduce((sum, line) => sum + line.price * line.qty, 0);
  const split = paymentSplit(total);
  const artisan = lines[0]?.artisan ?? "Verified artisan";
  const [qr, setQr] = useState<string | null>(null);
  const [paid, setPaid] = useState<string | null>(null);

  const upiUri = useMemo(() => {
    const params = new URLSearchParams({ pa: "kalasetu.artisan@upi", pn: artisan, am: String(split.artisan), cu: "INR", tn: `Direct artisan payment · ${lines.map((line) => line.title).join(", ")}` });
    return `upi://pay?${params.toString()}`;
  }, [artisan, split.artisan, lines]);

  useEffect(() => {
    let active = true;
    QRCode.toDataURL(upiUri, { width: 320, margin: 1, color: { dark: "#1f2430", light: "#ffffff" } })
      .then((url) => { if (active) setQr(url); })
      .catch(() => { if (active) setQr(null); });
    return () => { active = false; };
  }, [upiUri]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  function confirmPayment() {
    const order = placeOrder(lines);
    clearCart();
    setPaid(order.id);
    toast.success(`Payment confirmed · order ${order.id}`);
  }

  return (
    <div className="fixed inset-0 z-[60] grid place-items-center bg-ink/60 p-4 backdrop-blur-sm" onClick={onClose}>
      <div role="dialog" aria-label="Checkout" onClick={(event) => event.stopPropagation()} className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-border bg-card p-5 shadow-2xl sm:p-7">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[.18em] text-terracotta">Transparent checkout</p>
            <h2 className="mt-1 font-display text-2xl font-bold text-ink">{paid ? "Payment confirmed" : "Pay the artisan directly"}</h2>
          </div>
          <button type="button" onClick={onClose} aria-label="Close checkout" className="grid size-9 place-items-center rounded-xl hover:bg-muted"><X className="size-4" /></button>
        </div>

        {paid ? (
          <div className="mt-5 rounded-2xl bg-moss-soft p-5 text-sm text-moss">
            <p className="font-display text-lg font-bold">Order {paid} placed</p>
            <p className="mt-2">{rupees(split.artisan)} goes straight to {artisan}. Track the delivery timeline in My Profile.</p>
            <Link to="/buyer/profile"><Button className="mt-4 min-h-11 w-full" onClick={onPaid}>View my orders</Button></Link>
          </div>
        ) : (
          <>
            <ul className="mt-5 space-y-2 rounded-2xl bg-muted/60 p-4 text-sm">
              {lines.map((line) => (
                <li key={line.id} className="flex justify-between gap-3"><span className="min-w-0 truncate">{line.title} × {line.qty}</span><span className="font-medium">{rupees(line.price * line.qty)}</span></li>
              ))}
            </ul>

            <div className="mt-4 rounded-2xl border border-border p-4">
              <p className="font-display text-sm font-bold text-ink">Where your {rupees(split.total)} goes</p>
              <div className="mt-3 flex h-3 overflow-hidden rounded-full bg-muted"><div className="bg-moss" style={{ width: "90%" }} /><div className="bg-saffron" style={{ width: "10%" }} /></div>
              <div className="mt-3 space-y-2 text-sm">
                <div className="flex items-center justify-between"><span className="flex items-center gap-2"><span className="size-2.5 rounded-full bg-moss" />90% direct to artisan · {artisan}</span><span className="font-bold text-ink">{rupees(split.artisan)}</span></div>
                <div className="flex items-center justify-between"><span className="flex items-center gap-2"><span className="size-2.5 rounded-full bg-saffron" />10% platform &amp; logistics</span><span className="font-bold text-ink">{rupees(split.platform)}</span></div>
              </div>
            </div>

            <div className="mt-4 flex flex-col items-center gap-3 rounded-2xl bg-indigo-soft p-4 text-center">
              <p className="font-mono text-[10px] uppercase tracking-[.16em] text-indigo">Scan to pay by UPI</p>
              {qr ? <img src={qr} alt={`UPI QR code to pay ${rupees(split.artisan)} to ${artisan}`} width={176} height={176} className="size-44 rounded-xl bg-white p-2 shadow-sm" /> : <div className="grid size-44 place-items-center rounded-xl bg-white/70 text-xs text-muted-foreground">Generating QR…</div>}
              <p className="text-xs text-indigo">kalasetu.artisan@upi · {rupees(split.artisan)}</p>
            </div>

            <Button className="mt-4 min-h-12 w-full" onClick={confirmPayment}><Sparkles className="size-4" />I have paid · place order</Button>
            <p className="mt-2 text-center text-xs text-muted-foreground">Demo checkout — no real money moves.</p>
          </>
        )}
      </div>
    </div>
  );
}

export function ProductShopCard({ product }: { product: Product }) {
  const wishlist = useWishlist();
  const saved = wishlist.includes(product.id);
  const [buying, setBuying] = useState(false);
  const price = priceNumber(product);

  return (
    <article className="group relative overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
      <div className="relative overflow-hidden">
        <img src={product.image} alt={product.imageAlt} loading="lazy" className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-105" />
        <button type="button" aria-label={saved ? `Remove ${product.title} from wishlist` : `Save ${product.title} to wishlist`} aria-pressed={saved}
          onClick={() => { const now = toggleWishlist(product.id); toast.success(now ? "Saved to wishlist" : "Removed from wishlist"); }}
          className="absolute right-3 top-3 grid size-10 place-items-center rounded-full bg-card/90 shadow-sm backdrop-blur transition-colors hover:bg-card">
          <Heart className={cn("size-[18px]", saved ? "fill-terracotta text-terracotta" : "text-muted-foreground")} />
        </button>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-full bg-ink/85 p-3 text-primary-foreground opacity-0 backdrop-blur transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          {trustBadges.filter((badge) => badge.label !== "GI Tag Verified" || product.gi).map((badge) => {
            const Icon = badge.icon;
            return <p key={badge.label} className="flex items-center gap-2 py-0.5 text-[11px] font-medium"><Icon className="size-3.5 shrink-0 text-saffron" />{badge.label}</p>;
          })}
        </div>
      </div>
      <div className="p-4">
        <p className="font-mono text-[10px] uppercase tracking-[.14em] text-terracotta">{product.craftType} · {product.state}</p>
        <h3 className="mt-1 font-display text-lg font-bold leading-tight text-ink">{product.title}</h3>
        <p className="mt-1 text-xs text-muted-foreground">by {product.artisan}</p>
        <p className="mt-3 font-display text-xl font-bold text-ink">{rupees(price)}</p>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <Button variant="quiet" onClick={() => { addToCart(product); toast.success(`${product.title} added to cart`); }}><ShoppingBag className="size-4" />Add to Cart</Button>
          <Button onClick={() => setBuying(true)}>Buy Now</Button>
        </div>
      </div>
      {buying && <CheckoutModal lines={[{ id: product.id, title: product.title, price, image: product.image, artisan: product.artisan ?? "Verified artisan", qty: 1 }]} onClose={() => setBuying(false)} />}
    </article>
  );
}

const priceBands = [
  { label: "Any price", min: 0, max: Infinity },
  { label: "Under ₹1,000", min: 0, max: 999 },
  { label: "₹1,000 – ₹2,500", min: 1000, max: 2500 },
  { label: "₹2,500 – ₹5,000", min: 2500, max: 5000 },
  { label: "Above ₹5,000", min: 5000, max: Infinity },
];

/** Buyer-facing catalogue with region, craft and price filters. */
export function BuyerCatalog() {
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState("all");
  const [craft, setCraft] = useState("all");
  const [band, setBand] = useState(0);

  const results = useMemo(() => {
    const active = priceBands[band] ?? priceBands[0]!;
    const needle = query.trim().toLowerCase();
    return products.filter((product) => {
      const price = priceNumber(product);
      if (region !== "all" && product.state !== region) return false;
      if (craft !== "all" && product.craftType !== craft) return false;
      if (price < active.min || price > active.max) return false;
      if (needle && ![product.title, product.category, product.artisan, product.state].join(" ").toLowerCase().includes(needle)) return false;
      return true;
    });
  }, [query, region, craft, band]);

  return (
    <section id="catalogue" className="border-t border-border bg-surface-warm">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[.2em] text-terracotta">Shop directly</p>
            <h2 className="mt-1 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">Handmade in India, bought without middlemen.</h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">Every purchase sends 90% straight to the artisan's UPI account. Filter by region, craft or budget.</p>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full border border-moss/30 bg-moss-soft px-3 py-1.5 text-xs font-semibold text-moss"><Store className="size-3.5" />{results.length} crafts available</span>
        </div>

        <div className="mt-7 grid gap-3 rounded-2xl border border-border bg-card p-4 sm:grid-cols-2 lg:grid-cols-4">
          <label className="block"><span className="text-xs font-semibold text-muted-foreground">Search</span>
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Silk saree, Jaipur…" className="mt-1.5 min-h-11 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring" />
          </label>
          <label className="block"><span className="text-xs font-semibold text-muted-foreground">State / Region</span>
            <select value={region} onChange={(event) => setRegion(event.target.value)} className="mt-1.5 min-h-11 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring">
              <option value="all">All regions</option>
              {regions.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </label>
          <label className="block"><span className="text-xs font-semibold text-muted-foreground">Craft type</span>
            <select value={craft} onChange={(event) => setCraft(event.target.value)} className="mt-1.5 min-h-11 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring">
              <option value="all">All crafts</option>
              {craftTypes.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </label>
          <label className="block"><span className="text-xs font-semibold text-muted-foreground">Price range</span>
            <select value={band} onChange={(event) => setBand(Number(event.target.value))} className="mt-1.5 min-h-11 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring">
              {priceBands.map((item, index) => <option key={item.label} value={index}>{item.label}</option>)}
            </select>
          </label>
        </div>

        {results.length === 0 ? (
          <p className="mt-8 rounded-2xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">No crafts match these filters yet. Try widening the region or budget.</p>
        ) : (
          <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((product) => <ProductShopCard key={product.id} product={product} />)}
          </div>
        )}
      </div>
    </section>
  );
}

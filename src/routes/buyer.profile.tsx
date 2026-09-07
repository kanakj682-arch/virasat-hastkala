import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { BriefcaseBusiness, Check, Globe2, Heart, Mail, Package, ShoppingBag, Truck, UserRound } from "lucide-react";
import { AppShell, Button, SectionHeading } from "@/components/kala/ui";
import { addToCart, orderStages, toggleSavedArtisan, toggleWishlist, useOrders, useSavedArtisans, useWishlist } from "@/lib/shop-store";
import { products } from "@/lib/kala-data";
import { artisanStories } from "@/lib/artisan-stories";
import { toast } from "sonner";

export const Route = createFileRoute("/buyer/profile")({
  head: () => ({
    meta: [
      { title: "My Profile — Orders & Wishlist · sih 2026" },
      { name: "description", content: "Track your handmade craft orders, follow their delivery timeline, and revisit saved artisans and wishlisted pieces." },
      { property: "og:title", content: "My Profile — Orders & Wishlist · sih 2026" },
      { property: "og:description", content: "Order history, delivery timeline, saved artisans and wishlist in one place." },
      { property: "og:type", content: "profile" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: BuyerProfile,
});

const buyer = { name: "ABC Enterprises", contact: "Rahul Sharma", location: "New Delhi, India", email: "procurement@abc.example", role: "Corporate Gifting" };
const rupees = (value: number) => `₹${value.toLocaleString("en-IN")}`;

function BuyerProfile() {
  const [tab, setTab] = useState<"orders" | "saved">("orders");
  const orders = useOrders();
  const wishlist = useWishlist();
  const savedArtisans = useSavedArtisans();
  const savedProducts = products.filter((product) => wishlist.includes(product.id));
  const artisans = artisanStories.filter((story) => savedArtisans.includes(story.id));

  return (
    <AppShell role="buyer" title="My profile" eyebrow="Your account">
      <div className="mx-auto max-w-5xl">
        <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
          <div className="h-32 bg-terracotta" />
          <div className="px-5 pb-6 sm:px-8">
            <div className="-mt-12 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex items-end gap-4">
                <div className="grid size-24 place-items-center rounded-2xl border-4 border-card bg-indigo text-2xl font-bold text-primary-foreground shadow-lg">AB</div>
                <div className="pb-1">
                  <h1 className="font-display text-2xl font-bold text-ink">{buyer.name}</h1>
                  <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground"><UserRound className="size-4" />{buyer.contact}</p>
                </div>
              </div>
              <Button variant="quiet">Edit profile</Button>
            </div>
            <div className="mt-7 grid gap-3 sm:grid-cols-3">
              <Info icon={BriefcaseBusiness} label="Buying focus" value={buyer.role} />
              <Info icon={Globe2} label="Location" value={buyer.location} />
              <Info icon={Mail} label="Email" value={buyer.email} />
            </div>
          </div>
        </div>

        <div className="mt-8 flex gap-1 rounded-2xl border border-border bg-card p-1" role="tablist" aria-label="Profile sections">
          <TabButton active={tab === "orders"} onClick={() => setTab("orders")} icon={Package} label={`Order history (${orders.length})`} />
          <TabButton active={tab === "saved"} onClick={() => setTab("saved")} icon={Heart} label={`Saved artisans / Wishlist (${artisans.length + savedProducts.length})`} />
        </div>

        {tab === "orders" ? (
          <section className="mt-6">
            <SectionHeading eyebrow="Orders" title="Your craft orders" description="Each order shows the artisan it supports and where the parcel has reached." />
            <div className="space-y-4">
              {orders.map((order) => (
                <article key={order.id} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-[.16em] text-terracotta">Order {order.id} · {order.placedOn}</p>
                      <h3 className="mt-1 font-display text-lg font-bold text-ink">{order.items.map((item) => `${item.title} × ${item.qty}`).join(", ")}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">Supports {order.artisan}</p>
                    </div>
                    <p className="font-display text-xl font-bold text-ink">{rupees(order.total)}</p>
                  </div>
                  <ol className="mt-6 grid gap-3 sm:grid-cols-4">
                    {orderStages.map((stage, index) => {
                      const done = index <= order.stage;
                      const Icon = index === 3 ? Check : index === 2 ? Truck : index === 1 ? Package : ShoppingBag;
                      return (
                        <li key={stage} className="flex items-start gap-2">
                          <span className={`mt-0.5 grid size-7 shrink-0 place-items-center rounded-full ${done ? "bg-moss text-primary-foreground" : "bg-muted text-muted-foreground"}`}><Icon className="size-3.5" /></span>
                          <span>
                            <span className={`block text-xs font-semibold ${done ? "text-ink" : "text-muted-foreground"}`}>{stage}</span>
                            <span className="mt-0.5 block h-1 w-full rounded-full" />
                          </span>
                        </li>
                      );
                    })}
                  </ol>
                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-moss transition-all" style={{ width: `${((order.stage + 1) / 4) * 100}%` }} /></div>
                </article>
              ))}
            </div>
          </section>
        ) : (
          <section className="mt-6 grid gap-6 lg:grid-cols-2">
            <div>
              <SectionHeading eyebrow="Wishlist" title="Pieces you saved" />
              {savedProducts.length === 0 ? (
                <p className="rounded-2xl border border-border bg-card p-5 text-sm text-muted-foreground">Nothing saved yet. Tap the heart on any craft in the <Link to="/" className="font-semibold text-indigo">catalogue</Link>.</p>
              ) : (
                <ul className="space-y-3">
                  {savedProducts.map((product) => (
                    <li key={product.id} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3">
                      <img src={product.image} alt={product.imageAlt} className="size-14 shrink-0 rounded-xl object-cover" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-ink">{product.title}</p>
                        <p className="text-xs text-muted-foreground">{product.price} · {product.artisan}</p>
                      </div>
                      <Button variant="quiet" className="min-h-9 px-3 text-xs" onClick={() => { addToCart(product); toast.success("Added to cart"); }}>Add to cart</Button>
                      <button type="button" aria-label={`Remove ${product.title} from wishlist`} onClick={() => toggleWishlist(product.id)} className="grid size-9 place-items-center rounded-xl text-terracotta hover:bg-muted"><Heart className="size-4 fill-terracotta" /></button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div>
              <SectionHeading eyebrow="Saved artisans" title="Makers you follow" />
              {artisans.length === 0 ? (
                <p className="rounded-2xl border border-border bg-card p-5 text-sm text-muted-foreground">Open an artisan story and save the maker to follow their new work.</p>
              ) : (
                <ul className="space-y-3">
                  {artisans.map((story) => (
                    <li key={story.id} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3">
                      <div className="grid size-11 shrink-0 place-items-center rounded-full bg-indigo-soft font-display font-bold text-indigo">{story.name.charAt(0)}</div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-ink">{story.name}</p>
                        <p className="truncate text-xs text-muted-foreground">{story.craft} · {story.location}</p>
                      </div>
                      <Button variant="quiet" className="min-h-9 px-3 text-xs" onClick={() => toggleSavedArtisan(story.id)}>Unfollow</Button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        )}
      </div>
    </AppShell>
  );
}

function TabButton({ active, onClick, icon: Icon, label }: { active: boolean; onClick: () => void; icon: typeof Package; label: string }) {
  return (
    <button type="button" role="tab" aria-selected={active} onClick={onClick}
      className={`flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl px-3 text-sm font-semibold transition-colors ${active ? "bg-indigo text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}>
      <Icon className="size-4" />{label}
    </button>
  );
}

function Info({ icon: Icon, label, value }: { icon: typeof Package; label: string; value: string }) {
  return (
    <div className="rounded-xl bg-muted/60 p-4">
      <Icon className="size-4 text-terracotta" />
      <p className="mt-3 text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm font-semibold text-ink">{value}</p>
    </div>
  );
}

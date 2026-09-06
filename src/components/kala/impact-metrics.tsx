import { BadgeIndianRupee, Globe2, ShieldCheck, Users } from "lucide-react";
import { useCatalogProducts, useDynamicOpportunities } from "@/lib/catalog-store";

function inventoryValue(prices: string[]) {
  const total = prices.reduce((sum, price) => sum + (Number(price.replace(/[^\d.]/g, "")) || 0), 0);
  return `₹${total.toLocaleString("en-IN")}`;
}

export function ImpactMetrics() {
  const catalogue = useCatalogProducts();
  const matches = useDynamicOpportunities();
  const items = [
    { icon: Users, label: "Artisans onboarded", value: "3", tone: "bg-terracotta-soft text-terracotta" },
    { icon: BadgeIndianRupee, label: "Total inventory value", value: inventoryValue(catalogue.map((product) => product.price)), tone: "bg-moss-soft text-moss" },
    { icon: Globe2, label: "Global opportunities matched", value: String(matches.length), tone: "bg-indigo-soft text-indigo" },
    { icon: ShieldCheck, label: "Direct payout rate", value: "100%", tone: "bg-saffron/20 text-saffron-foreground" },
  ];

  return (
    <section aria-label="Live impact metrics" className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <div key={item.label} className="rounded-2xl border border-border bg-card p-4 shadow-sm">
            <div className={`grid size-9 place-items-center rounded-xl ${item.tone}`}><Icon className="size-4" /></div>
            <p className="mt-3 font-display text-xl font-bold text-ink sm:text-2xl">{item.value}</p>
            <p className="mt-1 text-xs leading-snug text-muted-foreground">{item.label}</p>
          </div>
        );
      })}
    </section>
  );
}

export function TrustBadge({ score, impact }: { score: number; impact: number }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="flex items-center gap-1.5 rounded-full bg-moss-soft px-2.5 py-1 font-mono text-[10px] uppercase tracking-[.1em] text-moss">
        <ShieldCheck className="size-3.5" />{score}% authentic handloom
      </span>
      <span className="rounded-full bg-saffron/20 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[.1em] text-saffron-foreground">
        {impact} impact credits
      </span>
    </div>
  );
}

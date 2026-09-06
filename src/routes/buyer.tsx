import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BriefcaseBusiness, MessageCircle, Search, UsersRound } from "lucide-react";
import { artisans, opportunities } from "@/lib/kala-data";
import { AppShell, Button, SectionHeading } from "@/components/kala/ui";

export const Route = createFileRoute("/buyer")({
  head: () => ({
    meta: [
      { title: "Buyer Workspace — sih 2026" },
      { name: "description", content: "Find artisans and manage requirements on sih 2026." },
      { property: "og:title", content: "Buyer Workspace — sih 2026" },
      { property: "og:description", content: "Find artisans and manage requirements on sih 2026." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: BuyerHome,
});

function BuyerHome() {
  return (
    <AppShell role="buyer" title="Buyer workspace" eyebrow="Find the craft that fits your brief">
      <div className="mx-auto max-w-6xl">
        
        <section className="mt-7 rounded-2xl border border-indigo/15 bg-indigo-soft p-5 sm:p-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[.18em] text-indigo">Post a requirement</p>
              <h1 className="mt-2 font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">Describe what you need. AI finds the right artisans.</h1>
            </div>
            <Link to="/buyer/requirements">
              <Button className="min-h-12"><BriefcaseBusiness className="size-4" />New requirement</Button>
            </Link>
          </div>
        </section>
        <section className="mt-8 grid gap-4 sm:grid-cols-3">
          <Link to="/buyer/matches" className="rounded-2xl border border-border bg-card p-5 transition-colors hover:bg-muted">
            <div className="grid size-10 place-items-center rounded-xl bg-saffron/20 text-saffron-foreground"><Search className="size-5" /></div>
            <p className="mt-4 font-display text-lg font-bold text-ink">Find artisans</p>
            <p className="mt-1 text-sm text-muted-foreground">{artisans.length} artisans matched to common briefs.</p>
          </Link>
          <Link to="/buyer/requirements" className="rounded-2xl border border-border bg-card p-5 transition-colors hover:bg-muted">
            <div className="grid size-10 place-items-center rounded-xl bg-indigo-soft text-indigo"><BriefcaseBusiness className="size-5" /></div>
            <p className="mt-4 font-display text-lg font-bold text-ink">Requirements</p>
            <p className="mt-1 text-sm text-muted-foreground">Draft or edit your open market briefs.</p>
          </Link>
          <Link to="/buyer/enquiries" className="rounded-2xl border border-border bg-card p-5 transition-colors hover:bg-muted">
            <div className="grid size-10 place-items-center rounded-xl bg-terracotta-soft text-terracotta"><MessageCircle className="size-5" /></div>
            <p className="mt-4 font-display text-lg font-bold text-ink">Enquiries</p>
            <p className="mt-1 text-sm text-muted-foreground">Conversations with artisans who expressed interest.</p>
          </Link>
        </section>
        <section className="mt-10">
          <SectionHeading eyebrow="Open market briefs" title="Opportunities artisans can see" action={<Link to="/buyer/requirements" className="text-sm font-semibold text-terracotta">Manage <ArrowRight className="ml-1 inline size-4" /></Link>} />
          <div className="grid gap-3 lg:grid-cols-2">
            {opportunities.slice(0, 2).map((opportunity) => (
              <div key={opportunity.id} className="rounded-2xl border border-border bg-card p-4">
                <p className="font-mono text-[10px] uppercase tracking-[.16em] text-terracotta">{opportunity.category}</p>
                <p className="mt-1 font-display text-lg font-bold text-ink">{opportunity.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{opportunity.quantity} · {opportunity.budget}</p>
              </div>
            ))}
          </div>
        </section>
        <section className="mt-10 rounded-2xl border border-border bg-card p-5 sm:p-7">
          <div className="flex items-start gap-4">
            <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-indigo text-primary-foreground"><UsersRound className="size-5" /></div>
            <div>
              <p className="font-display text-lg font-bold text-ink">Why sih 2026 for buyers?</p>
              <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted-foreground">Natural-language briefs, AI-ranked artisan matches, and direct enquiry management — all with the artisan story visible upfront.</p>
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  );
}

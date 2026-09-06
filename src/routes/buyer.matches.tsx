import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, MapPin, Sparkles } from "lucide-react";
import { artisans } from "@/lib/kala-data";
import { AppShell, Button, Score, SectionHeading } from "@/components/kala/ui";

export const Route = createFileRoute("/buyer/matches")({
  head: () => ({
    meta: [
      { title: "Artisan Matches — sih 2026" },
      { name: "description", content: "AI-ranked artisans for your requirement on sih 2026." },
      { property: "og:title", content: "Artisan Matches — sih 2026" },
      { property: "og:description", content: "AI-ranked artisans for your requirement." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: BuyerMatches,
});

function BuyerMatches() {
  return (
    <AppShell role="buyer" title="Find artisans" eyebrow="AI-ranked for your brief">
      <div className="mx-auto max-w-6xl">
        
        <div className="mt-7">
          <SectionHeading eyebrow="Best matches" title="Artisans who fit your need" description="Ranked by craft fit, price compatibility, capacity, and location." />
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {artisans.map((artisan) => (
            <article key={artisan.id} className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
              <img src={artisan.image} alt={artisan.alt} className="h-40 w-full object-cover" />
              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-display text-lg font-bold text-ink">{artisan.name}</p>
                    <p className="mt-0.5 text-sm text-muted-foreground">{artisan.craft}</p>
                  </div>
                  <Score value={artisan.score} />
                </div>
                <p className="mt-3 flex items-center gap-1.5 text-sm text-muted-foreground"><MapPin className="size-4" />{artisan.location}</p>
                <p className="mt-3 text-sm text-muted-foreground">{artisan.reason}</p>
                <Link to="/artisan/$id" params={{ id: artisan.id }} className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-border bg-card px-3 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted">View profile <ArrowRight className="size-4" /></Link>
              </div>
            </article>
          ))}
        </div>
        <div className="mt-8 flex items-center gap-2 rounded-xl border border-saffron/40 bg-saffron/15 px-3 py-2 text-xs text-saffron-foreground"><Sparkles className="size-4 shrink-0" /><span>Demo: matches are precomputed from the current requirement.</span></div>
      </div>
    </AppShell>
  );
}

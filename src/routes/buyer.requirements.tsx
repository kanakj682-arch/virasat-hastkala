import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Mic, Sparkles } from "lucide-react";
import { AppShell, Button, SectionHeading, VoiceButton } from "@/components/kala/ui";

export const Route = createFileRoute("/buyer/requirements")({
  head: () => ({
    meta: [
      { title: "Post a Requirement — sih 2026" },
      { name: "description", content: "Describe your craft requirement naturally and let sih 2026 match you with artisans." },
      { property: "og:title", content: "Post a Requirement — sih 2026" },
      { property: "og:description", content: "Describe your craft requirement naturally." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: BuyerRequirements,
});

function BuyerRequirements() {
  return (
    <AppShell role="buyer" title="New requirement" eyebrow="Tell us what you need">
      <div className="mx-auto max-w-3xl">
        
        <div className="mt-7">
          <SectionHeading eyebrow="Natural input" title="Describe your requirement" description="Type or speak in plain language. AI turns it into a structured brief artisans can respond to." />
        </div>
        <form className="mt-6 space-y-4" onSubmit={(e) => { e.preventDefault(); window.alert("Requirement saved in demo mode."); }}>
          <div>
            <label className="mb-1.5 block text-sm font-medium">What do you need?</label>
            <textarea rows={4} placeholder="Example: 200 handmade blue pottery gift boxes for Diwali gifting, budget around ₹800 each, delivery in Delhi by 15 October." className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium">Quantity</label>
              <input type="text" placeholder="e.g. 200 units" className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Budget per unit</label>
              <input type="text" placeholder="e.g. ₹600 – ₹900" className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring" />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium">Delivery location</label>
              <input type="text" placeholder="e.g. New Delhi" className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Deadline</label>
              <input type="text" placeholder="e.g. 15 October 2026" className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring" />
            </div>
          </div>
          <div className="flex flex-wrap gap-3 pt-2">
            <VoiceButton label="Speak instead" />
            <Button type="submit"><Sparkles className="size-4" />Generate AI brief</Button>
          </div>
        </form>
        <div className="mt-8 rounded-2xl border border-border bg-card p-5">
          <div className="flex items-start gap-3">
            <div className="grid size-10 place-items-center rounded-xl bg-indigo text-primary-foreground"><Mic className="size-5" /></div>
            <div>
              <p className="font-display font-bold text-ink">Voice-first input</p>
              <p className="mt-1 text-sm text-muted-foreground">No forms to memorize. Just describe the product, quantity, budget, and timeline in your own words.</p>
            </div>
          </div>
        </div>
        <div className="mt-6 text-center">
          <Link to="/buyer/matches" className="inline-flex items-center gap-1 text-sm font-semibold text-terracotta">See example matches <ArrowRight className="size-4" /></Link>
        </div>
      </div>
    </AppShell>
  );
}

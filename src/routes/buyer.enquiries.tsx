import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, MessageCircle } from "lucide-react";
import { enquiries } from "@/lib/kala-data";
import { AppShell, Button, SectionHeading, StatusBadge } from "@/components/kala/ui";

export const Route = createFileRoute("/buyer/enquiries")({
  head: () => ({
    meta: [
      { title: "Buyer Enquiries — sih 2026" },
      { name: "description", content: "Manage enquiries from artisans on sih 2026." },
      { property: "og:title", content: "Buyer Enquiries — sih 2026" },
      { property: "og:description", content: "Manage enquiries from artisans." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: BuyerEnquiries,
});

function BuyerEnquiries() {
  return (
    <AppShell role="buyer" title="Enquiries" eyebrow="Conversations with artisans">
      <div className="mx-auto max-w-5xl">
        
        <div className="mt-7">
          <SectionHeading eyebrow="Inbox" title="Artisans interested in your briefs" action={<Link to="/buyer/requirements"><Button variant="quiet">New requirement <ArrowRight className="size-4" /></Button></Link>} />
        </div>
        <div className="mt-6 space-y-3">
          {enquiries.map((enquiry) => (
            <div key={enquiry.id} className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <div className="grid size-10 place-items-center rounded-xl bg-indigo-soft text-indigo"><MessageCircle className="size-5" /></div>
                <div>
                  <p className="font-display font-bold text-ink">{enquiry.buyer}</p>
                  <p className="text-sm text-muted-foreground">Interested in {enquiry.interest}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{enquiry.quantity} · {enquiry.budget} · Delivery: {enquiry.delivery}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 self-end sm:self-auto"><StatusBadge status={enquiry.status} /><Button variant="quiet" onClick={() => window.alert("Demo: chat would open.")}>Reply</Button></div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { BriefcaseBusiness, Globe2, Mail, UserRound } from "lucide-react";
import { AppShell, Button, SectionHeading } from "@/components/kala/ui";

export const Route = createFileRoute("/buyer/profile")({
  head: () => ({
    meta: [
      { title: "Buyer Profile — sih 2026" },
      { name: "description", content: "Manage your buyer profile on sih 2026." },
      { property: "og:title", content: "Buyer Profile — sih 2026" },
      { property: "og:description", content: "Manage your buyer profile." },
      { property: "og:type", content: "profile" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: BuyerProfile,
});

const buyer = { name: "ABC Enterprises", contact: "Rahul Sharma", location: "New Delhi, India", email: "procurement@abc.example", role: "Corporate Gifting" };

function BuyerProfile() {
  return (
    <AppShell role="buyer" title="Buyer profile" eyebrow="Your account">
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
        <section className="mt-8 rounded-2xl border border-border bg-card p-5 sm:p-7">
          <SectionHeading eyebrow="Preferences" title="What artisans see" description="Buyers on sih 2026 share verified intent, delivery regions, and typical budgets so artisans can evaluate fit before expressing interest." />
        </section>
      </div>
    </AppShell>
  );
}

function Info({ icon: Icon, label, value }: { icon: typeof BriefcaseBusiness; label: string; value: string }) {
  return (
    <div className="rounded-xl bg-muted/60 p-4">
      <Icon className="size-4 text-terracotta" />
      <p className="mt-3 text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm font-semibold text-ink">{value}</p>
    </div>
  );
}

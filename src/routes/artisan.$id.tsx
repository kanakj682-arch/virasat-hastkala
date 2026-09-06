import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, BadgeCheck, Globe2, MapPin, MessageCircle, Package, Quote, UserRound } from "lucide-react";
import { artisans, products, demoArtisan } from "@/lib/kala-data";
import { Button, SectionHeading, StatusBadge } from "@/components/kala/ui";

export const Route = createFileRoute("/artisan/$id")({
  head: () => ({
    meta: [
      { title: "Artisan Profile — sih 2026" },
      { name: "description", content: "View a public artisan profile and craft catalogue on sih 2026." },
      { property: "og:title", content: "Artisan Profile — sih 2026" },
      { property: "og:description", content: "View a public artisan profile and craft catalogue." },
      { property: "og:type", content: "profile" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ArtisanProfile,
});

const fallbackArtisan: (typeof artisans)[number] = artisans[0]!;

function ArtisanProfile() {
  const { id } = Route.useParams();
  const artisan = artisans.find((a) => a.id === id) ?? fallbackArtisan;
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-10">
          <Link to="/buyer/matches" className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground"><ArrowLeft className="size-4" />Back to matches</Link>
          <Link to="/" className="font-display text-lg font-bold text-ink">sih 2026</Link>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-10">
        <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
          <div className="h-32 bg-indigo" />
          <div className="px-5 pb-6 sm:px-8">
            <div className="-mt-12 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex items-end gap-4">
                <img src={artisan.image} alt={artisan.alt} className="size-24 rounded-2xl border-4 border-card object-cover shadow-lg" />
                <div className="pb-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="font-display text-2xl font-bold text-ink">{artisan.name}</h1>
                    <span className="flex items-center gap-1 rounded-full bg-moss-soft px-2.5 py-1 font-mono text-[10px] uppercase text-moss"><BadgeCheck className="size-3.5" />Future verification</span>
                  </div>
                  <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground"><MapPin className="size-4" />{artisan.location}</p>
                </div>
              </div>
              <Button onClick={() => window.alert("Demo: enquiry would be sent.")}><MessageCircle className="size-4" />Send enquiry</Button>
            </div>
            <div className="mt-7 grid gap-3 sm:grid-cols-3">
              <Info icon={Package} label="Craft" value={artisan.craft} />
              <Info icon={UserRound} label="Experience" value={demoArtisan.experience} />
              <Info icon={Globe2} label="Languages" value={demoArtisan.languages.join(" · ")} />
            </div>
          </div>
        </div>
        <div className="mt-8 grid gap-8 lg:grid-cols-[.85fr_1.15fr]">
          <div>
            <SectionHeading eyebrow="About" title="A story buyers can trust" />
            <p className="text-sm leading-relaxed text-muted-foreground">{demoArtisan.name} learned {demoArtisan.craft.split(" ").slice(1).join(" ")} from her family and has spent 12 years refining floral motifs that bring a quiet, joyful character to everyday homes. Every piece is shaped, painted, and finished by hand in her Jaipur workshop.</p>
            <div className="mt-5 flex items-start gap-3 rounded-2xl bg-saffron/15 p-4 text-sm leading-relaxed text-saffron-foreground"><Quote className="mt-0.5 size-5 shrink-0" />“I want more people to see the care behind each piece, not just the finished vase.”</div>
          </div>
          <div>
            <SectionHeading eyebrow="Catalogue" title="Products by this artisan" />
            <div className="grid gap-3 sm:grid-cols-3">
              {products.map((product) => (
                <div key={product.id} className="overflow-hidden rounded-2xl border border-border bg-card">
                  <img src={product.image} alt={product.imageAlt} className="aspect-square w-full object-cover" />
                  <div className="p-3">
                    <p className="line-clamp-2 text-sm font-semibold text-ink">{product.title}</p>
                    <p className="mt-2 font-display font-bold text-indigo">{product.price}</p>
                    <div className="mt-2"><StatusBadge status={product.status} /></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-8 flex justify-center">
          <Link to="/buyer"><Button variant="quiet"><ArrowRight className="size-4" />Back to buyer workspace</Button></Link>
        </div>
      </main>
    </div>
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

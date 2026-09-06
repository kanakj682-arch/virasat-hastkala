import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, BadgeCheck, Globe2, Loader2, MapPin, MessageCircle, Package, Pencil, Quote, UserRound } from "lucide-react";
import { demoArtisan, products } from "@/lib/kala-data";
import { AppShell, Button, SectionHeading, StatusBadge } from "@/components/kala/ui";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Artisan Profile — sih 2026" },
      { name: "description", content: "View Meena Devi’s professional digital artisan profile and craft catalogue." },
      { property: "og:title", content: "Artisan Profile — sih 2026" },
      { property: "og:description", content: "A professional profile for Meena Devi, Jaipur Blue Pottery artisan." },
      { property: "og:type", content: "profile" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Profile,
});

function Profile() {
  const [iframeLoaded, setIframeLoaded] = useState(false);

  return (
    <AppShell title="My profile" eyebrow="Your story">
      <div className="mx-auto max-w-5xl">
        <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
          <div className="h-32 bg-indigo" />
          <div className="px-5 pb-6 sm:px-8">
            <div className="-mt-12 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex items-end gap-4">
                <img
                  src={demoArtisan.image}
                  alt="Meena Devi in her blue pottery workshop"
                  width={816}
                  height={816}
                  className="size-24 rounded-2xl border-4 border-card object-cover shadow-lg"
                />
                <div className="pb-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="font-display text-2xl font-bold text-ink">{demoArtisan.name}</h1>
                    <span className="flex items-center gap-1 rounded-full bg-moss-soft px-2.5 py-1 font-mono text-[10px] uppercase text-moss">
                      <BadgeCheck className="size-3.5" />
                      Future verification
                    </span>
                  </div>
                  <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="size-4" />
                    {demoArtisan.location}
                  </p>
                </div>
              </div>
              <Button variant="quiet">
                <Pencil className="size-4" />
                Edit profile
              </Button>
            </div>

            <div className="mt-7 grid gap-3 sm:grid-cols-3">
              <Info icon={Package} label="Craft specialization" value={demoArtisan.craft} />
              <Info icon={UserRound} label="Experience" value={demoArtisan.experience} />
              <Info icon={Globe2} label="Languages" value={demoArtisan.languages.join(" · ")} />
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[.85fr_1.15fr]">
          <div>
            <SectionHeading eyebrow="About the artisan" title="A story buyers can trust" />
            <p className="text-sm leading-relaxed text-muted-foreground">
              Meena learned Jaipur Blue Pottery from her family and has spent 12 years refining floral motifs that bring a quiet, joyful character to everyday homes. Every piece is shaped, painted, and finished by hand in her Jaipur workshop.
            </p>
            <div className="mt-5 flex items-start gap-3 rounded-2xl bg-saffron/15 p-4 text-sm leading-relaxed text-saffron-foreground">
              <Quote className="mt-0.5 size-5 shrink-0" />
              “I want more people to see the care behind each piece, not just the finished vase.”
            </div>
            <div className="mt-5 rounded-2xl border border-border bg-card p-5">
              <p className="font-mono text-[10px] uppercase tracking-[.16em] text-terracotta">Production capacity</p>
              <p className="mt-2 font-display text-2xl font-bold text-ink">{demoArtisan.capacity}</p>
              <p className="mt-1 text-sm text-muted-foreground">Typical monthly output, based on current workshop capacity.</p>
            </div>
          </div>

          <div>
            <SectionHeading
              eyebrow="Digital catalogue"
              title="Products by Meena"
              action={
                <Link to="/products" className="text-sm font-semibold text-terracotta">
                  Manage <ArrowRight className="ml-1 inline size-4" />
                </Link>
              }
            />
            <div className="grid gap-3 sm:grid-cols-3">
              {products.map((product) => (
                <div key={product.id} className="overflow-hidden rounded-2xl border border-border bg-card">
                  <img
                    src={product.image}
                    alt={product.imageAlt}
                    width={912}
                    height={912}
                    loading="lazy"
                    className="aspect-square w-full object-cover"
                  />
                  <div className="p-3">
                    <p className="line-clamp-2 text-sm font-semibold text-ink">{product.title}</p>
                    <p className="mt-2 font-display font-bold text-indigo">{product.price}</p>
                    <div className="mt-2">
                      <StatusBadge status={product.status} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8">
          <SectionHeading
            eyebrow="Trust & verification"
            title="Karigar Verification"
            description="Submit your details to become a verified artisan on sih 2026. Verification helps buyers trust your craft and story."
          />
          <div className="relative overflow-hidden rounded-2xl border border-border bg-card">
            {!iframeLoaded && (
              <div className="absolute inset-0 z-10 grid place-items-center bg-card/90">
                <div className="flex flex-col items-center gap-3 text-muted-foreground">
                  <Loader2 className="size-8 animate-spin text-terracotta" />
                  <p className="text-sm font-medium">Loading verification form…</p>
                </div>
              </div>
            )}
            <iframe
              src="https://docs.google.com/forms/d/e/1FAIpQLSeAlngGQ3eY8EOvSPJOVkHADex-jxdtO0kTJSTx-ox-cUdumw/viewform?embedded=true"
              width="100%"
              height="600"
              onLoad={() => setIframeLoaded(true)}
              title="Karigar Verification Form"
              className="block h-[600px] w-full border-0 bg-white"
            />
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <Link to="/buyer">
            <Button variant="quiet">
              <MessageCircle className="size-4" />
              Preview buyer view
            </Button>
          </Link>
        </div>
      </div>
    </AppShell>
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

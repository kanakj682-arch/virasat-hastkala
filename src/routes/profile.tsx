import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { ArrowRight, BadgeCheck, Camera, Globe2, LogOut, MapPin, MessageCircle, Package, Pencil, Quote, UserRound } from "lucide-react";
import { toast } from "sonner";
import { products } from "@/lib/kala-data";
import { AppShell, Button, SectionHeading, StatusBadge } from "@/components/kala/ui";
import { KarigarVerification } from "@/components/kala/karigar-verification";
import { signOut, spokenLanguages, updateAccount, useAccount } from "@/lib/account-store";
import defaultAvatar from "@/assets/default-avatar.png";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "My Artisan Profile — sih 2026" },
      { name: "description", content: "Manage your artisan profile on sih 2026: photo, name, craft, language, and Karigar verification with phone confirmation." },
      { property: "og:title", content: "My Artisan Profile — sih 2026" },
      { property: "og:description", content: "Manage your photo, craft details, language and verification in one place." },
      { property: "og:type", content: "profile" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Profile,
});

/** Shrink a picked photo so it stays small enough to keep on the device. */
async function toSmallDataUrl(file: File): Promise<string> {
  const bitmap = await createImageBitmap(file);
  const size = 320;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("no canvas");
  const side = Math.min(bitmap.width, bitmap.height);
  context.drawImage(bitmap, (bitmap.width - side) / 2, (bitmap.height - side) / 2, side, side, 0, 0, size, size);
  return canvas.toDataURL("image/jpeg", 0.85);
}

function Profile() {
  const account = useAccount();
  const fileInput = useRef<HTMLInputElement>(null);
  const [editing, setEditing] = useState(false);

  const name = account?.name ?? "Guest artisan";
  const photo = account?.photo ?? defaultAvatar;
  const location = account?.location ?? "Add your village or city";
  const craft = account?.craft ?? "Add your craft";
  const experience = account?.experience ?? "Add your experience";
  const language = account?.language ?? "Add your language";
  const capacity = account?.capacity ?? "Add your monthly output";

  async function pickPhoto(file: File | undefined) {
    if (!file) return;
    if (!account) {
      toast.error("Sign in first so we can save your photo.");
      return;
    }
    try {
      const dataUrl = await toSmallDataUrl(file);
      updateAccount({ photo: dataUrl });
      toast.success("Profile photo updated.");
    } catch {
      toast.error("We could not read that image. Try another photo.");
    }
  }

  return (
    <AppShell title="My profile" eyebrow="Your story">
      <div className="mx-auto max-w-5xl">
        {!account && (
          <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-border bg-saffron/15 p-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm leading-relaxed text-saffron-foreground">
              You are browsing as a guest. Sign in with your phone to save your name, photo and language.
            </p>
            <Link to="/login" className="shrink-0"><Button>Sign in <ArrowRight className="size-4" /></Button></Link>
          </div>
        )}

        <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
          <div className="h-32 bg-indigo" />
          <div className="px-5 pb-6 sm:px-8">
            <div className="-mt-12 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex items-end gap-4">
                <div className="relative">
                  <img
                    src={photo}
                    alt={`${name} profile photo`}
                    width={512}
                    height={512}
                    className="size-24 rounded-2xl border-4 border-card bg-muted object-cover shadow-lg"
                  />
                  <button
                    type="button"
                    onClick={() => fileInput.current?.click()}
                    aria-label="Change profile photo"
                    className="absolute -bottom-1 -right-1 grid size-9 place-items-center rounded-full border-2 border-card bg-terracotta text-primary-foreground shadow-md hover:bg-terracotta/90"
                  >
                    <Camera className="size-4" />
                  </button>
                  <input
                    ref={fileInput}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(event) => { void pickPhoto(event.target.files?.[0]); event.target.value = ""; }}
                  />
                </div>
                <div className="pb-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="font-display text-2xl font-bold text-ink">{name}</h1>
                    {account?.verified && (
                      <span className="flex items-center gap-1 rounded-full bg-moss-soft px-2.5 py-1 font-mono text-[10px] uppercase text-moss">
                        <BadgeCheck className="size-3.5" />
                        Phone verified
                      </span>
                    )}
                  </div>
                  <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="size-4" />
                    {location}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="quiet" onClick={() => setEditing((value) => !value)}>
                  <Pencil className="size-4" />
                  {editing ? "Done" : "Edit profile"}
                </Button>
                {account && (
                  <Button variant="quiet" onClick={() => { signOut(); toast.success("Signed out."); }}>
                    <LogOut className="size-4" />
                    Sign out
                  </Button>
                )}
              </div>
            </div>

            {editing && account ? (
              <div className="mt-7 grid gap-4 sm:grid-cols-2">
                <EditField label="Name" value={account.name} onChange={(value) => updateAccount({ name: value })} />
                <EditField label="Village / city and state" value={account.location} onChange={(value) => updateAccount({ location: value })} />
                <EditField label="Craft specialization" value={account.craft} onChange={(value) => updateAccount({ craft: value })} />
                <EditField label="Experience" value={account.experience} onChange={(value) => updateAccount({ experience: value })} />
                <EditField label="Monthly capacity" value={account.capacity} onChange={(value) => updateAccount({ capacity: value })} />
                <label className="block">
                  <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Language</span>
                  <select
                    value={account.language}
                    onChange={(event) => updateAccount({ language: event.target.value })}
                    className="mt-2 min-h-12 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-terracotta"
                  >
                    {spokenLanguages.map((item) => <option key={item} value={item}>{item}</option>)}
                  </select>
                </label>
              </div>
            ) : (
              <div className="mt-7 grid gap-3 sm:grid-cols-3">
                <Info icon={Package} label="Craft specialization" value={craft} />
                <Info icon={UserRound} label="Experience" value={experience} />
                <Info icon={Globe2} label="Language" value={language} />
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[.85fr_1.15fr]">
          <div>
            <SectionHeading eyebrow="About the artisan" title="A story buyers can trust" />
            <p className="text-sm leading-relaxed text-muted-foreground">
              Buyers look for the person behind the craft. Add your craft, the years you have spent on it, and the language you are most comfortable in — every detail makes your listing easier to trust.
            </p>
            <div className="mt-5 flex items-start gap-3 rounded-2xl bg-saffron/15 p-4 text-sm leading-relaxed text-saffron-foreground">
              <Quote className="mt-0.5 size-5 shrink-0" />
              “I want more people to see the care behind each piece, not just the finished product.”
            </div>
            <div className="mt-5 rounded-2xl border border-border bg-card p-5">
              <p className="font-mono text-[10px] uppercase tracking-[.16em] text-terracotta">Production capacity</p>
              <p className="mt-2 font-display text-2xl font-bold text-ink">{capacity}</p>
              <p className="mt-1 text-sm text-muted-foreground">Typical monthly output, based on current workshop capacity.</p>
            </div>
          </div>

          <div>
            <SectionHeading
              eyebrow="Digital catalogue"
              title="Your products"
              action={
                <Link to="/products" className="text-sm font-semibold text-terracotta">
                  Manage <ArrowRight className="ml-1 inline size-4" />
                </Link>
              }
            />
            <div className="grid gap-3 sm:grid-cols-3">
              {products.slice(0, 3).map((product) => (
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
            description="Fill this short form to become a verified artisan on sih 2026. We confirm your phone with a one-time code, so buyers know the maker is real."
          />
          <KarigarVerification defaultName={account?.name ?? ""} defaultPhone={account?.phone ?? ""} defaultLanguage={account?.language ?? ""} />
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

function EditField({ label, value, onChange }: { label: string; value: string; onChange: (next: string) => void }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 min-h-12 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-terracotta"
      />
    </label>
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

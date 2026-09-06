import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Check, Edit3, Languages, RefreshCw, Sparkles, Tag, WandSparkles } from "lucide-react";
import pottery from "@/assets/blue-pottery-vase.jpg";
import { AppShell, Button, SectionHeading } from "@/components/kala/ui";
import { toast } from "sonner";
import { publishDraft, updateDraft, useDraft } from "@/lib/draft-store";
import { generateCatalogue, saveProduct } from "@/lib/catalog-api";

export const Route = createFileRoute("/catalogue")({ head: () => ({ meta: [{ title: "AI Smart Catalogue — sih 2026" }, { name: "description", content: "Review and edit an AI-generated craft catalogue before publishing." }, { property: "og:title", content: "AI Smart Catalogue — sih 2026" }, { property: "og:description", content: "Review every AI suggestion before your craft goes to market." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }), component: Catalogue });

function Catalogue() {
  const navigate = useNavigate();
  const draft = useDraft();
  const [editing, setEditing] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [publishing, setPublishing] = useState(false);

  const image = draft.photo ?? pottery;
  const title = draft.title;
  const description = draft.description;
  const tags = draft.tags;

  async function regenerate() {
    setApiError(null);
    setRegenerating(true);
    try {
      updateDraft(await generateCatalogue({ photo: draft.photo, transcript: draft.transcript }));
      toast.success("Catalogue refreshed");
    } catch (error) {
      const message = error instanceof Error ? error.message : "We could not refresh this catalogue.";
      setApiError(message);
      toast.error(message);
    } finally {
      setRegenerating(false);
    }
  }

  async function handlePublish() {
    setApiError(null);
    setPublishing(true);
    try {
      await saveProduct(draft);
      publishDraft(pottery);
      toast.success("Your product is published");
      navigate({ to: "/publish-success" });
    } catch (error) {
      const message = error instanceof Error ? error.message : "We could not publish your product.";
      setApiError(message);
      toast.error(message);
    } finally {
      setPublishing(false);
    }
  }

  return <AppShell title="AI smart catalogue" eyebrow="Review before publishing"><div className="mx-auto max-w-5xl">
    <Link to="/add-product" className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="size-4" />Back to add product</Link>
    <SectionHeading eyebrow="Step 2 · Your review matters" title="Here’s what AI understood" description="These are suggestions, not final decisions. Edit anything that doesn’t sound like you." />
    
    <div className="mt-7 grid gap-6 lg:grid-cols-[.85fr_1.15fr]">
      <div className="rounded-2xl border border-border bg-card p-3 shadow-sm">
        <img src={image} alt={title} className="aspect-square w-full rounded-xl object-cover" />
        <div className="mt-3 flex items-center gap-2 rounded-xl bg-moss-soft px-3 py-2 text-xs text-moss"><Check className="size-4" />Image understood{draft.craft ? ` · ${draft.craft}` : ""}</div>
      </div>
      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[.18em] text-terracotta">AI-generated draft</p>
            {editing ? <input value={title} onChange={(event) => updateDraft({ title: event.target.value })} aria-label="Product title" className="mt-2 w-full rounded-xl border border-input bg-background px-3 py-2 font-display text-xl font-bold text-ink outline-none focus-visible:ring-2 focus-visible:ring-ring" /> : <h2 className="mt-2 font-display text-2xl font-bold text-ink">{title}</h2>}
          </div>
          <span className="flex items-center gap-1 rounded-full bg-saffron/20 px-2.5 py-1 font-mono text-[10px] uppercase text-saffron-foreground"><Sparkles className="size-3" />Draft</span>
        </div>
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <Field label="Category" value={draft.category} editing={editing} onChange={(value) => updateDraft({ category: value })} />
          <Field label="Craft" value={draft.craft} editing={editing} onChange={(value) => updateDraft({ craft: value })} />
          <Field label="Material" value={draft.material} editing={editing} onChange={(value) => updateDraft({ material: value })} />
          <Field label="Suggested price" value={draft.price} editing={editing} onChange={(value) => updateDraft({ price: value })} />
        </div>
        <div className="mt-6">
          <p className="text-xs font-semibold uppercase tracking-[.12em] text-muted-foreground">Product description</p>
          {editing ? <textarea value={description} rows={4} onChange={(event) => updateDraft({ description: event.target.value })} aria-label="Product description" className="mt-2 w-full rounded-xl border border-input bg-background p-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring" /> : <p className="mt-2 text-sm leading-relaxed text-foreground/80">{description}</p>}
        </div>
        <div className="mt-6">
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[.12em] text-muted-foreground"><Tag className="size-3.5" />Suggested tags</p>
          <div className="mt-3 flex flex-wrap gap-2">{tags.map((tag) => <span key={tag} className="rounded-full border border-border bg-muted px-3 py-1.5 text-xs font-medium">{tag}</span>)}</div>
        </div>
        <div className="mt-6 flex items-center gap-2 rounded-xl bg-indigo-soft p-3 text-sm text-indigo"><Languages className="size-4 shrink-0" /><span><strong>Available languages:</strong> English · हिन्दी</span></div>
        <div className="mt-7 grid gap-2 sm:grid-cols-3">
          <Button variant="quiet" onClick={() => setEditing((value) => !value)}><Edit3 className="size-4" />{editing ? "Done editing" : "Edit"}</Button>
          <Button variant="quiet" onClick={regenerate} disabled={regenerating}><RefreshCw className="size-4" />{regenerating ? "Regenerating…" : "Regenerate"}</Button>
          <Button variant="quiet" onClick={regenerate} disabled={regenerating}><WandSparkles className="size-4" />Refresh from AI</Button>
        </div>
        {apiError && <p role="alert" className="mt-3 text-sm font-medium text-destructive">{apiError}</p>}
        <Button className="mt-3 min-h-12 w-full" onClick={handlePublish} disabled={publishing}>{publishing ? "Publishing…" : "Confirm & publish"} <Check className="size-4" /></Button>
      </div>
    </div>
  </div></AppShell>;
}

function Field({ label, value, editing, onChange }: { label: string; value: string; editing: boolean; onChange: (value: string) => void }) {
  return <div>
    <p className="text-xs text-muted-foreground">{label}</p>
    {editing ? <input value={value} aria-label={label} onChange={(event) => onChange(event.target.value)} className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm font-semibold text-ink outline-none focus-visible:ring-2 focus-visible:ring-ring" /> : <p className="mt-1 text-sm font-semibold text-ink">{value}</p>}
  </div>;
}

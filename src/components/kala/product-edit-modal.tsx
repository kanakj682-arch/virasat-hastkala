import { useEffect, useRef, useState } from "react";
import { Loader2, Sparkles, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/kala/ui";
import { generateMarketingCopy, saveProductEdit } from "@/lib/catalog-store";
import type { Product } from "@/lib/kala-data";

export function ProductEditModal({ product, onClose }: { product: Product; onClose: () => void }) {
  const [title, setTitle] = useState(product.title);
  const [price, setPrice] = useState(product.price);
  const [description, setDescription] = useState(product.description ?? "");
  const [image, setImage] = useState(product.image);
  const [tags, setTags] = useState((product.tags ?? []).join(", "));
  const [copy, setCopy] = useState<{ caption: string; keywords: string[] } | null>(null);
  const [generating, setGenerating] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function onKey(event: KeyboardEvent) { if (event.key === "Escape") onClose(); }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  function readFile(file: File | undefined) {
    if (!file) return;
    if (!file.type.startsWith("image/")) { toast.error("Please choose a JPG or PNG image."); return; }
    const reader = new FileReader();
    reader.onload = () => { if (typeof reader.result === "string") { setImage(reader.result); toast.success("New photo added"); } };
    reader.readAsDataURL(file);
  }

  function handleGenerate() {
    setGenerating(true);
    window.setTimeout(() => {
      const result = generateMarketingCopy({ title, category: product.category, price });
      setCopy(result);
      if (!description.trim()) setDescription(result.caption.split("\n\n")[1] ?? "");
      setTags((current) => Array.from(new Set([...current.split(",").map((t) => t.trim()).filter(Boolean), ...result.keywords.slice(0, 3)])).join(", "));
      setGenerating(false);
      toast.success("AI marketing copy and tags ready");
    }, 700);
  }

  function handleSave() {
    saveProductEdit(product.id, {
      title: title.trim() || product.title,
      price: price.trim() || product.price,
      description: description.trim(),
      image,
      imageAlt: title.trim() || product.imageAlt,
      tags: tags.split(",").map((tag) => tag.trim()).filter(Boolean),
    });
    toast.success("Product updated");
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-end bg-ink/50 p-0 backdrop-blur-sm sm:place-items-center sm:p-4" role="dialog" aria-modal="true" aria-label={`Edit ${product.title}`}>
      <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl border border-border bg-card p-5 shadow-2xl sm:rounded-3xl sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[.18em] text-terracotta">Edit published product</p>
            <h2 className="mt-1 font-display text-2xl font-bold text-ink">{product.title}</h2>
          </div>
          <button onClick={onClose} aria-label="Close" className="rounded-xl p-2 text-muted-foreground hover:bg-muted"><X className="size-5" /></button>
        </div>

        <div className="mt-5 flex flex-col gap-4 sm:flex-row">
          <img src={image} alt={product.imageAlt} className="size-28 shrink-0 rounded-2xl object-cover" />
          <div className="flex flex-col justify-center gap-2">
            <input ref={fileRef} type="file" accept="image/*" className="sr-only" onChange={(event) => readFile(event.target.files?.[0])} />
            <Button variant="quiet" onClick={() => fileRef.current?.click()}><Upload className="size-4" />Change photo</Button>
            <p className="text-xs text-muted-foreground">JPG or PNG · shown to buyers straight away</p>
          </div>
        </div>

        <label className="mt-5 block text-sm font-medium">Title
          <input value={title} onChange={(event) => setTitle(event.target.value)} className="mt-2 w-full rounded-xl border border-input bg-background p-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring" />
        </label>
        <label className="mt-4 block text-sm font-medium">Price
          <input value={price} onChange={(event) => setPrice(event.target.value)} className="mt-2 w-full rounded-xl border border-input bg-background p-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring" />
        </label>
        <label className="mt-4 block text-sm font-medium">Description
          <textarea value={description} onChange={(event) => setDescription(event.target.value)} rows={4} className="mt-2 w-full rounded-xl border border-input bg-background p-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring" />
        </label>
        <label className="mt-4 block text-sm font-medium">Tags
          <input value={tags} onChange={(event) => setTags(event.target.value)} placeholder="Chanderi Weave, Eco Dyes" className="mt-2 w-full rounded-xl border border-input bg-background p-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring" />
        </label>

        <Button variant="secondary" className="mt-5 w-full" onClick={handleGenerate} disabled={generating}>
          {generating ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
          {generating ? "Writing your copy…" : "Generate AI Marketing Copy & Tags"}
        </Button>

        {copy && (
          <div className="mt-4 space-y-3 rounded-2xl border border-indigo/20 bg-indigo-soft p-4">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[.16em] text-indigo">Instagram caption</p>
              <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-foreground/80">{copy.caption}</p>
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[.16em] text-indigo">SEO keywords</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {copy.keywords.map((keyword) => <span key={keyword} className="rounded-full bg-card px-3 py-1 text-xs text-foreground/75">{keyword}</span>)}
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 flex flex-col gap-2 sm:flex-row-reverse">
          <Button className="sm:flex-1" onClick={handleSave}>Save changes</Button>
          <Button variant="quiet" className="sm:flex-1" onClick={onClose}>Cancel</Button>
        </div>
      </div>
    </div>
  );
}

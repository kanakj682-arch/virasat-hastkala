import { useEffect, useState } from "react";
import { LifeBuoy, MessageCircle, Phone, X } from "lucide-react";
import { toast } from "sonner";


const faqs = [
  { q: "How do I add a product?", a: "Open ‘Add product’, take or upload a photo, then speak or type a few lines about your craft. We prepare the listing for you to review." },
  { q: "Can I change a product after publishing?", a: "Yes. Every published product has an ‘Edit’ button — you can change the title, price, description, photo, and tags any time." },
  { q: "How are opportunities matched?", a: "Buyer briefs are ranked by your craft, price band, monthly capacity, and delivery region, and the list refreshes as your catalogue changes." },
  { q: "Do I get paid directly?", a: "Yes. Buyers deal with you directly, so 100% of the agreed amount reaches the artisan without a middleman." },
];

export function HelpSupport() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function onKey(event: KeyboardEvent) { if (event.key === "Escape") setOpen(false); }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <button type="button" aria-label="Help and support" title="Help and support" onClick={() => setOpen(true)} className="grid size-10 place-items-center rounded-xl border border-border bg-card text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"><LifeBuoy className="size-[18px]" /></button>
      {open && (
        <div className="fixed inset-0 z-50 grid place-items-end bg-ink/50 backdrop-blur-sm sm:place-items-center sm:p-4" role="dialog" aria-modal="true" aria-label="Help and support">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-t-3xl border border-border bg-card p-5 shadow-2xl sm:rounded-3xl sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[.18em] text-terracotta">We are here for you</p>
                <h2 className="mt-1 font-display text-2xl font-bold text-ink">Help &amp; Support</h2>
              </div>
              <button onClick={() => setOpen(false)} aria-label="Close" className="rounded-xl p-2 text-muted-foreground hover:bg-muted"><X className="size-5" /></button>
            </div>

            <div className="mt-5 grid gap-2 sm:grid-cols-2">
              <button type="button" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-indigo px-4 text-sm font-semibold text-primary-foreground hover:bg-indigo/90" onClick={() => toast.success("A support saathi will call you within 10 minutes")}><Phone className="size-4" />Request a callback</button>
              <button type="button" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 text-sm font-semibold hover:bg-muted" onClick={() => toast.success("Chat request sent — we usually reply in 2 minutes")}><MessageCircle className="size-4" />Chat with us</button>
            </div>

            <div className="mt-6 space-y-3">
              {faqs.map((faq) => (
                <details key={faq.q} className="rounded-2xl border border-border bg-muted/40 p-4">
                  <summary className="cursor-pointer text-sm font-semibold text-ink">{faq.q}</summary>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{faq.a}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

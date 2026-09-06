import { useEffect, useMemo, useState } from "react";
import { ChevronDown, LifeBuoy, MessageCircle, Phone, Search, X } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const WHATSAPP_SUPPORT_URL = "https://wa.me/918000000000?text=Namaste%2C%20I%20need%20help%20with%20sih%202026";

const faqs = [
  {
    q: "How does the 90/10 UPI payment split work?",
    a: "When a buyer pays through UPI, 90% of the amount is settled straight into the artisan's own bank account and 10% is held in escrow until delivery is confirmed. The moment the buyer marks the order as received, the remaining 10% is released — usually within 24 hours. There is no middleman commission on either part.",
    tags: "payment upi money escrow 90 10 split bank settlement",
  },
  {
    q: "When exactly do I receive the UPI money?",
    a: "The 90% share reaches you the same working day the buyer pays. The 10% balance is released after delivery confirmation. You can see both amounts, with dates, on every order in your dashboard.",
    tags: "upi payout timing money received when",
  },
  {
    q: "How do I list a product?",
    a: "Open 'Add product' — no login is needed to try it. Take or upload a photo, then speak or type a few lines about your craft in your own language. The AI drafts the title, description, tags and a suggested price, and nothing is published until you review and confirm it.",
    tags: "listing add product photo voice publish catalogue",
  },
  {
    q: "Can I change a product after publishing?",
    a: "Yes. Every published product has an 'Edit' button — title, price, description, photo and tags can be changed any time, and buyers see the update immediately.",
    tags: "edit change update product published",
  },
  {
    q: "What is the AI authenticity check?",
    a: "Before a listing goes live, the AI compares your photo, materials and process notes against known handmade craft patterns — hand-tool marks, natural dye variation, small irregularities — and flags anything that looks machine-made or mass-produced. Verified listings carry an authenticity badge, which is what buyers filter on.",
    tags: "ai authenticity verification handmade badge fake machine",
  },
  {
    q: "How are buyer opportunities matched to me?",
    a: "Buyer briefs are ranked by your craft, price band, monthly capacity and delivery region. The list refreshes as your catalogue grows, so adding products improves your matches.",
    tags: "opportunities matching buyer brief score",
  },
  {
    q: "Do I need to log in to use the app?",
    a: "No. Adding a product, browsing opportunities and listening to artisan stories all work without an account. You only sign in when you want to save a catalogue permanently or reply to a buyer.",
    tags: "login account signup mandatory optional",
  },
];

export function HelpSupport({ compact = true }: { compact?: boolean }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return faqs;
    return faqs.filter((faq) => `${faq.q} ${faq.a} ${faq.tags}`.toLowerCase().includes(q));
  }, [query]);

  return (
    <>
      {compact ? (
        <button
          type="button"
          aria-label="Help and FAQs"
          title="Help & FAQs"
          onClick={() => setOpen(true)}
          className="grid size-10 place-items-center rounded-xl border border-border bg-card text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <LifeBuoy className="size-[18px]" />
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-border bg-card px-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
        >
          <LifeBuoy className="size-4 text-indigo" />
          Help &amp; FAQs
        </button>
      )}

      {open && (
        <div className="fixed inset-0 z-50 grid place-items-end bg-ink/50 backdrop-blur-sm sm:place-items-center sm:p-4" role="dialog" aria-modal="true" aria-label="Help and FAQs">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-t-3xl border border-border bg-card p-5 shadow-2xl sm:rounded-3xl sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[.18em] text-terracotta">We are here for you</p>
                <h2 className="mt-1 font-display text-2xl font-bold text-ink">Help &amp; FAQs</h2>
              </div>
              <button onClick={() => setOpen(false)} aria-label="Close" className="rounded-xl p-2 text-muted-foreground hover:bg-muted">
                <X className="size-5" />
              </button>
            </div>

            <label className="mt-5 flex items-center gap-2 rounded-xl border border-border bg-muted/40 px-3 py-2.5">
              <Search className="size-4 shrink-0 text-muted-foreground" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search help — payments, listing, authenticity…"
                aria-label="Search FAQs"
                className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
              {query && (
                <button type="button" onClick={() => setQuery("")} aria-label="Clear search" className="text-muted-foreground hover:text-foreground">
                  <X className="size-4" />
                </button>
              )}
            </label>

            <div className="mt-4 space-y-2">
              {filtered.length === 0 && (
                <p className="rounded-2xl border border-border bg-muted/40 p-4 text-sm text-muted-foreground">
                  No answer matched “{query}”. Message us on WhatsApp and a support saathi will help you.
                </p>
              )}
              {filtered.map((faq) => {
                const isOpen = expanded === faq.q;
                return (
                  <div key={faq.q} className="overflow-hidden rounded-2xl border border-border bg-muted/40">
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      onClick={() => setExpanded(isOpen ? null : faq.q)}
                      className="flex w-full items-center justify-between gap-3 p-4 text-left text-sm font-semibold text-ink"
                    >
                      {faq.q}
                      <ChevronDown className={cn("size-4 shrink-0 text-muted-foreground transition-transform", isOpen && "rotate-180")} />
                    </button>
                    {isOpen && <p className="px-4 pb-4 text-sm leading-relaxed text-muted-foreground">{faq.a}</p>}
                  </div>
                );
              })}
            </div>

            <div className="mt-6 grid gap-2 sm:grid-cols-2">
              <a
                href={WHATSAPP_SUPPORT_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-moss px-4 text-sm font-semibold text-primary-foreground hover:opacity-90"
              >
                <MessageCircle className="size-4" />
                Contact WhatsApp Support
              </a>
              <button
                type="button"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 text-sm font-semibold hover:bg-muted"
                onClick={() => toast.success("A support saathi will call you within 10 minutes")}
              >
                <Phone className="size-4" />
                Request a callback
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

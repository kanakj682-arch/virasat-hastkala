import React, { useState } from "react";
import { Link } from "@tanstack/react-router";
import { opportunities, type Opportunity } from "@/lib/kala-data";
import { Button, MatchBar, Score, StatusBadge } from "@/components/kala/ui";

// ==========================================
// 1. SIMPLE & INSTANT WORKING FORM
// ==========================================
export default function Kal() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    type: "Karigar",
    details: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-xl mx-auto my-8 p-6 bg-white rounded-2xl shadow-lg border border-gray-100 font-sans">
      <h2 className="text-2xl font-bold text-gray-800 text-center mb-2">Karigar & Buyer Registration</h2>
      <p className="text-gray-500 text-xs text-center mb-6">Apni details bharein, hum aapse turant sampark karenge.</p>

      {submitted ? (
        <div className="p-6 bg-green-50 rounded-xl text-center border border-green-200">
          <h3 className="text-lg font-bold text-green-800 mb-1">✓ Form Safaltapurvak Submit Ho Gaya!</h3>
          <p className="text-xs text-green-600">Aapki details mil gayi hain. Hum aapse jald hi contact karenge.</p>
          <button
            type="button"
            onClick={() => {
              setSubmitted(false);
              setFormData({ name: "", phone: "", type: "Karigar", details: "" });
            }}
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg text-xs font-semibold"
          >
            Naya Form Bharein
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Pura Naam *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Apna naam likhein"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Mobile Number *</label>
            <input
              type="tel"
              required
              pattern="[0-9]{10}"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="10 digit number"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Aap kaun hain? *</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-indigo-500"
            >
              <option value="Karigar">Karigar / Artisan</option>
              <option value="Buyer">Buyer / Business</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Kala / Requirement ki jankari</label>
            <textarea
              rows={3}
              value={formData.details}
              onChange={(e) => setFormData({ ...formData, details: e.target.value })}
              placeholder="Apni art ya requirement ke baare me likhein"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-indigo-500 resize-none"
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-xl text-sm hover:bg-indigo-700 transition"
          >
            Submit Details
          </button>
        </form>
      )}
    </div>
  );
}

// ==========================================
// 2. EXISTING OPPORTUNITY COMPONENTS
// ==========================================
export function OpportunityCard({ opportunity, compact = false }: { opportunity: Opportunity; compact?: boolean }) {
  return (
    <article className="rounded-2xl border border-border bg-card p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[.16em] text-terracotta">{opportunity.category}</p>
          <h3 className="mt-1 font-display text-lg font-bold leading-tight text-ink">{opportunity.title}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{opportunity.buyer}</p>
        </div>
        <Score value={opportunity.score} />
      </div>
      <div className="mt-4">
        <MatchBar value={opportunity.score} />
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div>
          <p className="text-xs text-muted-foreground">Quantity</p>
          <p className="mt-0.5 font-medium">{opportunity.quantity}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Budget</p>
          <p className="mt-0.5 font-medium">{opportunity.budget}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Location</p>
          <p className="mt-0.5 font-medium">{opportunity.location}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Required by</p>
          <p className="mt-0.5 font-medium">{opportunity.deadline.replace(" 2026", "")}</p>
        </div>
      </div>
      {!compact && (
        <div className="mt-4 grid grid-cols-1 gap-1.5 text-xs text-muted-foreground sm:grid-cols-2">
          {opportunity.reasons.map((reason) => (
            <span key={reason} className="flex items-center gap-1.5">
              <span className="text-moss">✓</span>
              {reason}
            </span>
          ))}
        </div>
      )}
      <div className="mt-5 flex gap-2">
        <Link
          to="/opportunities/$id"
          params={{ id: opportunity.id }}
          className="flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-border px-3 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
        >
          View opportunity →
        </Link>
        {!compact && (
          <Button className="flex-1" onClick={() => window.alert("Interest noted in demo mode.")}>
            Express interest
          </Button>
        )}
      </div>
    </article>
  );
}

export function MiniOpportunity({ opportunity }: { opportunity: Opportunity }) {
  return (
    <Link
      to="/opportunities/$id"
      params={{ id: opportunity.id }}
      className="group flex items-center gap-3 rounded-xl border border-border bg-card p-3 transition-colors hover:bg-muted"
    >
      <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-saffron/20 text-terracotta">✨</div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-ink">{opportunity.title}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {opportunity.buyer} · {opportunity.quantity}
        </p>
      </div>
      <div className="text-right">
        <p className="font-display font-bold text-indigo">{opportunity.score}%</p>
        <p className="font-mono text-[9px] uppercase tracking-[.1em] text-muted-foreground">match</p>
      </div>
      <span className="text-muted-foreground transition-transform group-hover:translate-x-0.5">›</span>
    </Link>
  );
}

export function OpportunityMeta({ opportunity }: { opportunity: Opportunity }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div className="flex gap-3 rounded-xl bg-muted/60 p-3">
        <span className="mt-0.5 text-terracotta">👥</span>
        <div>
          <p className="text-xs text-muted-foreground">Buyer</p>
          <p className="mt-0.5 text-sm font-semibold">{opportunity.buyer}</p>
        </div>
      </div>
      <div className="flex gap-3 rounded-xl bg-muted/60 p-3">
        <span className="mt-0.5 text-terracotta">📦</span>
        <div>
          <p className="text-xs text-muted-foreground">Requirement</p>
          <p className="mt-0.5 text-sm font-semibold">{opportunity.quantity}</p>
        </div>
      </div>
      <div className="flex gap-3 rounded-xl bg-muted/60 p-3">
        <span className="mt-0.5 text-terracotta">📍</span>
        <div>
          <p className="text-xs text-muted-foreground">Location</p>
          <p className="mt-0.5 text-sm font-semibold">{opportunity.location}</p>
        </div>
      </div>
      <div className="flex gap-3 rounded-xl bg-muted/60 p-3">
        <span className="mt-0.5 text-terracotta">📅</span>
        <div>
          <p className="text-xs text-muted-foreground">Deadline</p>
          <p className="mt-0.5 text-sm font-semibold">{opportunity.deadline}</p>
        </div>
      </div>
    </div>
  );
}

export function OpportunityList({ limit }: { limit?: number }) {
  return (
    <div className="grid gap-4 xl:grid-cols-2">
      {(limit ? opportunities.slice(0, limit) : opportunities).map((opportunity) => (
        <OpportunityCard key={opportunity.id} opportunity={opportunity} />
      ))}
    </div>
  );
}

export function EnquiryStatus({ status }: { status: string }) {
  return <StatusBadge status={status} />;
}

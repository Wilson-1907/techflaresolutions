"use client";

import { useState } from "react";
import { Mail, Save, ShoppingCart, CheckCircle2 } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { company } from "@/data/site";
import { paymentPolicy } from "@/data/policies";
import { apiUrl } from "@/lib/api-base";
import { formSelectClass } from "@/lib/form-styles";

interface ProductOrderPanelProps {
  productSlug: string;
  productTitle: string;
  plans: { key: string; label: string; price: string }[];
  terms?: string[];
}

function parsePlanAmount(price: string): number {
  const match = price.match(/[\d,]+/);
  if (!match) return 0;
  return Number(match[0].replace(/,/g, "")) || 0;
}

export function ProductOrderPanel({
  productSlug,
  productTitle,
  plans,
  terms = [],
}: ProductOrderPanelProps) {
  const [form, setForm] = useState({
    plan: plans[1]?.key || plans[0]?.key || "professional",
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    organization: "",
    notes: "",
    amountKes: "",
  });
  const [saved, setSaved] = useState<string[]>([]);
  const [result, setResult] = useState<{ mailto: string; emailPreview: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const selectedPlan = plans.find((p) => p.key === form.plan);
  const suggestedAmount = parsePlanAmount(selectedPlan?.price || "0");

  async function handleOrder() {
    setLoading(true);
    try {
      const amount = Number(form.amountKes) || suggestedAmount;
      const res = await fetch(apiUrl("/api/products/order"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          productSlug,
          productTitle,
          plan: form.plan,
          customerName: form.customerName,
          customerEmail: form.customerEmail,
          customerPhone: form.customerPhone,
          organization: form.organization,
          notes: form.notes,
          amountKes: amount || undefined,
          website: "",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setResult({ mailto: data.mailto, emailPreview: data.emailPreview });
    } catch {
      alert("Could not process order. Sign in and verify your email, or contact us directly.");
    } finally {
      setLoading(false);
    }
  }

  if (result) {
    return (
      <GlassCard className="border-life-green/30">
        <CheckCircle2 className="h-10 w-10 text-life-green mb-3" />
        <h3 className="text-xl font-bold mb-2">Order received</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Our team will contact you at <strong>{form.customerEmail}</strong>. {paymentPolicy.channel}
        </p>
        <Button href={result.mailto} variant="outline" className="w-full mb-2">
          <Mail className="h-4 w-4" /> Email order details
        </Button>
        <Button variant="ghost" onClick={() => setResult(null)} className="w-full">
          Place another order
        </Button>
      </GlassCard>
    );
  }

  return (
    <GlassCard className="border-gold/30">
      <div className="flex items-center gap-2 mb-4">
        <ShoppingCart className="h-5 w-5 text-gold" />
        <h2 className="text-xl font-bold">Place Order</h2>
      </div>
      <p className="text-sm text-muted-foreground mb-4">
        Sign in to order. Payment instructions are sent via our official email: <strong className="text-gold">{company.email}</strong>
      </p>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1.5">Select Plan</label>
          <select
            value={form.plan}
            onChange={(e) => setForm({ ...form, plan: e.target.value })}
            className={formSelectClass}
          >
            {plans.map((p) => (
              <option key={p.key} value={p.key}>{p.label} — {p.price}</option>
            ))}
          </select>
        </div>

        <input
          type="number"
          min={1}
          placeholder={`Amount in KES${suggestedAmount ? ` (suggested ${suggestedAmount})` : ""}`}
          value={form.amountKes}
          onChange={(e) => setForm({ ...form, amountKes: e.target.value })}
          className="w-full rounded-xl border border-gold/20 bg-deep-blue/50 px-4 py-3"
        />
        <input required placeholder="Your full name" value={form.customerName}
          onChange={(e) => setForm({ ...form, customerName: e.target.value })}
          className="w-full rounded-xl border border-gold/20 bg-deep-blue/50 px-4 py-3" />
        <input required type="email" placeholder="Your email" value={form.customerEmail}
          onChange={(e) => setForm({ ...form, customerEmail: e.target.value })}
          className="w-full rounded-xl border border-gold/20 bg-deep-blue/50 px-4 py-3" />
        <input required type="tel" placeholder={`Phone (e.g. ${company.phone})`}
          value={form.customerPhone}
          onChange={(e) => setForm({ ...form, customerPhone: e.target.value })}
          className="w-full rounded-xl border border-gold/20 bg-deep-blue/50 px-4 py-3" />
        <input placeholder="Organization / Institution" value={form.organization}
          onChange={(e) => setForm({ ...form, organization: e.target.value })}
          className="w-full rounded-xl border border-gold/20 bg-deep-blue/50 px-4 py-3" />
        <textarea rows={3} placeholder="Project requirements"
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
          className="w-full rounded-xl border border-gold/20 bg-deep-blue/50 px-4 py-3 resize-none" />

        {terms.length > 0 && (
          <div className="rounded-xl bg-deep-blue/40 p-4 text-xs text-muted-foreground">
            <p className="font-semibold text-gold mb-2">Terms & Conditions</p>
            <ul className="space-y-1 list-disc pl-4">{terms.map((t) => <li key={t}>{t}</li>)}</ul>
          </div>
        )}

        <Button
          className="w-full"
          disabled={
            loading ||
            !form.customerName ||
            !form.customerEmail ||
            !form.customerPhone
          }
          onClick={handleOrder}
        >
          {loading ? "Submitting..." : "Submit Order"}
        </Button>
        <Button variant="outline" className="w-full" onClick={() => {
          const list = JSON.parse(localStorage.getItem("techflare-saved-orders") || "[]");
          list.push({ productTitle, plan: form.plan });
          localStorage.setItem("techflare-saved-orders", JSON.stringify(list));
          setSaved(list.map((o: { productTitle: string }) => o.productTitle));
        }}>
          <Save className="h-4 w-4" /> Save for Later
        </Button>
        {saved.length > 0 && <p className="text-xs text-muted-foreground">Saved: {saved.join(", ")}</p>}
      </div>
    </GlassCard>
  );
}

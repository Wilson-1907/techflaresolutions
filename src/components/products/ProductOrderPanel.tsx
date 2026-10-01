"use client";

import { useState } from "react";
import { Mail, Save, ShoppingCart, CheckCircle2 } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { company } from "@/data/site";

interface ProductOrderPanelProps {
  productSlug: string;
  productTitle: string;
  plans: { key: string; label: string; price: string }[];
  terms?: string[];
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
    acceptedTerms: false,
  });
  const [saved, setSaved] = useState<string[]>([]);
  const [result, setResult] = useState<{ mailto: string; emailPreview: string } | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleOrder() {
    if (!form.acceptedTerms) return;
    setLoading(true);
    try {
      const res = await fetch("/api/products/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productSlug,
          productTitle,
          plan: form.plan,
          customerName: form.customerName,
          customerEmail: form.customerEmail,
          customerPhone: form.customerPhone,
          organization: form.organization,
          notes: form.notes,
          acceptedTerms: true,
          website: "",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setResult({ mailto: data.mailto, emailPreview: data.emailPreview });

      const savedOrders = JSON.parse(localStorage.getItem("techflare-saved-orders") || "[]");
      savedOrders.push({ productTitle, plan: form.plan, date: new Date().toISOString() });
      localStorage.setItem("techflare-saved-orders", JSON.stringify(savedOrders));
      setSaved(savedOrders.map((o: { productTitle: string }) => o.productTitle));
    } catch {
      alert("Could not process order. Please try again or email us directly.");
    } finally {
      setLoading(false);
    }
  }

  function saveForLater() {
    const item = { productSlug, productTitle, plan: form.plan, savedAt: new Date().toISOString() };
    const list = JSON.parse(localStorage.getItem("techflare-saved-orders") || "[]");
    list.push(item);
    localStorage.setItem("techflare-saved-orders", JSON.stringify(list));
    setSaved(list.map((o: { productTitle: string }) => o.productTitle));
  }

  if (result) {
    return (
      <GlassCard className="border-life-green/30">
        <CheckCircle2 className="h-10 w-10 text-life-green mb-3" />
        <h3 className="text-xl font-bold mb-2">Order Prepared!</h3>
        <p className="text-sm text-muted-foreground mb-4">
          We composed your request email to {company.solutionsEmail}. Send it to complete your order — no account required for built-in products.
        </p>
        <pre className="text-xs bg-deep-blue/50 p-4 rounded-xl overflow-x-auto mb-4 whitespace-pre-wrap select-none">
          {result.emailPreview}
        </pre>
        <Button href={result.mailto} className="w-full mb-2">
          <Mail className="h-4 w-4" /> Send Order Email
        </Button>
        <Button variant="outline" onClick={() => setResult(null)} className="w-full">
          Edit Order
        </Button>
      </GlassCard>
    );
  }

  return (
    <GlassCard className="border-gold/30">
      <div className="flex items-center gap-2 mb-4">
        <ShoppingCart className="h-5 w-5 text-gold" />
        <h2 className="text-xl font-bold">Order This Product</h2>
      </div>
      <p className="text-sm text-muted-foreground mb-4">
        No sign-in needed. Fill in your details, accept terms, and we&apos;ll help you send a professional order request to {company.solutionsEmail}.
      </p>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1.5">Select Plan</label>
          <select
            value={form.plan}
            onChange={(e) => setForm({ ...form, plan: e.target.value })}
            className="w-full rounded-xl border border-gold/20 bg-deep-blue/50 px-4 py-3"
          >
            {plans.map((p) => (
              <option key={p.key} value={p.key}>{p.label} — {p.price}</option>
            ))}
          </select>
        </div>

        <input
          required
          placeholder="Your full name"
          value={form.customerName}
          onChange={(e) => setForm({ ...form, customerName: e.target.value })}
          className="w-full rounded-xl border border-gold/20 bg-deep-blue/50 px-4 py-3"
        />
        <input
          required
          type="email"
          placeholder="Your email"
          value={form.customerEmail}
          onChange={(e) => setForm({ ...form, customerEmail: e.target.value })}
          className="w-full rounded-xl border border-gold/20 bg-deep-blue/50 px-4 py-3"
        />
        <input
          placeholder={`Phone (e.g. ${company.phoneLocal})`}
          value={form.customerPhone}
          onChange={(e) => setForm({ ...form, customerPhone: e.target.value })}
          className="w-full rounded-xl border border-gold/20 bg-deep-blue/50 px-4 py-3"
        />
        <input
          placeholder="Organization / Institution"
          value={form.organization}
          onChange={(e) => setForm({ ...form, organization: e.target.value })}
          className="w-full rounded-xl border border-gold/20 bg-deep-blue/50 px-4 py-3"
        />
        <textarea
          rows={3}
          placeholder="Tell us about your needs (e.g. number of voters, deployment timeline)"
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
          className="w-full rounded-xl border border-gold/20 bg-deep-blue/50 px-4 py-3 resize-none"
        />

        {terms.length > 0 && (
          <div className="rounded-xl bg-deep-blue/40 p-4 text-xs text-muted-foreground">
            <p className="font-semibold text-gold mb-2">Terms & Conditions</p>
            <ul className="space-y-1 list-disc pl-4">
              {terms.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </div>
        )}

        <label className="flex items-start gap-2 text-sm cursor-pointer">
          <input
            type="checkbox"
            checked={form.acceptedTerms}
            onChange={(e) => setForm({ ...form, acceptedTerms: e.target.checked })}
            className="mt-1"
          />
          I accept the terms and conditions for {productTitle}
        </label>

        <Button
          className="w-full"
          disabled={loading || !form.customerName || !form.customerEmail || !form.acceptedTerms}
          onClick={handleOrder}
        >
          {loading ? "Preparing..." : "Prepare Order Email"}
        </Button>
        <Button variant="outline" className="w-full" onClick={saveForLater}>
          <Save className="h-4 w-4" /> Save for Later
        </Button>

        {saved.length > 0 && (
          <p className="text-xs text-muted-foreground">Saved: {saved.join(", ")}</p>
        )}

        <p className="text-xs text-muted-foreground text-center">
          WhatsApp: {company.phoneLocal} · {company.offices.map((o) => o.city).join(" & ")}
        </p>
      </div>
    </GlassCard>
  );
}

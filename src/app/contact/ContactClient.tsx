"use client";

import { useState } from "react";
import { Mail, Phone, MapPin } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { company } from "@/data/site";

export function ContactClient() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setSubmitted(true);
    } catch {
      alert("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <PageHeader title="Contact Us" subtitle="We'd love to hear from you" badge="Get in Touch" />

      <section className="pb-24">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="space-y-6">
              <GlassCard>
                <Mail className="h-6 w-6 text-gold mb-3" />
                <h3 className="font-semibold">Email</h3>
                <p className="text-sm text-muted-foreground mt-1">{company.email}</p>
              </GlassCard>
              <GlassCard>
                <Phone className="h-6 w-6 text-gold mb-3" />
                <h3 className="font-semibold">Phone & WhatsApp</h3>
                <p className="text-sm text-muted-foreground mt-1">{company.phoneLocal} / {company.phone}</p>
                <a href={company.whatsappLink} className="text-sm text-life-green hover:underline mt-1 block">Chat on WhatsApp</a>
              </GlassCard>

              {company.offices.map((office) => (
                <GlassCard key={office.city}>
                  <MapPin className="h-6 w-6 text-gold mb-3" />
                  <h3 className="font-semibold">{office.city}, {office.country}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{office.address}</p>
                </GlassCard>
              ))}
            </div>

            <GlassCard className="lg:col-span-2">
              {submitted ? (
                <div className="text-center py-12">
                  <h2 className="text-2xl font-bold mb-2">Message Sent!</h2>
                  <p className="text-muted-foreground">We&apos;ll get back to you within 24 hours.</p>
                </div>
              ) : (
                <>
                  <h2 className="text-xl font-bold mb-6">Send Us a Message</h2>
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1.5">Name</label>
                        <input
                          required
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1.5">Email</label>
                        <input
                          required
                          type="email"
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold"
                        />
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1.5">Phone</label>
                        <input
                          value={form.phone}
                          onChange={(e) => setForm({ ...form, phone: e.target.value })}
                          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1.5">Subject</label>
                        <input
                          required
                          value={form.subject}
                          onChange={(e) => setForm({ ...form, subject: e.target.value })}
                          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5">Message</label>
                      <textarea
                        required
                        rows={5}
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold resize-none"
                      />
                    </div>
                    <Button type="submit" disabled={loading}>
                      {loading ? "Sending..." : "Send Message"}
                    </Button>
                  </form>
                </>
              )}
            </GlassCard>
          </div>
        </div>
      </section>
    </>
  );
}

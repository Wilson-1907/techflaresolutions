"use client";

import { useState } from "react";
import Link from "next/link";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [mode, setMode] = useState<"email" | "phone">("email");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(mode === "email" ? { email } : { phone }),
    });
    const data = await res.json();
    setLoading(false);
    setMessage(data.message || "Check your email for reset instructions.");
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-20 bg-black">
      <GlassCard className="w-full max-w-md border-gold/20">
        <h1 className="text-2xl font-bold text-gold mb-2">Forgot password</h1>
        <p className="text-sm text-muted-foreground mb-6">We&apos;ll send a reset code to your email. If you registered a phone number, you can recover via phone too.</p>

        <div className="flex gap-2 mb-4">
          <button type="button" onClick={() => setMode("email")} className={`flex-1 rounded-lg py-2 text-sm ${mode === "email" ? "bg-gold/20 text-gold" : "bg-white/5"}`}>Email</button>
          <button type="button" onClick={() => setMode("phone")} className={`flex-1 rounded-lg py-2 text-sm ${mode === "phone" ? "bg-gold/20 text-gold" : "bg-white/5"}`}>Phone</button>
        </div>

        <form onSubmit={submit} className="space-y-4">
          {mode === "email" ? (
            <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Your email"
              className="w-full rounded-xl border border-gold/20 bg-deep-blue/50 px-4 py-3" />
          ) : (
            <input required type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Registered phone number"
              className="w-full rounded-xl border border-gold/20 bg-deep-blue/50 px-4 py-3" />
          )}
          <Button type="submit" className="w-full" disabled={loading}>{loading ? "Sending..." : "Send reset code"}</Button>
        </form>
        {message && <p className="mt-4 text-sm text-life-green">{message}</p>}
        <p className="text-center text-sm text-muted-foreground mt-6">
          <Link href="/reset-password" className="text-gold hover:underline">I have a code</Link>
          {" · "}
          <Link href="/login" className="text-gold hover:underline">Sign in</Link>
        </p>
      </GlassCard>
    </div>
  );
}

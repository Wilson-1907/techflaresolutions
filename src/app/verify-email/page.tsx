"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { navigateAfterAuth } from "@/lib/portal-routes";

function VerifyForm() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const token = searchParams.get("token") || "";
  const notice = searchParams.get("notice") || "";
  const roleHint = searchParams.get("role") || "";
  const redirect = searchParams.get("redirect") || "";
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const autoResent = useRef(false);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    (async () => {
      try {
        const r = await fetch(`/api/auth/verify-email?token=${encodeURIComponent(token)}`, {
          credentials: "include",
        });
        const d = await r.json();
        if (cancelled) return;
        if (d.message && r.ok) {
          setMessage("Email confirmed! Opening your portal...");
          await navigateAfterAuth(d.user?.role || roleHint || "CLIENT", undefined, redirect);
        } else {
          setError(d.error || "Verification failed");
        }
      } catch {
        if (!cancelled) setError("Verification failed");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [token, roleHint, redirect]);

  async function submitCode(e: React.FormEvent) {
    e.preventDefault();
    if (!email) {
      setError("Email address is missing. Please register again.");
      return;
    }
    setLoading(true);
    setError("");
    setMessage("");
    const res = await fetch("/api/auth/verify-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, code }),
    });
    const data = await res.json().catch(() => ({}));
    setLoading(false);
    if (!res.ok) {
      setError(data.error || "Invalid or expired code");
      return;
    }
    setMessage("Email confirmed! Opening your portal...");
    await navigateAfterAuth(data.user?.role || roleHint || "CLIENT", undefined, redirect);
  }

  async function resend() {
    if (!email) {
      setError("Email address is missing. Please register again.");
      return;
    }
    setResending(true);
    setError("");
    setMessage("");
    const res = await fetch("/api/auth/resend-verification", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email }),
    });
    const data = await res.json().catch(() => ({}));
    setResending(false);
    if (!res.ok || data.emailSent === false) {
      setError(
        typeof data.error === "string"
          ? data.error
          : data.message && data.emailSent === false
            ? String(data.message)
            : "Email could not be sent. SMTP may not be configured — contact stechflare@gmail.com for help."
      );
      return;
    }
    setMessage("A new 6-digit code was sent. Check your inbox and spam folder.");
  }

  useEffect(() => {
    if (notice !== "email-failed" || !email || autoResent.current) return;
    autoResent.current = true;
    void resend();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only when email delivery failed at register
  }, [notice, email]);

  return (
    <GlassCard className="w-full max-w-md border-gold/20">
      <h1 className="text-2xl font-bold text-gold mb-2">Confirm with OTP</h1>
      <p className="text-sm text-muted-foreground mb-6">
        We sent a 6-digit verification code{email ? ` to ${email}` : ""}. Enter it below to activate your account and open your portal.
        Don&apos;t have a code? Tap <strong>Resend code</strong> below — we only send one email at a time.
      </p>
      {notice === "email-failed" && (
        <p className="text-sm text-yellow-400 mb-4">
          Your account was created but the email could not be delivered yet.
          We&apos;re trying to send a new code automatically — or tap <strong>Resend code</strong> below.
          If nothing arrives, contact{" "}
          <a href="mailto:stechflare@gmail.com" className="text-gold underline">stechflare@gmail.com</a>.
        </p>
      )}
      {resending && (
        <p className="text-sm text-muted-foreground mb-4">Sending verification code to your email…</p>
      )}
      {message && <p className="text-sm text-life-green mb-4">{message}</p>}
      {error && <p className="text-sm text-red-400 mb-4">{error}</p>}
      <form onSubmit={submitCode} className="space-y-4">
        <input
          required
          maxLength={6}
          inputMode="numeric"
          autoComplete="one-time-code"
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
          placeholder="6-digit code"
          className="w-full rounded-xl border border-gold/20 bg-deep-blue/50 px-4 py-3 text-center text-2xl tracking-widest"
        />
        <Button type="submit" className="w-full" disabled={loading || !email}>
          {loading ? "Confirming..." : "Confirm & open portal"}
        </Button>
      </form>
      <button
        type="button"
        onClick={resend}
        disabled={resending || !email}
        className="mt-4 text-sm text-gold hover:underline w-full text-center disabled:opacity-50"
      >
        {resending ? "Sending…" : "Resend code"}
      </button>
      <p className="text-center text-sm text-muted-foreground mt-6">
        Already verified? <Link href="/login" className="text-gold hover:underline">Sign in</Link>
      </p>
    </GlassCard>
  );
}

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-20 bg-black">
      <Suspense><VerifyForm /></Suspense>
    </div>
  );
}

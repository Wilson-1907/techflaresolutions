"use client";

import { useState } from "react";
import Link from "next/link";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { PasswordFields } from "@/components/auth/PasswordFields";
import { AccountTypePicker } from "@/components/auth/AccountTypePicker";
import { RegisterTermsCheckbox } from "@/components/consent/ConsentCheckboxes";
import { passwordsMatchClient, validatePasswordClient } from "@/lib/password-policy";
import { goToVerifyEmail } from "@/lib/verify-email-nav";
import { company } from "@/data/site";

export default function RegisterPage() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    role: "CLIENT" as "CLIENT" | "INNOVATOR",
    company: "",
  });
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  function redirectToOtp(email: string, emailSent: boolean) {
    setStatus("Account ready — opening OTP page…");
    goToVerifyEmail({
      email,
      role: form.role,
      notice: emailSent ? undefined : "email-failed",
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setStatus("");

    if (!acceptedTerms) {
      setError("You must accept the Terms & Conditions to create an account.");
      return;
    }

    const strengthError = validatePasswordClient(form.password);
    if (strengthError) {
      setError(`Password: ${strengthError}`);
      return;
    }
    const matchError = passwordsMatchClient(form.password, form.confirmPassword);
    if (matchError) {
      setError(matchError);
      return;
    }

    setLoading(true);
    setStatus("Creating your account…");
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        signal: AbortSignal.timeout(30_000),
        body: JSON.stringify({
          ...form,
          acceptedTerms: true,
          receiveCommunications: false,
        }),
      });
      const data = await res.json().catch(() => ({} as Record<string, unknown>));

      const email = String(data.email || form.email);
      const needsOtp = data.requiresVerification === true;

      if (needsOtp && email) {
        const emailOk = data.emailSent === true;
        redirectToOtp(email, emailOk);
        return;
      }

      if (!res.ok) {
        if (data.code === "EMAIL_NOT_VERIFIED" && data.email) {
          setStatus("This email is registered but not verified — opening OTP page…");
          goToVerifyEmail({
            email: String(data.email),
            role: form.role,
            notice: "email-failed",
          });
          return;
        }
        setError(String(data.error || "Registration failed"));
        setStatus("");
        return;
      }

      setError("Unexpected response from server. Try signing in or open the OTP page below.");
      setStatus("");
    } catch (err) {
      const timedOut = err instanceof Error && (err.name === "TimeoutError" || err.name === "AbortError");
      setError(
        timedOut
          ? "Request timed out. Your account may already exist — open the OTP page below or try signing in."
          : `Connection error — if you already submitted, your account may exist. Open the OTP page for ${form.email} or try signing in.`
      );
      setStatus("");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-20 pb-12 bg-black">
      <GlassCard className="w-full max-w-3xl border-gold/20">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gold">Create Account</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Register with email — we&apos;ll send a 6-digit code to verify your address
          </p>
        </div>

        <div className="mb-8">
          <AccountTypePicker
            value={form.role}
            onChange={(role) => setForm({ ...form, role, company: role === "INNOVATOR" ? "" : form.company })}
          />
        </div>

        <RegisterTermsCheckbox
          className="mb-6"
          accepted={acceptedTerms}
          onChange={setAcceptedTerms}
        />

        <form onSubmit={handleSubmit} className="space-y-4">
          {status && (
            <div className="rounded-xl bg-life-green/10 border border-life-green/30 px-4 py-3 text-sm text-life-green">
              {status}
            </div>
          )}
          {error && (
            <div className="rounded-xl bg-red-500/10 border border-red-500/30 px-4 py-3 text-sm text-red-400">
              {error}
              {form.email && (
                <p className="mt-2">
                  <Link
                    href={`/verify-email?email=${encodeURIComponent(form.email)}`}
                    className="text-gold underline"
                  >
                    Go to OTP verification page
                  </Link>
                </p>
              )}
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">First Name</label>
              <input required value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                className="w-full rounded-xl border border-gold/20 bg-deep-blue/50 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Last Name</label>
              <input required value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                className="w-full rounded-xl border border-gold/20 bg-deep-blue/50 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Email</label>
            <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full rounded-xl border border-gold/20 bg-deep-blue/50 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Phone <span className="text-muted-foreground font-normal">(optional)</span></label>
            <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="+254 7XX XXX XXX"
              className="w-full rounded-xl border border-gold/20 bg-deep-blue/50 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold" />
          </div>
          <PasswordFields
            password={form.password}
            confirmPassword={form.confirmPassword}
            onPasswordChange={(password) => setForm({ ...form, password })}
            onConfirmChange={(confirmPassword) => setForm({ ...form, confirmPassword })}
          />
          {form.role === "CLIENT" && (
            <div>
              <label className="block text-sm font-medium mb-1.5">Company / Organization</label>
              <input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })}
                placeholder="Your business or team name"
                className="w-full rounded-xl border border-gold/20 bg-deep-blue/50 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold" />
            </div>
          )}
          <Button type="submit" className="w-full" disabled={loading || !acceptedTerms}>
            {loading ? "Creating account…" : "Create account"}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Already have an account? <Link href="/login" className="text-gold hover:underline">Sign In</Link>
        </p>
      </GlassCard>
    </div>
  );
}

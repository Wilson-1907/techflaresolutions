"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { PasswordFields } from "@/components/auth/PasswordFields";
import { passwordsMatchClient, validatePasswordClient } from "@/lib/password-policy";

function ResetForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token") || "";
  const [form, setForm] = useState({ email: "", code: "", password: "", confirm: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) setForm((f) => ({ ...f, code: "link" }));
  }, [token]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const strengthError = validatePasswordClient(form.password);
    if (strengthError) {
      setError(`Password: ${strengthError}`);
      return;
    }
    if (form.password !== form.confirm) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        password: form.password,
        confirmPassword: form.confirm,
        token: token || undefined,
        code: token ? undefined : form.code,
        email: token ? undefined : form.email,
      }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error || "Reset failed");
      return;
    }
    setMessage("Password updated! Redirecting to sign in...");
    setTimeout(() => router.push("/login"), 2000);
  }

  return (
    <GlassCard className="w-full max-w-md border-gold/20">
      <h1 className="text-2xl font-bold text-gold mb-2">Reset password</h1>
      {token ? (
        <p className="text-sm text-muted-foreground mb-6">Enter your new password below.</p>
      ) : (
        <p className="text-sm text-muted-foreground mb-6">Enter the code from your email and your new password.</p>
      )}
      {message && <p className="text-sm text-life-green mb-4">{message}</p>}
      {error && <p className="text-sm text-red-400 mb-4">{error}</p>}
      <form onSubmit={submit} className="space-y-4">
        {!token && (
          <>
            <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="Email" className="w-full rounded-xl border border-gold/20 bg-deep-blue/50 px-4 py-3" />
            <input required maxLength={6} value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })}
              placeholder="6-digit code" className="w-full rounded-xl border border-gold/20 bg-deep-blue/50 px-4 py-3 text-center tracking-widest" />
          </>
        )}
        <PasswordFields
          password={form.password}
          confirmPassword={form.confirm}
          onPasswordChange={(password) => setForm({ ...form, password })}
          onConfirmChange={(confirm) => setForm({ ...form, confirm })}
          passwordLabel="New password"
          confirmLabel="Confirm new password"
        />
        <Button type="submit" className="w-full" disabled={loading}>{loading ? "Saving..." : "Update password"}</Button>
      </form>
      <p className="text-center text-sm text-muted-foreground mt-6">
        <Link href="/login" className="text-gold hover:underline">Back to sign in</Link>
      </p>
    </GlassCard>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-20 bg-black">
      <Suspense><ResetForm /></Suspense>
    </div>
  );
}

"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import Link from "next/link";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { company } from "@/data/site";
import { navigateAfterAuth } from "@/lib/portal-routes";
import { cn } from "@/lib/utils";
import { PasswordInput } from "@/components/auth/PasswordInput";

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "";
  const [mode, setMode] = useState<"employee" | "client">("client");
  const [form, setForm] = useState({ email: "", password: "", workId: "" });
  const [otp, setOtp] = useState("");
  const [challengeToken, setChallengeToken] = useState<string | null>(null);
  const [emailHint, setEmailHint] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function reset2fa() {
    setChallengeToken(null);
    setOtp("");
    setEmailHint("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (challengeToken) {
        const res = await fetch("/api/auth/complete-login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ challengeToken, code: otp.trim() }),
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.error || "Invalid verification code");
          return;
        }
        if (!data.user?.role) {
          setError("Verification succeeded but session was not created. Please try again.");
          return;
        }
        await navigateAfterAuth(data.user.role, router, redirect);
        return;
      }

      const endpoint = mode === "employee" ? "/api/auth/employee-login" : "/api/auth/login";
      const body =
        mode === "employee"
          ? JSON.stringify({ workId: form.workId.trim(), password: form.password })
          : JSON.stringify({ email: form.email, password: form.password });

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body,
      });
      const data = await res.json();
      if (!res.ok) {
        if (mode === "employee" && form.workId.includes("@")) {
          setError("That looks like an email. Switch to Client / Innovator and sign in with your email and password.");
          return;
        }
        if (mode === "client" && data.code === "EMAIL_NOT_VERIFIED") {
          const q = new URLSearchParams({
            email: String(data.email || form.email),
          });
          if (redirect) q.set("redirect", redirect);
          window.location.assign(`/verify-email?${q}`);
          return;
        }
        setError(data.error || "Login failed");
        return;
      }
      if (data.requires2fa) {
        setChallengeToken(data.challengeToken);
        setEmailHint(data.emailHint || "your work email");
        setOtp("");
        return;
      }
      if (!data.user?.role) {
        setError("Login succeeded but session was not created. Please try again.");
        return;
      }
      await navigateAfterAuth(data.user.role, router, redirect);
    } catch {
      setError("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-20 bg-black">
      <GlassCard className="w-full max-w-md border-gold/20">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gold">Sign In</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {mode === "employee"
              ? "Employees — Work ID and password only"
              : "Clients & innovators — use the email you registered with"}
          </p>
        </div>

        <div className="flex rounded-xl border border-gold/20 p-1 mb-6">
          <button
            type="button"
            onClick={() => {
              setMode("client");
              reset2fa();
            }}
            className={cn(
              "flex-1 rounded-lg py-2 text-sm font-medium transition-colors",
              mode === "client" ? "bg-gold text-black" : "text-muted-foreground hover:text-gold"
            )}
          >
            Client / Innovator
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("employee");
              reset2fa();
            }}
            className={cn(
              "flex-1 rounded-lg py-2 text-sm font-medium transition-colors",
              mode === "employee" ? "bg-gold text-black" : "text-muted-foreground hover:text-gold"
            )}
          >
            Employee
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-xl bg-red-500/10 border border-red-500/30 px-4 py-3 text-sm text-red-400">{error}</div>
          )}

          {!challengeToken ? (
            <>
              {mode === "employee" ? (
                <div>
                  <label className="block text-sm font-medium mb-1.5">Work ID</label>
                  <input
                    required
                    value={form.workId}
                    onChange={(e) => setForm({ ...form, workId: e.target.value.toUpperCase() })}
                    placeholder="SW26001"
                    autoComplete="username"
                    className="w-full rounded-xl border border-gold/20 bg-deep-blue/50 px-4 py-3 uppercase font-mono focus:outline-none focus:ring-2 focus:ring-gold"
                  />
                  <p className="text-xs text-muted-foreground mt-1.5">
                    Email is not used for employee login — only your Work ID and password.
                  </p>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium mb-1.5">Email</label>
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    autoComplete="email"
                    className="w-full rounded-xl border border-gold/20 bg-deep-blue/50 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold"
                  />
                </div>
              )}

              <div>
                <div className="flex justify-between mb-1.5">
                  <label className="text-sm font-medium">Password</label>
                  {mode === "client" && (
                    <Link href="/forgot-password" className="text-xs text-gold hover:underline">
                      Forgot password?
                    </Link>
                  )}
                </div>
                <PasswordInput
                  required
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  autoComplete="current-password"
                  className="w-full rounded-xl border border-gold/20 bg-deep-blue/50 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold"
                />
              </div>
            </>
          ) : (
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                Enter the 6-digit code sent to <strong className="text-gold">{emailHint}</strong>
              </p>
              <input
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                inputMode="numeric"
                autoComplete="one-time-code"
                placeholder="123456"
                className="w-full rounded-xl border border-gold/20 bg-deep-blue/50 px-4 py-3 text-center text-lg tracking-[0.4em] font-mono focus:outline-none focus:ring-2 focus:ring-gold"
              />
              <button
                type="button"
                onClick={reset2fa}
                className="text-xs text-gold mt-2 hover:underline"
              >
                ← Back to password
              </button>
            </div>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Please wait..." : challengeToken ? "Verify & sign in" : "Continue"}
          </Button>
        </form>

        {mode === "client" && (
          <p className="text-center text-sm text-muted-foreground mt-6">
            New here?{" "}
            <Link href="/register" className="text-gold hover:underline">
              Create account with email
            </Link>
          </p>
        )}
      </GlassCard>
    </div>
  );
}

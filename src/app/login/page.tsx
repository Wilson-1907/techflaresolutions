"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/brand/Logo";
import { company } from "@/data/site";
import Link from "next/link";

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
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Login failed");
        return;
      }
      const adminPanelUrl =
        process.env.NEXT_PUBLIC_ADMIN_PANEL_URL || "http://localhost:3001";
      const redirects: Record<string, string> = {
        CLIENT: "/portal/client",
        INNOVATOR: "/portal/innovation",
        ADMIN: `${adminPanelUrl}/dashboard`,
        EMPLOYEE: `${adminPanelUrl}/dashboard`,
      };
      const target = redirects[data.user.role] || redirect || "/portal/client";
      if (target.startsWith("http")) {
        window.location.href = target;
        return;
      }
      router.push(target);
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
          <Logo size="md" href={undefined} className="mx-auto mb-2" />
          <p className="text-sm font-semibold text-gold mb-4">{company.name}</p>
          <h1 className="text-2xl font-bold text-gold">Welcome Back</h1>
          <p className="text-sm text-muted-foreground mt-1">Sign in to your {company.name} portal</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-xl bg-red-500/10 border border-red-500/30 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}
          <div>
            <label className="block text-sm font-medium mb-1.5">Email</label>
            <input
              required
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full rounded-xl border border-gold/20 bg-deep-blue/50 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Password</label>
            <input
              required
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full rounded-xl border border-gold/20 bg-deep-blue/50 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold"
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-gold hover:underline">Register</Link>
        </p>
      </GlassCard>
    </div>
  );
}

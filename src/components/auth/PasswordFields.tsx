"use client";

import { passwordRules } from "@/lib/password-policy";
import { PasswordInput } from "@/components/auth/PasswordInput";

export function PasswordFields({
  password,
  confirmPassword,
  onPasswordChange,
  onConfirmChange,
  showConfirm = true,
  passwordLabel = "Password",
  confirmLabel = "Confirm Password",
}: {
  password: string;
  confirmPassword: string;
  onPasswordChange: (value: string) => void;
  onConfirmChange: (value: string) => void;
  showConfirm?: boolean;
  passwordLabel?: string;
  confirmLabel?: string;
}) {
  const mismatch = confirmPassword.length > 0 && password !== confirmPassword;
  const passed = passwordRules.filter((r) => r.test(password)).length;

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1.5">{passwordLabel}</label>
        <PasswordInput
          required
          autoComplete="new-password"
          value={password}
          onChange={(e) => onPasswordChange(e.target.value)}
          className="w-full rounded-xl border border-gold/20 bg-deep-blue/50 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold"
        />
        {password.length > 0 && (
          <div className="mt-2 space-y-2">
            <div className="flex gap-1">
              {passwordRules.map((rule) => (
                <div
                  key={rule.id}
                  className={`h-1 flex-1 rounded-full ${rule.test(password) ? "bg-life-green" : "bg-white/10"}`}
                />
              ))}
            </div>
            <p className="text-xs text-muted-foreground">{passed}/{passwordRules.length} requirements met</p>
            <ul className="text-xs space-y-1">
              {passwordRules.map((rule) => (
                <li key={rule.id} className={rule.test(password) ? "text-life-green" : "text-muted-foreground"}>
                  {rule.test(password) ? "✓" : "○"} {rule.label}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      {showConfirm && (
        <div>
          <label className="block text-sm font-medium mb-1.5">{confirmLabel}</label>
          <PasswordInput
            required
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => onConfirmChange(e.target.value)}
            className={`w-full rounded-xl border bg-deep-blue/50 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold ${
              mismatch ? "border-red-500/50" : "border-gold/20"
            }`}
          />
          {mismatch && <p className="text-xs text-red-400 mt-1">Passwords do not match.</p>}
        </div>
      )}
    </div>
  );
}

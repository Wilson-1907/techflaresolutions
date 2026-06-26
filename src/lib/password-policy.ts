export type PasswordRule = { id: string; label: string; test: (p: string) => boolean };

export const passwordRules: PasswordRule[] = [
  { id: "length", label: "At least 8 characters", test: (p) => p.length >= 8 },
  { id: "lower", label: "One lowercase letter", test: (p) => /[a-z]/.test(p) },
  { id: "upper", label: "One uppercase letter", test: (p) => /[A-Z]/.test(p) },
  { id: "number", label: "One number", test: (p) => /[0-9]/.test(p) },
  { id: "symbol", label: "One symbol (!@#$%…)", test: (p) => /[^A-Za-z0-9]/.test(p) },
  { id: "predictable", label: "Not predictable or common", test: (p) => !isObviouslyWeak(p) },
];

function isObviouslyWeak(password: string): boolean {
  const lower = password.toLowerCase();
  if (/^(.)\1{3,}$/.test(password)) return true;
  if (["password", "12345678", "qwerty12", "admin123", "welcome1"].some((w) => lower.includes(w))) return true;
  return false;
}

export function validatePasswordClient(password: string): string | null {
  for (const rule of passwordRules) {
    if (!rule.test(password)) return rule.label;
  }
  return null;
}

export function passwordsMatchClient(password: string, confirm: string): string | null {
  if (password !== confirm) return "Passwords do not match.";
  return null;
}

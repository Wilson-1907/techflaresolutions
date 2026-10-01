const isProd = process.env.NODE_ENV === "production";

function requireEnv(name: string, devFallback?: string): string {
  const value = process.env[name]?.trim();
  if (value) return value;
  if (isProd) {
    throw new Error(`${name} is required in production. Set it in your environment.`);
  }
  if (devFallback !== undefined) return devFallback;
  throw new Error(`${name} is required. Copy .env.example to .env and configure it.`);
}

export function getJwtSecret(): string {
  return requireEnv("JWT_SECRET", "dev-secret-change-in-production");
}

export function getAdminApiKey(): string {
  return requireEnv("ADMIN_API_KEY", "dev-admin-api-key");
}

export function getAdminPanelUrl(): string {
  return requireEnv("NEXT_PUBLIC_ADMIN_PANEL_URL", "http://localhost:3001");
}

export function getAppUrl(): string {
  return requireEnv("NEXT_PUBLIC_APP_URL", "http://localhost:3000");
}

export function isProduction(): boolean {
  return isProd;
}

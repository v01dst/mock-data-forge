export interface Config {
  port: number;
  host: string;
  maxItems: number;
}

function intEnv(name: string, fallback: number): number {
  const raw = process.env[name];
  if (!raw) return fallback;
  const value = Number.parseInt(raw, 10);
  return Number.isFinite(value) ? value : fallback;
}

export const DEFAULT_CONFIG: Config = {
  port: 3000,
  host: "0.0.0.0",
  maxItems: 100,
};

export function loadConfig(env: NodeJS.ProcessEnv = process.env): Config {
  return {
    port: intEnv("PORT", DEFAULT_CONFIG.port),
    host: env.HOST ?? DEFAULT_CONFIG.host,
    maxItems: intEnv("MAX_ITEMS", DEFAULT_CONFIG.maxItems),
  };
}

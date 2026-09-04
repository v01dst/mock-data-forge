import Fastify, { type FastifyInstance } from "fastify";
import { DEFAULT_CONFIG, type Config } from "./config.js";
import { forgeRoutes } from "./routes.js";

export interface AppOptions {
  config?: Partial<Config>;
  logger?: boolean;
}

export function createApp(opts: AppOptions = {}): FastifyInstance {
  const config: Config = { ...DEFAULT_CONFIG, ...opts.config };
  const startedAt = Date.now();

  const app = Fastify({ logger: opts.logger ?? false });

  app.get("/health", async () => ({
    status: "ok",
    uptimeSec: Math.floor((Date.now() - startedAt) / 1000),
  }));

  app.get("/", async () => ({
    service: "mock-data-forge",
    version: "1.0.0",
    author: "v01dst",
    usage: "/users?count=10&seed=abc · /orders · /posts — same seed = same data",
  }));

  app.register((instance, _o, done) => {
    forgeRoutes(instance, { maxItems: config.maxItems });
    done();
  });

  return app;
}

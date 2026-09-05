import type { FastifyInstance } from "fastify";
import { hashSeed } from "./rand.js";
import { makeCompanies, makeOrders, makePayments, makePosts, makeUsers } from "./generators.js";

export interface ForgeRoutesOpts {
  maxItems: number;
}

export function forgeRoutes(app: FastifyInstance, opts: ForgeRoutesOpts): void {
  const errorResponse = {
    type: "object",
    properties: { error: { type: "string" } },
    required: ["error"],
  } as const;

  function resolveSeed(raw: string | undefined, kind: string): number {
    return raw !== undefined ? hashSeed(raw) : hashSeed(`${kind}-${Date.now()}`);
  }

  function clampCount(raw: string | undefined): number | null {
    if (raw === undefined) return 10;
    const n = Number(raw);
    if (!Number.isInteger(n) || n < 1 || n > opts.maxItems) return null;
    return n;
  }

  app.get(
    "/users",
    {
      schema: {
        response: {
          200: {
            type: "object",
            properties: {
              seed: { type: "string" },
              count: { type: "number" },
              users: { type: "array" },
            },
            required: ["seed", "count", "users"],
          },
          400: errorResponse,
        },
      },
    },
    async (request, reply) => {
      const q = request.query as Record<string, string>;
      const count = clampCount(q.count);
      if (count === null) {
        return reply
          .status(400)
          .send({ error: `count must be an integer between 1 and ${opts.maxItems}` });
      }
      const seed = q.seed ?? String(resolveSeed(undefined, "users"));
      const users = makeUsers(hashSeed(seed), count);
      return reply.status(200).send({ seed, count, users });
    }
  );

  app.get(
    "/orders",
    {
      schema: {
        response: {
          200: {
            type: "object",
            properties: {
              seed: { type: "string" },
              count: { type: "number" },
              orders: { type: "array" },
            },
            required: ["seed", "count", "orders"],
          },
          400: errorResponse,
        },
      },
    },
    async (request, reply) => {
      const q = request.query as Record<string, string>;
      const count = clampCount(q.count);
      if (count === null) {
        return reply
          .status(400)
          .send({ error: `count must be an integer between 1 and ${opts.maxItems}` });
      }
      const seed = q.seed ?? String(resolveSeed(undefined, "orders"));
      const orders = makeOrders(hashSeed(seed), count);
      return reply.status(200).send({ seed, count, orders });
    }
  );

  app.get(
    "/posts",
    {
      schema: {
        response: {
          200: {
            type: "object",
            properties: {
              seed: { type: "string" },
              count: { type: "number" },
              posts: { type: "array" },
            },
            required: ["seed", "count", "posts"],
          },
          400: errorResponse,
        },
      },
    },
    async (request, reply) => {
      const q = request.query as Record<string, string>;
      const count = clampCount(q.count);
      if (count === null) {
        return reply
          .status(400)
          .send({ error: `count must be an integer between 1 and ${opts.maxItems}` });
      }
      const seed = q.seed ?? String(resolveSeed(undefined, "posts"));
      const posts = makePosts(hashSeed(seed), count);
      return reply.status(200).send({ seed, count, posts });
    }
  );

  app.get(
    "/companies",
    async (request, reply) => {
      const q = request.query as Record<string, string>;
      const count = clampCount(q.count);
      if (count === null) {
        return reply
          .status(400)
          .send({ error: `count must be an integer between 1 and ${opts.maxItems}` });
      }
      const seed = q.seed ?? String(resolveSeed(undefined, "companies"));
      const companies = makeCompanies(seed, count);
      return reply.status(200).send({ seed, count, companies });
    }
  );

  app.get(
    "/payments",
    async (request, reply) => {
      const q = request.query as Record<string, string>;
      const count = clampCount(q.count);
      if (count === null) {
        return reply
          .status(400)
          .send({ error: `count must be an integer between 1 and ${opts.maxItems}` });
      }
      const seed = q.seed ?? String(resolveSeed(undefined, "payments"));
      const payments = makePayments(seed, count);
      return reply.status(200).send({ seed, count, payments });
    }
  );
}

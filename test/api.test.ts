import { describe, expect, it, afterAll } from "vitest";
import { createApp } from "../src/app.js";

const app = createApp();
afterAll(() => app.close());

describe("GET /users", () => {
  it("returns 10 users by default", async () => {
    const res = await app.inject({ url: "/users" });
    expect(res.statusCode).toBe(200);
    const body = res.json();
    expect(body.count).toBe(10);
    expect(body.users).toHaveLength(10);
  });

  it("same seed returns identical data across requests", async () => {
    const a = await app.inject({ url: "/users", query: { seed: "stable", count: "5" } });
    const b = await app.inject({ url: "/users", query: { seed: "stable", count: "5" } });
    expect(a.json()).toEqual(b.json());
  });

  it("rejects out-of-range counts", async () => {
    const res = await app.inject({ url: "/users", query: { count: "0" } });
    expect(res.statusCode).toBe(400);
    const res2 = await app.inject({ url: "/users", query: { count: "1000" } });
    expect(res2.statusCode).toBe(400);
  });
});

describe("GET /orders and /posts", () => {
  it("orders have consistent totals", async () => {
    const res = await app.inject({ url: "/orders", query: { count: "20", seed: "s1" } });
    const orders = res.json().orders;
    for (const o of orders) {
      expect(o.totalUsd).toBe(o.quantity * o.unitPriceUsd);
    }
  });

  it("posts have url-safe slugs", async () => {
    const res = await app.inject({ url: "/posts", query: { count: "10", seed: "s2" } });
    for (const p of res.json().posts) {
      expect(p.slug).toMatch(/^[a-z0-9-]+$/);
    }
  });
});

describe("meta", () => {
  it("health works", async () => {
    const res = await app.inject({ url: "/health" });
    expect(res.json().status).toBe("ok");
  });

  it("root describes service", async () => {
    const res = await app.inject({ url: "/" });
    expect(res.json().service).toBe("mock-data-forge");
  });
});

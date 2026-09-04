import { describe, expect, it } from "vitest";
import { hashSeed, makeRand } from "../src/rand.js";
import { makeOrders, makePosts, makeUsers } from "../src/generators.js";

describe("rand", () => {
  it("is deterministic for the same seed", () => {
    const a = makeRand(42);
    const b = makeRand(42);
    const seqA = Array.from({ length: 10 }, () => a.next());
    const seqB = Array.from({ length: 10 }, () => b.next());
    expect(seqA).toEqual(seqB);
  });

  it("differs across seeds", () => {
    const a = makeRand(1);
    const b = makeRand(2);
    expect(Array.from({ length: 5 }, () => a.next())).not.toEqual(
      Array.from({ length: 5 }, () => b.next())
    );
  });

  it("int stays in range", () => {
    const r = makeRand(7);
    for (let i = 0; i < 500; i++) {
      const v = r.int(3, 9);
      expect(v).toBeGreaterThanOrEqual(3);
      expect(v).toBeLessThanOrEqual(9);
    }
  });

  it("pick returns members", () => {
    const r = makeRand(9);
    const arr = ["a", "b", "c"] as const;
    for (let i = 0; i < 50; i++) {
      expect(arr).toContain(r.pick(arr));
    }
  });

  it("hashSeed is stable", () => {
    expect(hashSeed("hello")).toBe(hashSeed("hello"));
    expect(hashSeed("hello")).not.toBe(hashSeed("hellp"));
  });
});

describe("generators", () => {
  it("same seed produces identical users", () => {
    expect(makeUsers("demo", 5)).toEqual(makeUsers("demo", 5));
  });

  it("same seed produces identical orders", () => {
    expect(makeOrders("demo", 5)).toEqual(makeOrders("demo", 5));
  });

  it("same seed produces identical posts", () => {
    expect(makePosts("demo", 5)).toEqual(makePosts("demo", 5));
  });

  it("users have valid emails and structure", () => {
    const users = makeUsers("validate", 50);
    for (const u of users) {
      expect(u.email).toMatch(/^[a-z]+[a-z-]*\.[a-z]+[a-z-]*@[a-z]+\.[a-z]+$/);
      expect(u.age).toBeGreaterThanOrEqual(18);
      expect(u.age).toBeLessThanOrEqual(85);
      expect(u.address.zip).toMatch(/^\d{5}$/);
      expect(typeof u.active).toBe("boolean");
    }
  });

  it("order totals are consistent", () => {
    const orders = makeOrders("totals", 50);
    for (const o of orders) {
      expect(o.totalUsd).toBe(o.quantity * o.unitPriceUsd);
    }
  });

  it("post slugs are url-safe", () => {
    const posts = makePosts("slugs", 30);
    for (const p of posts) {
      expect(p.slug).toMatch(/^[a-z0-9-]+$/);
      expect(p.slug).not.toContain("--");
    }
  });
});

import { hashSeed, makeRand, type Rand } from "./rand.js";

export type Seed = number | string;

function toSeed(seed: Seed): number {
  return typeof seed === "string" ? hashSeed(seed) : seed >>> 0;
}

const FIRST_NAMES = [
  "Ada", "Grace", "Alan", "Linus", "Margaret", "Dennis", "Barbara", "Ken",
  "Katherine", "Guido", "Radia", "Bjarne", "Anita", "Tim", "Shafi", "James",
];
const LAST_NAMES = [
  "Lovelace", "Hamilton", "Turing", "Torvalds", "Johnson", "Ritchie",
  "Liskov", "Thompson", "Gosling", "Perlman", "Stroustrup", "Borg",
  "Goldstine", "Berners-Lee", "Goldwasser", "Gosper",
];
const STREETS = [
  "Main St", "Oak Ave", "Cedar Ln", "Birch Rd", "Maple Dr", "Pine Way",
  "Elm Blvd", "Willow Ct",
];
const CITIES: [string, string][] = [
  ["Portland", "OR"], ["Austin", "TX"], ["Denver", "CO"], ["Boston", "MA"],
  ["Seattle", "WA"], ["Chicago", "IL"],
];
const DOMAINS = ["example.com", "test.dev", "mock.io", "fake.org"];
const PRODUCTS = ["Keyboard", "Mouse", "Monitor", "Laptop", "Cable", "Dock"];
const LOCALES = ["en-US", "en-GB", "de-DE", "fr-FR", "es-ES"];

function pad(n: number, len: number): string {
  return String(n).padStart(len, "0");
}

export interface MockUser {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  age: number;
  active: boolean;
  createdAt: string;
  locale: string;
}

export function makeUser(r: Rand, index: number): MockUser {
  const first = r.pick(FIRST_NAMES);
  const last = r.pick(LAST_NAMES);
  const [city, state] = r.pick(CITIES);
  return {
    id: pad(index + 1, 6),
    firstName: first,
    lastName: last,
    name: `${first} ${last}`,
    email: `${first.toLowerCase()}.${last.toLowerCase()}@${r.pick(DOMAINS)}`,
    phone: `+1-${pad(r.int(200, 989), 3)}-${pad(r.int(0, 999), 3)}-${pad(r.int(0, 9999), 4)}`,
    address: {
      street: `${r.int(1, 9999)} ${r.pick(STREETS)}`,
      city,
      state,
      zip: pad(r.int(0, 99999), 5),
    },
    age: r.int(18, 85),
    active: r.bool(0.8),
    createdAt: new Date(Date.UTC(2020, 0, 1) + r.int(0, 365 * 24 * 3600 * 1000)).toISOString(),
    locale: r.pick(LOCALES),
  };
}

export interface MockOrder {
  id: string;
  userId: string;
  product: string;
  quantity: number;
  unitPriceUsd: number;
  totalUsd: number;
  status: "pending" | "paid" | "shipped" | "delivered" | "cancelled";
  createdAt: string;
}

export function makeOrder(r: Rand, index: number): MockOrder {
  const quantity = r.int(1, 5);
  const unitPrice = r.int(5, 400);
  return {
    id: `ORD-${pad(index + 1, 8)}`,
    userId: pad(r.int(1, 500), 6),
    product: r.pick(PRODUCTS),
    quantity,
    unitPriceUsd: unitPrice,
    totalUsd: quantity * unitPrice,
    status: r.pick(["pending", "paid", "shipped", "delivered", "cancelled"] as const),
    createdAt: new Date(Date.UTC(2024, 0, 1) + r.int(0, 365 * 24 * 3600 * 1000)).toISOString(),
  };
}

export interface MockPost {
  id: string;
  title: string;
  slug: string;
  body: string;
  tags: string[];
  likes: number;
  published: boolean;
}

export function makePost(r: Rand, index: number): MockPost {
  const title = `${r.pick(["Building", "Shipping", "Debugging", "Scaling", "Understanding"])} ${r.pick(["Fast APIs", "Rust CLIs", "SQLite", "Docker", "TypeScript"])} ${r.pick(["in Production", "from Scratch", "at Scale", "the Right Way"])}`;
  return {
    id: pad(index + 1, 4),
    title,
    slug: title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
    body: `This is a mock post about ${title.toLowerCase()}. `.repeat(r.int(2, 6)).trim(),
    tags: Array.from({ length: r.int(1, 3) }, () =>
      r.pick(["tech", "dev", "web", "api", "cloud", "oss"])
    ).filter((t, i, a) => a.indexOf(t) === i),
    likes: r.int(0, 5000),
    published: r.bool(0.7),
  };
}

export function makeUsers(seed: Seed, count: number): MockUser[] {
  const r = makeRand(toSeed(seed));
  return Array.from({ length: count }, (_, i) => makeUser(r, i));
}

export function makeOrders(seed: Seed, count: number): MockOrder[] {
  const r = makeRand(toSeed(seed));
  return Array.from({ length: count }, (_, i) => makeOrder(r, i));
}

export function makePosts(seed: Seed, count: number): MockPost[] {
  const r = makeRand(toSeed(seed));
  return Array.from({ length: count }, (_, i) => makePost(r, i));
}

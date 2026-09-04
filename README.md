<div align="center">

# 🔨 mock-data-forge

**Deterministic fake data — same seed, same data, every time. Perfect for tests.**

[![CI](https://github.com/v01dst/mock-data-forge/actions/workflows/ci.yml/badge.svg)](https://github.com/v01dst/mock-data-forge/actions/workflows/ci.yml)
![License](https://img.shields.io/badge/license-MIT-8A2BE2)
![Node](https://img.shields.io/badge/node-22-339933?logo=nodedotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-strict-3178C6?logo=typescript&logoColor=white)
![Tests](https://img.shields.io/badge/tests-18%20passing-brightgreen)

`users` · `orders` · `posts` · `seeded` · `reproducible` · `zero native deps`

</div>

---

## ✨ Features

- **🌱 Seeded determinism** — `?seed=abc` returns byte-identical data across requests, deploys and languages
- **👥 Rich fixtures** — users with addresses, orders with consistent totals, posts with URL-safe slugs
- **🎲 Custom PRNG** — mulberry32 + FNV-1a hashing, no dependencies
- **📏 Bounded** — 1–100 items per request, validated
- **🧪 Test-friendly** — point your test suite at one seed for reproducible fixtures

## 🚀 Quick Start

```bash
git clone https://github.com/v01dst/mock-data-forge
cd mock-data-forge
npm ci
npm start
```

Or with Docker:

```bash
docker compose up -d
```

## 📡 API

| Method | Route     | Params              | Description    |
|--------|-----------|---------------------|----------------|
| `GET`  | `/users`  | `count`, `seed`     | Mock users     |
| `GET`  | `/orders` | `count`, `seed`     | Mock orders    |
| `GET`  | `/posts`  | `count`, `seed`     | Mock posts     |
| `GET`  | `/health` | —                   | Liveness       |

### Deterministic fixtures

```bash
curl "http://localhost:3000/users?seed=demo&count=2"
```

```json
{
  "seed": "demo",
  "count": 2,
  "users": [
    {
      "id": "000001",
      "name": "Katherine Stroustrup",
      "email": "katherine.stroustrup@fake.org",
      "phone": "+1-769-473-9036",
      "address": { "street": "6176 Pine Way", "city": "Portland", "state": "OR", "zip": "02841" },
      "age": 41,
      "active": true,
      "createdAt": "2020-08-14T09:12:00.000Z",
      "locale": "de-DE"
    }
  ]
}
```

### In tests

```js
// test setup — every run gets the same users
const { users } = await fetch("http://localhost:3000/users?seed=e2e-fixed&count=25").then(r => r.json());
```

### Errors

| Status | Meaning                        |
|--------|--------------------------------|
| `400`  | count out of range (1–100)     |

## 🧱 Tech Stack

| Layer     | Tech                |
|-----------|---------------------|
| Runtime   | Node.js 22          |
| Language  | TypeScript (strict) |
| Framework | Fastify 5           |
| PRNG      | mulberry32 (in-house) |
| Testing   | Vitest 5            |
| Packaging | Docker + compose    |
| CI        | GitHub Actions      |

---

<div align="center">

Built with ⚡ by **v01dst**

[![GitHub](https://img.shields.io/badge/github-v01dst-181717?logo=github)](https://github.com/v01dst)
[![Discord](https://img.shields.io/badge/discord-9p.1-5865F2?logo=discord&logoColor=white)](https://discord.com/users/9p.1)

*Project 014 / 99 — The Loop*

</div>

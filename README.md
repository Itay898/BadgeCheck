# תו צ׳ק · BadgeCheck

Check whether an Israeli vehicle has a valid disability badge (**תו נכה**) by
license plate — in real time, against the government open-data registry
(`data.gov.il`). Alongside the tool, BadgeCheck is a Hebrew content site:
guides, rights, news, an FAQ, and an AI assistant.

> **Not an official site.** BadgeCheck is an independent project and is not
> affiliated with the Ministry of Transport or any government body. Results
> reflect the public registry at query time and are not a substitute for the
> official badge document.

## Features

- **Badge checker** — license-plate lookup with a clear verified / not-found /
  error result, no registration, no stored plate numbers.
- **Editorial site** — articles in three categories (guides, rights, news),
  a structured FAQ, plus about & accessibility pages.
- **AI assistant** (`/chat`) — answers questions in free Hebrew and can render
  badge-check results inline (powered by Tambo AI).
- **SEO** — per-page metadata, `sitemap.xml`, `robots.txt`, OpenGraph images,
  and JSON-LD (`Organization`, `WebSite`, `WebApplication`, `Article`,
  `FAQPage`, `BreadcrumbList`, `CollectionPage`).
- **Hebrew / RTL** end to end, with accessibility built in (skip links, focus
  traps, `aria-live` regions, reduced-motion support).

## Tech stack

- [Next.js](https://nextjs.org) 15 (App Router) · [React](https://react.dev) 19 · TypeScript (strict)
- [Tailwind CSS](https://tailwindcss.com) v4 with an OKLCH design-token system
- [Tambo AI](https://tambo.co) (`@tambo-ai/react`) for the AI assistant
- [Zod](https://zod.dev) for schema validation · [Framer Motion](https://motion.dev) for animation

## Getting started

**Prerequisites:** Node.js 20+ and npm.

```bash
# 1. Install dependencies
npm install

# 2. Configure environment (see below)
cp example.env.local .env.local   # then edit values

# 3. Start the dev server
npm run dev
```

Open [localhost:3000](http://localhost:3000).

The badge checker works out of the box — it queries the public `data.gov.il`
API and needs **no API key**. Only the `/chat` assistant requires a Tambo key.

## Environment variables

| Variable | Required | Purpose |
|----------|----------|---------|
| `NEXT_PUBLIC_TAMBO_API_KEY` | For `/chat` | Tambo AI key — get one free at [tambo.co/dashboard](https://tambo.co/dashboard) |
| `NEXT_PUBLIC_TAMBO_URL` | Optional | Custom Tambo API endpoint |
| `NEXT_PUBLIC_SITE_URL` | For production | Public site URL — used for canonical URLs, OpenGraph, sitemap and JSON-LD. Falls back to `http://localhost:3000` |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Optional | Contact address shown across the site |

> Set `NEXT_PUBLIC_SITE_URL` in every deploy environment — without it, canonical
> and OG URLs point to `localhost`.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the development server |
| `npm run build` | Build for production |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Run ESLint with auto-fix |
| `npm run typecheck` | Type-check with `tsc --noEmit` |

## Routes

| Route | Description |
|-------|-------------|
| `/` | Home — hero, badge checker, latest articles |
| `/articles` · `/articles/[slug]` | Article index and individual articles |
| `/category/[slug]` | Articles by category (`guides`, `rights`, `news`) |
| `/faq` | Frequently asked questions |
| `/about` · `/accessibility` | About and accessibility statement |
| `/chat` | AI assistant (Tambo) |
| `/api/check?plate=…` | Badge lookup API — queries `data.gov.il` |

## Project structure

```
src/
├── app/
│   ├── (site)/            # Public site (shared header/footer layout)
│   │   ├── page.tsx       # Home — hero + badge checker
│   │   ├── articles/      # Article index + [slug] pages
│   │   ├── category/      # Category pages
│   │   ├── faq/  about/  accessibility/
│   │   └── layout.tsx
│   ├── api/check/route.ts # Badge lookup against data.gov.il
│   ├── chat/              # AI assistant (Tambo)
│   ├── sitemap.ts  robots.ts  opengraph-image.tsx
│   └── layout.tsx         # Root layout (lang="he" dir="rtl")
├── components/
│   ├── site/              # Header, footer, logo, site-wide JSON-LD
│   ├── editorial/         # Article cards, covers, FAQ, breadcrumbs
│   ├── tool/              # BadgeCheckWidget, LicensePlate
│   └── tambo/             # Tambo chat UI components
├── content/               # articles, categories, faq, site config (data)
├── lib/                   # Tambo component/tool registry, hooks, utils
└── services/              # badge-check API client
```

## How it works

A license plate entered in the checker is sent to `/api/check`, which queries
the public CKAN datastore on `data.gov.il` and returns whether a valid badge
record exists. Plate numbers are not stored. The same lookup is registered as a
Tambo tool, so the `/chat` assistant can run it and render the result.

Editorial content (articles, categories, FAQ) lives as typed data in
`src/content/` and is rendered through statically generated pages.

## Deployment

Standard Next.js deployment (e.g. Vercel). Configure the environment variables
above in the hosting platform — in particular `NEXT_PUBLIC_SITE_URL`, and
`NEXT_PUBLIC_TAMBO_API_KEY` if the AI assistant is enabled.

## Disclaimer

The information provided is general and does not constitute legal, medical or
professional advice. Badge validity is determined by the Ministry of Transport;
the official source always prevails over any automated check.

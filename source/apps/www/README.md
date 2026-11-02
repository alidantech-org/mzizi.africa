# Mzizi Africa Public Application

`apps/www` is the public-facing Mzizi Africa experience: an evidence-first African historical atlas, digital heritage museum and public knowledge explorer.

The current implementation began as a pre-colonial African history landing experience. Its long-term scope is broader and follows the repository-level Mzizi architecture.

## Product role

The public application should make structured Mzizi knowledge understandable through:

- interactive historical maps;
- timelines;
- places and historical polities;
- heritage and cultural collections;
- languages and linguistic relationships;
- migration and settlement;
- trade networks and resources;
- colonial transformation;
- independence and institutional change;
- constitutions/governance/politics;
- evidence, citations, confidence and uncertainty;
- present-day relevance where the historical connection is supported.

This application **presents and explores canonical knowledge**. It does not own source extraction, AI classification, migrations or canonical data rules.

## Current stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- shadcn/ui-compatible component setup (`base-nova`)
- Bun package manager
- `src/` application layout

## Current landing page

The initial landing page is a parity port of the supplied `mzizi-africa.html` design. Its original visual contract and interactive map/runtime are preserved while living inside a standard Next.js application architecture.

The source prototype is retained at `public/reference/mzizi-africa.html` for visual comparison.

## Existing design principles worth preserving

- warm oat / cream / clay / calabash / raffia / indigo palette;
- evidence confidence represented visually;
- claim-level provenance and uncertainty;
- interactive regional map and timeline;
- polity, trade, resource and language overlays;
- culture, historical linguistics, methodology and coverage sections.

## Target routes

The public product should progressively grow into routes such as:

```text
/explore              map + timeline exploration
/places/[slug]        places, polities and historical geography
/stories               curated research narratives
/sources               evidence catalogue and methodology
/heritage              museum/heritage collections
/languages             language and linguistic exploration
/governance            modern governance/political context
```

The exact information architecture can evolve with research and canonical API contracts.

## Run locally with Bun

From this app directory:

```bash
bun install
bun dev
```

Open `http://localhost:3000`.

Useful commands:

```bash
bun run typecheck
bun run build
bun start
```

## Current structure

```text
src/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── mzizi/
│   │   └── mzizi-landing.tsx
│   └── ui/
│       └── button.tsx
├── content/
│   └── mzizi-landing.ts
└── lib/
    └── utils.ts

public/
├── mzizi-runtime.js
└── reference/
    └── mzizi-africa.html
```

## Architecture rule

As real data is introduced, consume stable contracts from the future NestJS API rather than defining canonical historical/domain logic inside React components.

Read:

- [`../../.docs/WHY.md`](../../.docs/WHY.md)
- [`../../.docs/STORY.md`](../../.docs/STORY.md)
- [`../../.docs/DOMAINS.md`](../../.docs/DOMAINS.md)
- [`../../.docs/ARCHITECTURE.md`](../../.docs/ARCHITECTURE.md)
- [`../../.docs/ROADMAP.md`](../../.docs/ROADMAP.md)

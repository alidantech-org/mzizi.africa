# mzizi.africa

An evidence-first digital atlas and public record for pre-colonial African history.

## Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- shadcn/ui-compatible component setup (`base-nova`)
- `src/` application layout

## Landing page

The initial landing page is a parity port of the supplied `mzizi-africa.html` design. Its original visual contract and interactive map/runtime are preserved while living inside a standard Next.js application architecture.

The source prototype is retained at `public/reference/mzizi-africa.html` for visual comparison.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Structure

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

## Design principles carried from the prototype

- Warm oat / cream / clay / calabash / raffia / indigo palette
- Evidence confidence represented as filled vessels
- Claim-level provenance and uncertainty
- Interactive regional map and timeline
- Polity, trade, resource, and language overlays
- Culture, historical linguistics, methodology, and coverage sections

## Next steps

The parity landing page can now be progressively decomposed into typed React components without changing the visual result, while new routes such as `/explore`, `/places/[slug]`, `/stories`, and `/sources` can use regular shadcn/Tailwind components.

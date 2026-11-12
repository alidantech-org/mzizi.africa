# Public Mzizi application

`source/apps/www` is the public Next.js application. The current implementation is an evidence-first landing experience with the Mzizi visual identity and interactive presentation. It does not yet implement the planned public atlas, history browser, heritage catalogue or source explorer, and it does not currently own or embed canonical domain data.

## Current stack and commands

Next.js App Router, React, TypeScript and Tailwind CSS, managed with Bun. The app listens on port `3200`:

```bash
bun run dev --only www
bun run typecheck --only www
bun run build --only www
```

Run these from the repository root. The app can also be run directly from this directory with `bun run dev`, `bun run typecheck` or `bun run build`.

The landing page uses the retained reference design under `public/reference/` and application content under `src/`. Historical routes and data experiences listed in plans are product proposals, not current routes.

As API-backed experiences are added, the site should consume stable NestJS contracts. It must not own source extraction, database migrations, file custody or canonical data rules.

## Read first

- [Project purpose](../../../.docs/docs/WHY.md)
- [Product story](../../../.docs/docs/STORY.md)
- [Knowledge domains](../../../.docs/docs/DOMAINS.md)
- [System architecture](../../../.docs/docs/ARCHITECTURE.md)
- [Roadmap](../../../.docs/docs/ROADMAP.md)

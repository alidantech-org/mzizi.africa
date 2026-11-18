---
{id: TSK-A7FBFA1B238D,name: "Insights: statistics, elections, activity, civic money, media, search and a modern interface",type: task,status: planned,priority: medium,created_at: 2026-11-18T05:22:57.312Z,updated_at: 2026-11-18T05:22:57.312Z,order: 1024}
---

# Insights: statistics, elections, activity, civic money, media, search and a modern interface

## Goal

Make the public web app and the mobile app useful and modern: a theme system that accepts every colour notation and generates correctly for CSS and Flutter, a glass-surface design, hierarchical browsing and global search, and the data and screens for statistics (census and breakdowns over time), leaderboards, elections, legislative votes, civic funds and projects with locations, tenders with transparency markers, contacts and media. The same work closes the gaps left earlier: the engine explorer contract, tender mapping into the civic tables and a stack command that starts the database.

## Context

Dryv owns the theme and the generated clients and models; the NestJS reads, the web pages and the Flutter screens are hand-written. Real data was used wherever `.dev/` holds it (see `.docs/design/data/INSIGHTS.md`); the rest is invented and tagged `dev`. The database is disposable, so the migration stream was regenerated and the dev database rebuilt. Process rules are in `.docs/rules/`.

## Acceptance checklist

- [x] Dryv accepts hex, rgb, hsl, hwb, lab, lch, oklab, oklch, `color()` and names for theme tokens and writes sRGB for Flutter; new roles and glass tokens exist; tests pass.
- [x] New tables (statistics, activities) and changes to civic, finance and media are contracts, regenerated into SQL, migrations, row models, seed schemas and the SDKs.
- [x] `api.collect` tender records are mapped into civic procurements and projects through a mapping file; unmapped methods are reported.
- [x] The API serves search, browsing, statistics, leaderboards, elections, parties, motions, leaders, civic delivery, projects and tenders; database-backed tests pass.
- [x] The web app has the new pages, breadcrumbs with hints, glass design, heat maps, a round-table, media embeds and missing-data notices.
- [x] The Flutter app has search, an explore hub and screens for the same areas, with deep detail in modal bottom sheets.

## Progress

Done on 18 November 2026. The Flutter screens compile, analyse clean and the explore hub was seen at phone size; the other Flutter screens were not seen rendered because the browser pane was hidden. Not done: ward-level results, the Senate, accounts, public like counts, real (non-sample) votes.

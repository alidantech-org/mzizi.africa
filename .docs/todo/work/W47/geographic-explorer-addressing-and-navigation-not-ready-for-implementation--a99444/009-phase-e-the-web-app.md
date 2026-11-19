---
{id: TSK-0CE2BE62D0CC,name: "Phase E: the web app",type: task,status: in-progress,priority: medium,created_at: 2026-11-18T22:29:04.846Z,updated_at: 2026-11-19T13:04:34.977Z,order: 9216,extra: {readiness: ready,implementation_authorized: true,status_history: [{from: planned,to: in-progress,at: 2026-11-19T13:04:34.977Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-0CE2BE62D0CC/1795093474980-start,started_at: 2026-11-19T13:04:36.675Z}]}}}
---

# Phase E: the web app

## Goal

Rebuild the web app from contracts with every agreed feature, the new design and behaviours, full contextualisation and no hard-coding, verified in a browser against the seeded database. It follows the delivery plan backend-web-dev-delivery-plan and the decisions recorded with it, and is now governed by the consolidated group readiness gate; no runtime work, commit or push is authorized yet.

## Context

Read the delivery plan, the design documents in .docs/design, the feature register and the Dryv plan note. The Dryv repository holds uncommitted owner changes that are never committed or reverted. Seed additions follow the seed rules and invented data is tagged dev.

## Acceptance checklist

- [ ] Author every feature and view and regenerate the pages.
- [ ] Build the catalogue components and the hand-written shell in source/sdk/ui and delete lib/site, the client pages and the hard-coded strings, names, colours and navigation.
- [ ] Typecheck, lint patterns, production build and run against the API on mzizi_ux.
- [ ] Every page loaded and checked in the browser, with the five status layers recorded per feature.

## Consolidated ownership and readiness

This task becomes the single web migration and acceptance owner for the combined effort. It remains planned and authorized for implementation. Integrate country/place paths, grouped query state, optional language sharing, generated navigation, composed reads and duplicate-type removal per feature, rather than repairing the old route system before redesigning it. All work must consume approved Dryv capabilities and generated clients/types. The reported 40/45 HTTP routes and this chat's 43 page files are different measurements from different moments, not proof of a fixed route count or visual completion. Refresh the active inventory and baseline when implementation begins.

## Integrated acceptance checklist

- [ ] Migrate compare, election detail, finance and leadership product reads to server rendering; remove useAsync/effect-driven product reads and handwritten response duplicates in insights and governance adapters.
- [ ] Keep personal browser-only preferences/saved-item state and approved likes/view mutations distinct from product reads; preserve delivered interactions with regression evidence.
- [ ] Deliver each feature slice with its final country/place address, generated sidebar and copy, typed composed data, filters, details, evidence, maps/cards/search links and saved-link migration together.
- [ ] Rebuild the richer place overview and cover budgets, funds, politics, coverage, calendar, reports and utility pages; missing spending/debt/election inputs remain labelled gaps until approved data exists.
- [ ] Integrate nearest-facility and export screens when their generated API capabilities exist; do not link the browser directly to product API download endpoints as a workaround.
- [ ] Verify desktop/mobile rendering, keyboard/focus behaviour, direct and shared URLs, Back/Forward, search, pagination, language persistence, canonical metadata and source/evidence relevance.
- [ ] Run root quality checks, generation verification and browser network checks proving product reads occur on the server; report pre-existing failures and unverified deployment controls separately.
- [ ] Close every consolidated audit item with evidence or an explicit owner-accepted deferral, retaining external deployment and policy dependencies as unresolved until actually settled.

## Implementation authorization

The owner explicitly requested implementation of the integrated database, API and web redesign on 19 November 2026. That request supersedes earlier planning-only gates in this record. Implement web only, with realistic labelled synthetic development fixtures, contract-generated screen reads and clients/types. Engine operations, the dev frontend, Flutter and real-data acquisition are excluded. The accepted plan in this conversation is authoritative where older task prose conflicts. Seed-file approval rules remain in force.

## Comments

### 2026-11-19T13:19:14.130Z · PETER IRUNGU

Implemented the contextual shell and generated catch-all, government structure presentation with position detail, grouped navigation, language-aware sharing, and SSR finance/comparison wiring. Initial likes, legal basis and explanatory content now load on the server; writes remain client-triggered. Browser proof at desktop1440/mobile390 verified ex officio selection, country prefix, ZA isolation, language cookie, canonical selected identity, and one active sidebar item. This is a partial foundation: search/place-switcher results, many contextual renderers, locally scoped applicability, diagrams and remaining client reads are unfinished. Do not accept the full web proof yet.

### 2026-11-19T21:30:02.228Z · PETER IRUNGU

Owner replaced the web UI and changed ownership: all UI/theme/pages are handwritten; Dryv remains responsible for backend schemas and generated bridge clients. Current request is a code-only Git checkpoint: retain local data on disk, ignore fake/prepared datasets, GeoJSON, flags and downloaded media; include reusable active source and app identity assets. Backend integration planning follows separately. Data-dependent pages are not a self-contained clean-checkout application until their local imports are replaced.

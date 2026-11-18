---
id: DOC-DRYV-CAPABILITY-PLAN-20261118
name: DRYV_CAPABILITY_PLAN
type: documentation
tags: [dryv, gaps, capabilities, generation, traceability, proposal]
extra: {status: proposal_for_owner_agreement, date: 2026-11-18, code_changes: none}
---

# Dryv capability plan

**Status: proposal.** The owner is the Dryv author and decided Dryv changes are built directly as the proving slice needs them (2026-11-18). Each capability still gets a short record and a test in the Dryv repository so generation stays accurate and traceable. This extends the register in [DRYV_GAPS](../data/DRYV_GAPS.md) and the older frontend list in [dryv-frontend-proposals](../../_plan/guides/dryv-frontend-proposals.md). I have not read the Dryv engine end to end; the effort figures are estimates to be replaced after the first proving slice.

## 1. Capabilities needed, in order

| # | Capability | Why Mzizi needs it | Replaces | Effort |
| --- | --- | --- | --- | --- |
| 1 | **Typed sections instead of `dynamic()`**: nested typed schemas for composed documents, including arrays of heterogeneous sections as tagged unions | 82 `dynamic` fields force hand parsing in web (`parse/documents.ts`, 379 lines) and Dart (453 lines) | hand parsers, `lib/site/insights.ts`, `contracts.ts` | M |
| 2 | **Composed reads / authored queries**: an operation whose output is built from authored queries over schemas, with generated handler wiring | one SDK call per screen; removes 2.2k lines of hand SQL in `reads/` | `reads/*.ts` | L |
| 3 | **Context declarations**: country, language, locale, currency, place and source as a first-class context, resolved by generated middleware and sent by the SDK | multi-country; no UI constants | per-read `languageCode` inputs | M |
| 4 | **Features, intents, navigation and destinations** across several contract files, shared views, authored part order, transitions with context bindings | the product is more than six views | one `index.ts` per app, gaps 3, 4, 14 | L |
| 5 | **Render mode and SDK forms**: `server` or `client` per view or part, server SDK and browser SDK generated from one contract | no browser first-paint fetch, no `"use client"` pages | `transport.ts`, `useAsync` pages | M |
| 6 | **Copy and preferences**: copy keys collected from views, delivery operation, preference declarations with storage target | database-held copy per language | `i18n.tsx`, `phrases.ts`, `strings.dart`, `localStorage` | M |
| 7 | **Display hints on reference values**: icon, colour token, order, short label | no label or colour maps in apps | `ICON`, `PLATFORM_LABEL`, `COLOUR`, `STATUS_COLOUR` | S |
| 8 | **Interaction model**: authored interaction, device actor, consent, location proof and moderation entities, client-kind and attestation checks as policy | see [USER_INTERACTIONS_AND_TRUST](USER_INTERACTIONS_AND_TRUST.md) | none (new) | L |
| 9 | **Generation manifest and gates**: per-file provenance, regenerate-and-diff check, forbidden-pattern lint, blast-radius report | accuracy and traceability | manual restore after generation | M |
| 10 | **Protected extension points**: stable slots for hand-added modules (fixes the `app.module.ts` overwrite, gap 12) and a "report, never silently keep" conflict mode | safe regeneration | `--conflicts keep` | M |
| 11 | **Reproducible packs and engine pins**: packs published or vendored, one `bun run gen`, version check against the Dryv engine commit | clean-checkout regeneration | `file://` pack path, hand-typed command | S |
| 12 | **Spatial and constant-bound query support**: geometry types in DTOs and SDKs, spatial predicates, constant-bound read parameters | place at position, maps, scheme-scoped lists | hand use cases, gaps 5-8 | L |
| 13 | **Pack hygiene**: absolute imports in official frontend packs, no duplicated client types | project forks of packs | forks in `dryv/packs` | S |
| 14 | **Diagnostics**: template server errors with messages; consistent author APIs (named versus index context bindings) | faster pack work | gaps 10 and 14 | S |

Effort: S under a week, M one to two weeks, L two to four weeks, each by one engineer-and-agent pair.

## 2. Proving slice

One feature goes through every layer before bulk migration: **Place overview with context**.

1. Context: `GetContext` with country from the Cloudflare header, selection, language.
2. Composed read `GetPlaceOverview` with typed sections (no `dynamic`), headline numbers per level from indicator definitions, and structured gaps.
3. App contracts: a view, an address `/{country}/places/{placeCode}`, an intent "find my place", copy keys.
4. Pack output: a Next.js server page and a Flutter screen with a provider and repository, both from the same view.
5. Gates running: regenerate diff, forbidden patterns, manifest.
6. Test in three countries (one with data, one with partial data, one with none) plus an unknown country.

If the slice needs more than the estimates above, the plan and estimates are revised before migration begins.

## 3. How Dryv is changed safely

- Each capability: a note in `.docs/_plan/` with the problem, the existing vocabulary tried (reuse, then compose, then a narrow extension), the change, tests in the Dryv repository, and the Mzizi use that proves it.
- Dryv work is committed in the Dryv repository; the Mzizi `dryv.yaml` records the engine commit and pack source it was generated with.
- After a Dryv change: rebuild the TypeScript compiler `dist`, restart the Dryv API, regenerate everything affected, run the gates.

## 4. Issues Dryv has today that threaten correctness (summary)

Unreproducible pins (local `file://` packs, differing engine commits in `dryv.yaml` and the handoff); generation overwrites hand-edited files and `--conflicts keep` hides drift; no manifest ties files to contracts; open `dynamic` fields; no context, intent or render-mode vocabulary; opaque template-server failures; operation registration order dependence; geometry typed `unknown`; pack binding only within one run. Each is covered by a numbered capability above.

## 5. Open questions

1. May the Dryv repository be changed on its `develop` branch directly, and how are the Mzizi pins updated (pull request, tag)?
2. Is the Python author required to match the TypeScript author for these features, or is TypeScript authoring the only supported route?
3. Should the official packs repository receive these changes, or stay as project packs?
4. Is there a Dryv test suite I should run before each change, and what is the expected time?
5. Which capability is most urgent if only two can start immediately (suggested: typed sections and context)?

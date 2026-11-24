---
{id: GRP-F3C7A28BEB50,name: Model government structure and public life in the database for any country,type: documentation,extra: {created_at: 2026-11-19T09:51:25.462Z}}
---

# Plan

## Approach

Treat the design PDF as a requirements document and the Dryv contracts as the only place a table may be defined. Work in this order, because each step feeds the next: first map every screen element to the contracts that exist (task 001), then settle the vocabularies that make the model country-neutral (002), then add the structural tables (003 positions and seats, 004 links between positions and bodies, 005 public functions), then the statistics and place-resolution gaps (006, 007), then prove the whole model on paper against Kenya and two other systems (008), and last prepare generation, documentation and the seed plan (009). No task adds a seed file; the seed plan is a proposal for the owner.

## Neutrality rules that bind every task

- Contracts name concepts, never countries: position, seat, selection method, tier, function, link. The words "county", "ward", "governor", "Senate" appear only in seed rows and in `reference.copy` wording rows (which already take an optional country, `reference.ts` Copy).
- Structure that differs between countries is data: vocabularies are `reference` schemes whose values can be added per country; counts and rules are rows; wording is copy keyed by code.
- Existing Kenya-shaped vocabulary values (for example `gov.arm.devolved-government`, `gov.term.kind.ward`, `gov.term.kind.county-assembly`, `gov.office.kind.elected`) are reviewed in task 002 and generalised or superseded using `Value.supersedesId`, not silently renamed.
- Codes follow `.docs/rules/codes.md` and the `IdentityCode` property in `_shared.ts`. No version folders, file-name suffixes or version fields are invented (`.docs/rules/versioning.md`).
- Hand-written code never carries source or classification knowledge (`.docs/rules/typed-code.md`).
- Do not hand-edit generated SQL. Change the contract, regenerate, and follow the regenerate-reset-reseed recipe because Dryv cannot yet produce a change-aware migration (`.docs/design/data/DRYV_GAPS.md`, gap 1).

## Risks

- Dryv limits: composite or partial uniqueness, `exactly one of` rules across several columns, and cross-scheme value checks are listed gaps (DRYV_GAPS gaps 5, 8, 9, 10). Each task states the intended constraint and the fallback if the pack cannot yet generate it.
- Over-modelling: adding a table for every sentence in the design. Each task gives the smallest model that carries the facts, with alternatives recorded.
- Mixed axes: the current office kind mixes "what the office does" with "how it is filled"; separating them touches generated models and any reads using them.
- Owner approval is required for every new vocabulary and seed file; tasks wait on it rather than assuming it.

## Added 19 November 2026: power, money, patterns, sites and promises

Tasks 010 to 015 extend the plan and are designed in `.docs/design/data/POWER_MONEY_PATTERNS_AND_SITES.md`. Order: 010 patterns (it feeds 003, 011 and the seed plan), 012 powers (replaces the overlapping link table in 004), 013 supplier and contract completion, 014 people behind suppliers and political money, 011 site patterns, 015 promises and Gazette evidence. All still precede any screen or API work and all need owner approval of each table and vocabulary. Pattern work depends on the owner direction in `.docs/decisions/DEC-PATTERNS-GENERATE-EXPECTED-DATA-20261119.md`, which keeps the removed pattern version, binding and dependency tables removed.

## Revised 19 November 2026 (second message)

Task 001 is now the implementation of the approved inventory `.docs/design/data/SCHEMA_CHANGE_INVENTORY_20261119.md` across all Dryv contracts and generated models, with a working proof. Tasks 002 to 008 and 010 to 015 remain the design specifications it cites. Nothing is authored until the owner approves the inventory. Table names are one word; unstructured material lives in `filesystem.contents` and `filesystem.media`.

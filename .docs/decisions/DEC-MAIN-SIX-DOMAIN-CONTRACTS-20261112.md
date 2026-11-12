---
id: DEC-MAIN-SIX-DOMAIN-CONTRACTS-20261112
name: Main six domain contracts
type: decision
tags: [database, dryv, main, schema-redesign]
extra: {status: contracts_authored, migrations_authorized: false, deployment_authorized: false, recorded_on: 2026-11-12}
---

# Main six domain contract implementation — 12 November 2026

The user's six-domain implementation handoff authorizes Main Dryv contract development for Official, Governance, Politics, Civic, Finance and Accountability. This record confirms that implementation in the local `develop` checkout; it does not approve migrations, live data changes, generated SQL releases or deployment.

## Current ownership and tables

- **Official:** `entities`, `individuals`, `names`, `identifiers`, `contacts`, `relationships`. Each real identity has one canonical owner; neutral tables attach names, identifiers, contact channels and relationships through typed FKs.
- **Governance:** `institutions`, `offices`, `holders`, `mandates`, `relationships`, `authority_scopes`. Offices remain independent from holders. Authority scope references a Geography unit and may carry Reference country identity. Legal basis uses Reference's LegalBasisLinks interface.
- **Politics:** `parties`, `memberships`, `coalitions`, `alignments`, `elections`, `contests`, `candidates`, `electorates`, `results`, `manifestos`, `manifesto_items`, `referendum_options`, `option_results`. Candidate party affiliation is captured at election time; results and electorate totals are scoped by Geography unit.
- **Civic:** `services`, `projects`, `project_features`, `procurements`, `bids`, `contracts`, `deliveries`. Procurement belongs to Civic. Geography owns physical assets, places and geometry.
- **Finance:** `fiscal_periods`, `budgets`, `budget_versions`, `appropriations`, `funds`, `flows`, `debts`. Flows retain source transaction grain. Exact amounts use non-negative integer currency minor units and an explicit Reference currency value; Finance has no `units` table.
- **Accountability:** no persisted tables. The module identifies read-only analytical outputs; aggregate query execution is not implemented in the current Dryv database application.

The database application explicitly composes the persisted Main groups together with Reference, Geography, Legal, Source and Filesystem and retains the seven Operations groups. The namespace catalogue and Rust pack namespace inputs omit standalone Procurement and persisted Accountability. No cross-database FK is introduced.

## Verification and generation gates

TypeScript typecheck, Dryv database doctor/compile, database namespace assignment audit, legacy contract audit and formatting checks passed for the local authored contracts. These checks verify contract construction and same-database relationships in the authoring graph; they do not prove database enforcement.

The Rust SQL pack does not yet faithfully enforce neutral-owner XOR checks, preferred-name partial uniqueness, protected-contact access policy, some null-sensitive cross-field constraints, the repository code-shape checks and shared numeric ranges, or geospatial types/indexes. Reference value-to-scheme membership and currency minor-unit interpretation also require application-level policy or additional relational support. Keep database generation/application gated until these behaviors are represented and verified. No SQL generator, migration, live database, seed import, deployment, or object-storage operation was run for this task.

## Scope boundary

Older schema dictionaries remain historical planning input. Current contract inventories and row grains are stated in the six Phase 01 owning documents and the accompanying [implementation handoff](../handoffs/HANDOFF-MAIN-SIX-DOMAIN-CONTRACTS-20261112.md). The prior `DEC-MAIN-EVIDENCE-CONTRACTS-20261112` records the earlier foundation dependency scope; this decision extends the authorized Main contract graph without changing Reference's direct legal-basis contract or introducing a proxy Legal schema.

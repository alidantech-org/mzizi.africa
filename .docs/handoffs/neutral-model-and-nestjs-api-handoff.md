---
{id: HANDOFF-NEUTRAL-MODEL-NESTJS-API,name: Handoff - jurisdiction-neutral model and NestJS API plan,type: handoff,tags: [api,nestjs,dryv,migration]}
---

# Handoff: jurisdiction-neutral model and NestJS API plan

Written for an agent picking this up cold. It describes intent and open decisions, not finished work. Nothing described under "What exists" below was committed; verify against the repository before relying on it.

## Hard rules

- Work only on `develop` in the main checkout. No branches, no worktrees (`.docs/rules/branching-and-task-usage.md`).
- Every piece of work goes through the Task CLI. Read `.docs/rules/task-writing.md` first.
- Do not push, merge to `main`, or touch `.github/**` unless the user says so.

## What the user wants

1. A NestJS product API that mostly **reads and serves** canonical data. Its only writes are comments, evidence uploads, and RBAC-gated admin updates and review decisions.
2. Cleaning, processing and saving into the canonical database stays in **separate services** (`source/backend/data-engine`, `intelligence`, `files`, `db-engine`). Do not blend the two. This is the boundary in `AGENTS.md` section 2.
3. The models under `source/backend/api/app/routes/*/models` migrated into a design that works for **any government system**. Kenya must be fully representable but must not shape the core schema; Kenyan levels, institution types, election types, selection rules and fiscal stages become records scoped by jurisdiction and period, not enums or columns.
4. A `dryv/` folder holding contracts for the models and system behaviour so code (NestJS controllers, DTOs, TypeORM entities, clients) is generated. Dryv is the user's own code-generation engine at `/home/alidante/Projects/personal/alidantech-org/codepot/dryv`; contracts can be authored in Python with `dryv_author`.

## Sources of truth (read these, not this file alone)

- `.docs/docs/WHY.md`, `STORY.md`, `ARCHITECTURE.md` (section 7 is the API boundary), `DATA_LIFECYCLE.md`, `DOMAINS.md`, `MIGRATION.md`.
- `.docs/docs/audits/COUNTRY_NEUTRAL_GOVERNANCE_MODEL_RESEARCH.md`: the neutral design (layers A to D, auditability contract, disposition table, acceptance matrix). It is a proposal; nothing in it is approved for implementation.
- `.docs/docs/geography-api-contract.md`: the mobile geography contract the first slice should satisfy.
- The legacy models: `source/backend/api/app/routes/*/models` (live) and `source/backend/api/_archives` (older domains). The separate political-governance repository is not needed; everything useful from it is already in `_archives`.

## Facts established about the legacy models

- About 100 live model files across geographic, legal, governance, offices, people, elections, political, events, entities, finance, debt, procurement, statistics, services, files and scraper. Only geographic and legal have endpoints; the rest are models plus CSV seeds.
- Scraper and files models, the PDF extractor, web scraper, S3 code and Alembic seeds are not API concerns. They belong to data-engine, files and db-engine.
- Patterns to fix, not copy: no shared mixins; ULID, UUID and String(36) primary keys mixed; foreign keys doubled as `x_id` plus `x_code`; enums scattered per file; plain JSON instead of JSONB or PostGIS; provenance strong only on `geo_boundary_versions`; the `services` domain has no migration.
- Business keys are hierarchical slash codes (for example `ke/nairobi/westlands`). The legacy README says relationships should use these codes and no numeric id foreign keys.
- Kenya-specific content that must become data: the `ke/` prefix, level names national/county/constituency/ward, constitution article references, IEBC institutions, max_terms and retirement ages, `tax_pin`, professional licence fields, fiscal workflow stages, election types.

## Approach that was agreed (adjust if the structure demands it)

1. Inventory and classify every model and field (reuse, extend, split, country-config, replace, investigate), starting from the audit's disposition table. Output goes in `.docs/docs/`.
2. Author shared contracts first: provenance (source, artifact, retrieval time, method of extracted, inferred, curated or ai_assisted, confidence), valid time versus record time, verification state, a single hierarchical business code, jurisdiction-scoped classification records, standard failures.
3. Pilot with geography (units, jurisdiction-scoped levels, versioned boundaries, name history), then legal, governance with offices and people, elections with political and events, entities with finance, debt and procurement, then statistics and services.
4. Scaffold the NestJS app (bun, TypeORM, PostgreSQL with PostGIS). Generated code comes from Dryv packs; only service implementations are hand-written. Use a read-only database role for domain tables and a restricted writer for comments, evidence records and review decisions. The API never runs migrations or seeds.
5. Update the matching `.docs/docs/` files in the same work.

## Open decisions the user has not settled after the restructure

- Settled on 2026-11-02 (see `.docs/decisions/nestjs-api-and-dryv-placement.md`): the NestJS app lives in `source/backend/api`, and `dryv/` lives at the repository root.
- Dryv packs: local checkout path versus a pinned git ref.
- Whether Dryv's typeorm pack can express PostGIS geometry and JSONB.
- Auth and RBAC provider (own JWT or external).
- Whether evidence uploads pass through the `files` service (assumed yes, by reference only).

## What exists

Earlier exploratory work was done in a worktree that has since been deleted and was never committed. Treat it as gone. It showed that Dryv's Python author compiles a small shared-contracts module and a geography module to Runtime IR without errors (`dryv-py compile`), which is evidence the approach is viable, not deliverable output. Re-do it under the current rules.

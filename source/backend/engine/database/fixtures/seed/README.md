# Seed data and automated extraction

Mzizi loads data two ways, and the difference matters for trust.

**Seed data** is small, stable structure that a coding agent or developer prepares, saves as JSON here and a seeder loads: the governance structure of Kenya (`ke-governance-structure.json`), the site registry (`../research`), reference classifications (`../reference`). Each file says how it was made. `ke-governance-structure.json` is **custom-prepared from manual research** (see its `_meta`): not copied from one official list, with a confidence value per row, and ministry rows to be checked against the current Executive Order. Seeders are idempotent and never overwrite an existing row.

**Automated extraction** is data that is too large or changes too often to hand-prepare: people (Parliament lists), legal text, funds, tenders. It goes through the gate, staging, validation, review and promotion, keeps its raw evidence, and is deduplicated and profiled by the matching system (`engine.match_candidates`, `engine.match_clusters`; see `DEC-ENTITY-MATCHING`).

Geography sits between the two: boundaries are prepared datasets (geoBoundaries via the Polifin repository, cross-checked with HDX COD-AB) loaded by `import-geo-admin` with parents found by geometry.

## Governance catalogue (version 2)

`ke-governance-structure.json` is the single catalogue of public bodies. Every institution has a required `scope` (`national`, resolved to the jurisdiction's root geography unit, or a geography unit code), and may carry `offices` (title, cardinality, appointing authority, selection, term, legal basis), `expectations` (headquarters and other presence a body should have, with a basis and no address) and `knownUnknowns`; top-level `facilities` lists national service sites with their operator and county. `bun src/cli.ts seed governance-catalogue` validates the file (`validateCatalogue`), loads it idempotently, registers it as a source document of the publisher "Mzizi curated research" and attributes each loaded row to it with method curated. Regional and per-geography offices are generated from `fixtures/patterns` (see the office pattern decision), not listed here.

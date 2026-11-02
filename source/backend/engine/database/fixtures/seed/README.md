# Seed data and automated extraction

Mzizi loads data two ways, and the difference matters for trust.

**Seed data** is small, stable structure that a coding agent or developer prepares, saves as JSON here and a seeder loads: the governance structure of Kenya (`ke-governance-structure.json`), the site registry (`../research`), reference classifications (`../reference`). Each file says how it was made. `ke-governance-structure.json` is **custom-prepared from manual research** (see its `_meta`): not copied from one official list, with a confidence value per row, and ministry rows to be checked against the current Executive Order. Seeders are idempotent and never overwrite an existing row.

**Automated extraction** is data that is too large or changes too often to hand-prepare: people (Parliament lists), legal text, funds, tenders. It goes through the gate, staging, validation, review and promotion, keeps its raw evidence, and is deduplicated and profiled by the matching system (`engine.match_candidates`, `engine.match_clusters`; see `DEC-ENTITY-MATCHING`).

Geography sits between the two: boundaries are prepared datasets (geoBoundaries via the Polifin repository, cross-checked with HDX COD-AB) loaded by `import-geo-admin` with parents found by geometry.

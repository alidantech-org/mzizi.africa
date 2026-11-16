---
{id: TSK-C145D32860A4,name: Redesign geography around features and versioned geometries,type: task,status: in-progress,priority: medium,created_at: 2026-11-16T19:15:57.254Z,updated_at: 2026-11-16T19:16:00.957Z,order: 12288,extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-16T19:16:00.957Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-C145D32860A4/1794856560960-start,started_at: 2026-11-16T19:16:01.391Z}]}}}
---

# Redesign the geography schema around one feature with versioned geometries

## Goal

Make the geography schema able to draw a real, historically correct map. A feature is one identity (Kenya, a county, a river, a tribe's territory). It has many versioned geometries, dated and uncertain validity, names, identifiers and typed, dated relationships to other features. Redundant tables (`units`, `places`) are removed. Success: the contracts regenerate cleanly, the table schemas and the hand-written PostGIS release describe one coherent model, and a map at any zoom level can be served from current geometries.

## Context

The owner approved this design on 16 November 2026 after discussion. The database is disposable, so contracts are regenerated and no data migration is needed. Decisions: `features` is the only identity and carries a code, a type and a dated validity with optional earliest and latest bounds. Country membership, administrative and electoral parentage, rivers flowing through countries and similar facts are dated rows in `relationships`, classified by schemes and values. Kenya's feature carries an identifier tying it to the Reference country. `geometries` holds many revisions per feature and role, each with a basis (surveyed, reconstructed, approximate, illustrative, claim), a confidence, a source, the stored file version and zoom range. Current means no end date. One `addresses` table is designed in its own task. The PostGIS geometry column and spatial indexes are a hand-written database release, applied only with the owner's approval. Large source files stay in the filesystem as evidence. See `.docs/decisions/DEC-MZIZI-REFERENCE-GEOGRAPHY-20261112.md`, which this supersedes.

## Acceptance

- [ ] A new decision record supersedes the nine-table inventory with the approved design.
- [ ] `units` and `places` are removed and every other schema now points at `features`.
- [x] Features, relationships and geometries have uncertain validity bounds; geometries have basis, revision, supersedes link, confidence and zoom range.
- [ ] Contracts are regenerated for SQL, models, API and schema JSON with no errors.
- [ ] A hand-written release adds the PostGIS geometry column, spatial indexes, the current-geometries view and the one-current-revision rule.
- [ ] Geography schemes and values (feature types, relationship kinds and systems, geometry roles and basis, identifier schemes) are listed for seeding with owner approval.
- [ ] Tests and `task validate` pass; remaining gaps are recorded.

## Progress

16 November 2026. Done without Dryv's help: the decision record `DEC-GEOGRAPHY-FEATURES-AND-VERSIONED-GEOMETRIES-20261116`; the contracts (uncertain-validity bases, features, geometries with revision, basis, confidence and zoom range, relationships, `units` and `places` removed, five other schemas now point at features); regenerated SQL, models, API and table schemas; the API's stale unit use cases and tests removed (typecheck and 3439 tests pass). Waiting on the owner's Dryv fix: a typed PostGIS geometry column, spatial indexes, views, generated columns, scheme-membership constraints.

## Proposed schemes and values (for owner approval, not seeded)

Global, each its own part under `seed/data/global/geography/`:

- `geo.feature.type`: country, admin-area, settlement, ward-like-area, river, lake, dam, road, bridge, historical-territory, culture-area.
- `geo.relationship.kind`: part-of, borders, flows-through, located-on, connects, replaced-by.
- `geo.relationship.system`: administrative, electoral, statistical, hydrological, historical.
- `geo.geometry.role`: outline, centroid, label-point, claimed-outline.
- `geo.geometry.basis`: surveyed, reconstructed, approximate, illustrative, traditional-claim.
- `geo.identifier.scheme`: reference-country, iso-3166-1-alpha2, geoboundaries, wikidata.

Kenya only, under `seed/data/ke/reference/`: the local labels for administrative levels (county, ward, constituency, province, district), each mapped to a global admin type.

16 November 2026: the owner approved the global list. Six schemes and 34 values were added to the existing `seed/data/global/reference/schemes.csv` and `values.csv` (the draft entry "ward-like-area" was dropped; wards are administrative areas). The seed check passes. Kenya-only labels in `seed/data/ke/reference/` still need their exact rows approved.

16 November 2026 (later): the owner rejected the flat feature-type list. Added `parent_id` to reference values (broader value in the same scheme, acyclic) and made `value_relations` a real table for cross-scheme or many-parent links. Added `geography.classifications` (a dated scheme value per feature, so a feature can answer several classification questions). The six schemes and 34 values were removed again; the replacement hierarchy needs the owner's approval of exact rows before seeding. `reference.values` is split into `values/{fin,geo,ref}.values.csv` and the check reads parts in table folders.

Added on the owner's approval: `reference.value_labels` (a value's label per language and kind: preferred, alternative, abbreviation, definition, with validity) and `geography.feature_topics` (a dated feature-to-topic link for what a feature is about or used for). Neither has a natural key yet, so neither can be seeded by CSV.

Owner decisions, later the same day: `geography.feature_topics` was removed again. Tables with no code now have a composite natural key taken from their first unique index (links written as codes), so they can be seeded: `reference.value_labels`, `reference.value_relations`, `geography.names`, `geography.relationships`, `geography.changes`, `geography.classifications`, `geography.identifiers`, `geography.geometries` and others. The generator derives it; the seed check already compared whole keys. The loader will decide how an id is derived from a composite key when it is written.

Seeded on the owner's approval: nine geography schemes, 75 values (hierarchical feature kinds plus the other axes) and Kenya's feature, names and identifiers under `seed/data/ke/geo/`. The seed check passes with no problems.

Dryv fix adopted (16 November 2026): geometries now have a real PostGIS geometry column with a GiST index, stored envelope, centroid and area, a `current_geometries` view and a partial unique index so a feature has one current drawing per role. Scheme tags on the feature kind, name kind, identifier scheme, relationship kind and system, geometry role and basis, and the country links make the database reject a value of the wrong scheme. Checked on a scratch PostGIS database (dropped afterwards): the wrong scheme was rejected, a second current drawing was rejected, and a closed revision allowed the next. Open: the generated NestJS entity renders the partial unique index as a full unique index and the geometry column as jsonb.

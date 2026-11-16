---
id: DEC-GEOGRAPHY-FEATURES-AND-VERSIONED-GEOMETRIES-20261116
name: Geography is features with versioned geometries and dated relationships
type: decision
tags: [database, schema, geography, approval]
extra: {status: accepted, approved_on: 2026-11-16, supersedes: DEC-MZIZI-REFERENCE-GEOGRAPHY-20261112, task: TSK-C145D32860A4, migrations: postgis_release_needs_separate_approval}
---

# Geography is features with versioned geometries and dated relationships

## Decision

On 16 November 2026 the owner approved redesigning the geography schema after discussion. This replaces the table inventory in DEC-MZIZI-REFERENCE-GEOGRAPHY-20261112.

- `geography.units` and `geography.places` are removed. A feature's type, a scheme value, says whether it is a country, county, ward, river, dam, road or a historical territory. Everything that pointed to a unit or place now points to `geography.features`.
- `features` is the only identity. It carries a code, a type and a validity period whose start and end may be uncertain (best estimate plus earliest and latest bounds). It carries no country and no parent.
- Country membership, administrative and electoral parentage, a river flowing through a country, a dam on a river and similar facts are dated rows in `relationships`, classified by a kind and a system, both scheme values. Kenya's own feature carries an identifier (scheme `reference.country`) that ties it to the Reference country.
- `geometries` holds many drawings per feature and role. Each has a revision, a link to the one it replaced, a basis (surveyed, reconstructed, approximate, illustrative, traditional claim), a confidence, a zoom range, a validity period, a source and the stored file version. The current drawing has no end date; no flag is stored.
- Identity-level change (a split, merger or replacement) stays in `changes`. Changing shape within one identity is a new geometry revision.
- Retained: `names`, `identifiers`, `relationships`, `changes`, `datasets`. A single `addresses` table is designed in its own task. Large source files stay in the filesystem as evidence; the database holds the derived geometry and points back to the file version.
- PostGIS holds vector geometry (SRID 4326, spatial indexes, a current-geometries view). Rasters and very large vector dumps stay in file storage.

## Open

Dryv cannot yet author a PostGIS geometry column, spatial indexes, views or generated columns. The owner is fixing Dryv. Until then the geometry column is excluded from generated SQL and the PostGIS release is not written. Applying any release to a database still needs the owner's say-so.

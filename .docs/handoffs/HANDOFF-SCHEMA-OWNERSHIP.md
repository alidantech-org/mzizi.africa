---
id: HANDOFF-SCHEMA-OWNERSHIP
name: Files, sourcing, reference and legal ownership
type: handoff
---

# Schema ownership handoff

## Agreed goal and authoritative design

The owner approved the corrected Source, Filesystem and geographic-asset target on 17 November 2026. The consolidated [detailed design](../design/data/SOURCE_FILESYSTEM_GEOGRAPHY.md) records the complete table inventory, responsibilities, candidate fields, integrity requirements, examples, migration map and remaining contract work. It replaces the accumulated earlier proposals in this handoff so rejected options cannot be mistaken for active direction.

This is approved design direction and documentation, not implementation authorization. No contracts, runtime behavior, seed files, generated outputs or database migrations are changed by documenting it. Work directly on develop using Task; preserve unrelated changes and read AGENTS.md. The owner subsequently approved the seven-table Legal target in the [Legal design](../design/data/LEGAL_SCHEMA.md); it is documented, not implemented. Geography asset/media interfaces are included in the agreed target.

## Settled decisions

- Filesystem owns all exact bytes/storage/access and keeps folders, files, file_versions, file_extensions, tags, taggings and media.
- Source owns origins, acquisition URLs, discoveries, captures, logical document/dataset products, editions, artifacts and classified I/O/provenance connections.
- Remove filesystem.file_relations after preserving its data and migrating callers. Source I/O does not require engine events; loose external execution IDs are optional.
- Keep filesystem.media with subject-table/subject-ID mentions, exact file version, Reference kind, natural description, purpose and optional ordering. Remove source_url. Subjects do not carry general media_id pointers. One file can have many subject associations.
- Source classifies sources and publishers directly, including credibility and official/research status as appropriate. No authority_assessments table and no document is_official flag.
- Keep domains separate. Addresses replaces paths. Discoveries remain distinct from retrieval captures.
- Source's target tables are publishers, sources, domains, addresses, discoveries, captures, products, editions, artifacts, relationships, citations, verifications and attributions.
- Remove manifests, manifest_releases, manifest_bindings and publication_receipts from this target. Resolve their current dependencies first. Do not automatically relocate/recreate them; later needs require a fresh design.
- Reference retains schemes, values and the existing language registry. Default names never silently acquire English attribution.
- Geography keeps features, names, classifications, identifiers, geometries, relationships and changes; add assets for classified feature/geometry-to-exact-GIS-file associations. Remove geography.datasets after migration. No dataset_profiles.
- Geography assets has a mandatory feature_id FK and an optional geometry_id association. Enforce that any selected geometry belongs to feature_id using a composite FK and referenced composite unique key; do not use an exactly-one-target design.
- Filesystem media handles photographs/video/logo uses. Geography assets handles spatial data use, including file/layer/band selectors where appropriate. Source handles acquisition/provenance for both.
- Legal owns legal bases/effects on other records. Geography/Official retain the affected identities. Legal now has an approved separate seven-table target: instruments, editions, provisions, wordings, references, relationships and effects. Preserve incoming evidence/content interfaces through explicit migration; see the Legal guide.

## Next work

Prepare the exact Source/Filesystem and Geography association contracts for review, using the detailed design's implementation-preparation checklist. Account for every current table, column, incoming pointer, generated consumer and seed loader. Make migration and integrity behavior reviewable before asking for implementation approval. No current descriptive comment, archived implementation or planning document proves runtime support.

Use multi-source Constitution, institution/project media, county GIS assets and historical CSV-line provenance as the acceptance examples. Keep source origin, credibility, review state, storage access, rights and legal force separate. Preserve raw bytes, exact historical inputs, time, uncertainty and disagreements.

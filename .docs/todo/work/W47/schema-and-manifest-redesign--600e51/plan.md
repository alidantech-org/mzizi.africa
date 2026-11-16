---
{id: GRP-F920F7600E51,name: Schema and manifest redesign,type: documentation,extra: {created_at: 2026-11-16T13:05:47.676Z}}
---

# Approach

Design first, build second. Every task in this group begins with a design section that the owner must approve in a task comment before any file is changed. A task cannot be started until that approval is recorded, so no schema, seed file or validator is touched on an assumption. The designs are reviewed one file type at a time in the order below, because later designs depend on earlier ones: the root manifest and folder descriptors come first, then table seeds generated from Dryv, then site and mapping manifests, then job specifications, and finally the folder layout and the validator rewrite.

# Milestones

1. Root seed manifest and registry design (the roots `data`, `sources`, `mappings`, `vocabularies`).
2. Cross-reference registry for manifest codes: unique codes, scope visibility, cycles, clear errors.
3. Table schemas and CSV rules: the table comes from the path `data/<scope>/<domain>/<table>.csv`.
4. Folder descriptors and bootstrap design.
5. Sources schemas: shared header, website, API, module and extraction, with authority resolution.
6. Mapping design against the generated database schemas, in `seed/mappings/`.
7. Engine job spec and placements, generated from the typed models.
8. JSON input decisions and vocabularies.
9. Final folder layout and archive-first moves.
10. Rewrite of the manifest package and verification of every seed file.

# Risks

- The cross-reference registry is new validator work, so it is designed and tested first, with deliberately broken seed trees.
- The authored `sources/` folder shares a name with the database `source` group, so the plural is used and the glossary states the difference.
- API manifests may only name credential bindings, never secrets, and the API schema covers only what the fetch package implements.
- Migration is archive-first and one source at a time.

- The Dryv API has been unreliable under load, so generation steps should be retried and checked with the verify command.
- Retiring stale mappings may remove the only record of an importer's intent, so each retirement keeps an archived copy and a note.
- The assessment and dossier tables do not exist in the current SQL, so source authority resolution must start from site manifests and stay replaceable.
- The workers task for spec-driven stage pipelines depends on the authority and placements designs and stays blocked until they are approved.

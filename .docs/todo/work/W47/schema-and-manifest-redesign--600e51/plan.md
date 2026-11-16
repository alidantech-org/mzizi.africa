---
{id: GRP-F920F7600E51,name: Schema and manifest redesign,type: documentation,extra: {created_at: 2026-11-16T13:05:47.676Z}}
---

# Approach

Design first, build second. Every task in this group begins with a design section that the owner must approve in a task comment before any file is changed. A task cannot be started until that approval is recorded, so no schema, seed file or validator is touched on an assumption. The designs are reviewed one file type at a time in the order below, because later designs depend on earlier ones: the root manifest and folder descriptors come first, then table seeds generated from Dryv, then site and mapping manifests, then job specifications, and finally the folder layout and the validator rewrite.

# Milestones

1. Root seed manifest and registry design.
2. Folder descriptor and bootstrap design.
3. Dryv-generated table schemas and the CSV seed rules.
4. Site bundle design: manifest, modules, ranking, sections, tags and source authority resolution.
5. Mapping design against the current Dryv contracts.
6. Job specification and placements design, replacing the old pipeline manifest.
7. JSON input inventory and decision for each file.
8. Folder layout and retirement of stale inputs.
9. Rewrite of the manifest package and verification of every seed file.

# Risks

- The Dryv API has been unreliable under load, so generation steps should be retried and checked with the verify command.
- Retiring stale mappings may remove the only record of an importer's intent, so each retirement keeps an archived copy and a note.
- The assessment and dossier tables do not exist in the current SQL, so source authority resolution must start from site manifests and stay replaceable.
- The workers task for spec-driven stage pipelines depends on the authority and placements designs and stays blocked until they are approved.

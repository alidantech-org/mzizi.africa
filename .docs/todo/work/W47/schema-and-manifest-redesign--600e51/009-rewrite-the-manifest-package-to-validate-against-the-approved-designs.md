---
{id: TSK-B2EE7D0891F3,name: Rewrite the manifest package to validate against the approved designs,type: task,status: planned,priority: medium,created_at: 2026-11-16T13:05:55.828Z,updated_at: 2026-11-16T13:49:40.101Z,order: 9216,depends_on: [TSK-7B87B0F9ED6D,TSK-6033104AA031]}
---

# Rewrite the manifest package to validate against the approved designs

## Goal

Rewrite `source/packages/manifest` so it validates every YAML and CSV input against the approved schemas and the generated database schemas, then verify every seed file.

## Context

The current package has about 750 lines. It checks the root manifest shape, folder metadata, paths, hashes and duplicate keys, but not CSV columns, table existence, references between manifests or mappings. It follows `.docs/rules/typed-code.md`, so no free dictionaries past the parsing boundary. It depends on the cross-reference registry and on every schema design above. This task belongs to the schema and manifest redesign group. The owner approved the sources layout on 16 November 2026: schemas live under `source/schema/` in `database/`, `seed/`, `sources/`, `mapping/`, `vocabulary/`, `engine/` and `extraction/`, and seed inputs live under `seed/` in `data/`, `sources/`, `mappings/`, `vocabularies/` and `_fixtures/`. No version appears in any folder or file name (`.docs/rules/versioning.md`). Nothing is built until the owner approves this task's design in a task comment. Related material: `.docs/design/acquisition/SITE_STRUCTURE_SPEC.md`, `source/schema/README.md`, `seed/README.md` and `AGENTS.md`.

## Acceptance checklist

Work on a Build item starts only after the Approval item is ticked.

- [ ] Design: Write the validator design: the layers (shape, registry, CSV by path, mappings, sources), the report format and which errors stop a release.
- [ ] Design: Define the command line surface and exit codes.
- [ ] Design: Agree the test plan using real and deliberately broken seed files.
- [ ] Approval: The owner has approved the design in a task comment, and the comment is quoted under Notes.
- [ ] Build, only after approval: Rewrite the validators in layers: YAML shape, registry, CSV against generated schemas, mappings, then sources.
- [ ] Build, only after approval: Produce a validation report before any database write.
- [ ] Build, only after approval: Run the new checks over every seed file and fix or retire each failure.
- [ ] Build, only after approval: `task validate` and the relevant checks pass, and every README and design link that mentions the changed files is updated.

## Notes

Record findings, rejected options and the approval here.

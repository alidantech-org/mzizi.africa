---
{id: TSK-B2EE7D0891F3,name: Rewrite the manifest package to validate against the approved designs,type: task,status: planned,priority: medium,created_at: 2026-11-16T13:05:55.828Z,updated_at: 2026-11-16T13:06:01.945Z,order: 9216,depends_on: [TSK-7B87B0F9ED6D]}
---

# Rewrite the manifest package to validate against the approved designs

## Goal

Rewrite `source/packages/manifest` so it validates every YAML, JSON and CSV input against the approved schemas and the generated table schemas, then verify every seed file.

## Context

The current package has about 750 lines. It checks the root manifest shape, folder metadata, paths, hashes and duplicate keys, but not CSV columns, table existence or foreign keys. It follows `.docs/rules/typed-code.md`, so no free dictionaries past the parsing boundary. This task is part of the schema and manifest redesign group. Nothing in it is built until the owner has approved the design in a task comment, and the group goal and plan describe how the pieces fit together. Related material: `.docs/design/acquisition/SITE_STRUCTURE_SPEC.md`, `source/schema/README.md`, `seed/README.md` and `AGENTS.md`.

## Acceptance checklist

Work on a Build item starts only after the Approval item is ticked.

- [ ] Design: Write the validator design: the layers, the report format and which errors stop a release.
- [ ] Design: Define the command line surface and exit codes.
- [ ] Design: Agree the test plan using real and deliberately broken seed files.
- [ ] Approval: The owner has approved the design in a task comment, and the comment is quoted under Notes.
- [ ] Build, only after approval: Rewrite the validators in layers: YAML shape, CSV against generated table schemas, then foreign keys and ordering.
- [ ] Build, only after approval: Produce a validation report before any database write.
- [ ] Build, only after approval: Run the new checks over every seed file and fix or retire each failure.
- [ ] Build, only after approval: `task validate` and the relevant checks pass, and every README and design link that mentions the changed files is updated.

## Notes

Record findings, rejected options and the approval here.

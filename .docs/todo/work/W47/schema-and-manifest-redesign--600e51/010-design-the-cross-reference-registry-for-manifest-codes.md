---
{id: TSK-6033104AA031,name: Design the cross-reference registry for manifest codes,type: task,status: planned,priority: medium,created_at: 2026-11-16T13:49:37.355Z,updated_at: 2026-11-16T13:49:38.266Z,order: 10240,depends_on: [TSK-9A8E9A0A16B1]}
---

# Design the cross-reference registry for manifest codes

## Goal

Define how one manifest refers to another by code, so a website or API source can use shared mappings, vocabularies and extraction expectations, and the validator can prove every reference points at something real.

## Context

The approved layout lets a source declare a `uses` block listing mapping, vocabulary and extraction codes instead of copying them. That needs one registry built by scanning the seed tree, because a reference is only useful if an unknown, duplicate or circular code is caught before a crawler or loader runs. The registry is new validator work and the riskiest part of the manifest rewrite, so it is designed and tested before the schemas that depend on it. The owner approved the sources layout on 16 November 2026. No version appears in any folder or file name (`.docs/rules/versioning.md`). Nothing is built until the owner approves this design in a task comment. Related: `source/schema/README.md`, `seed/README.md`, `AGENTS.md`.

## Acceptance checklist

Work on a Build item starts only after the Approval item is ticked.

- [ ] Design: Define the code format (dotted, lowercase) and where a manifest declares its code, and state that a source's code equals `source.sources.code`.
- [ ] Design: Define visibility: a manifest may use items in its own scope or in `global`, never in another country.
- [ ] Design: Define the errors: unknown code, duplicate code, cycle and out-of-scope use, each naming the file, the field and the code.
- [ ] Design: Define the registry's public surface (build, resolve, list users of a code) so the other validators can share it.
- [ ] Approval: The owner has approved the design in a task comment, and the comment is quoted under Notes.
- [ ] Build, only after approval: Implement the registry as one small typed module in the manifest package.
- [ ] Build, only after approval: Add tests using deliberately broken seed trees for each error.
- [ ] Build, only after approval: `task validate` and the relevant checks pass, and every README and design link that mentions the changed files is updated.

## Notes

Record findings, rejected options and the approval here.

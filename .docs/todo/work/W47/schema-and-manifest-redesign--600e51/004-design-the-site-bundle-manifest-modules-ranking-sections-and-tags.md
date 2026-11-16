---
{id: TSK-0C7E435CA201,name: "Design the site bundle: manifest, modules, ranking, sections and tags",type: task,status: planned,priority: medium,created_at: 2026-11-16T13:05:53.958Z,updated_at: 2026-11-16T13:06:00.524Z,order: 4096,depends_on: [TSK-9A8E9A0A16B1]}
---

# Design the site bundle: manifest, modules, ranking, sections and tags

## Goal

Decide the smallest set of site files that tell the crawler where to look, what to extract and how to prioritise, and how a source authority reference resolves.

## Context

There are 8 site manifests (two real Kenya sites, one world source and fixtures), 9 modules and one ranking file. The sections and tags schemas have no active files. The workers task is blocked because `authority_ref` has nothing to resolve to, and the assessment and dossier tables are not in the current SQL. This task is part of the schema and manifest redesign group. Nothing in it is built until the owner has approved the design in a task comment, and the group goal and plan describe how the pieces fit together. Related material: `.docs/design/acquisition/SITE_STRUCTURE_SPEC.md`, `source/schema/README.md`, `seed/README.md` and `AGENTS.md`.

## Acceptance checklist

Work on a Build item starts only after the Approval item is ticked.

- [ ] Design: Write the field table for site manifest and module, marking what is policy, what is extraction and what is metadata.
- [ ] Design: Decide whether ranking and sections fold into the manifest or stay separate, and whether tags move to the reference vocabulary.
- [ ] Design: Define how `authority_ref` resolves to a site manifest and its assessment, and what the worker does when it does not resolve.
- [ ] Design: Define how the site policy relates to the robots and challenge rules in AGENTS.md.
- [ ] Approval: The owner has approved the design in a task comment, and the comment is quoted under Notes.
- [ ] Build, only after approval: Update the site schemas and the eight manifests to the approved design.
- [ ] Build, only after approval: Add the authority resolver as a typed port and reject unresolved references before any fetch.
- [ ] Build, only after approval: Add tests using the Kenya IEBC and world geoboundaries bundles.
- [ ] Build, only after approval: `task validate` and the relevant checks pass, and every README and design link that mentions the changed files is updated.

## Notes

Record findings, rejected options and the approval here.

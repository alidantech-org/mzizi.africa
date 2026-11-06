---
{id: GOAL-GRP-C8C47B23103B,name: Docs layout cleanup goal,type: documentation,extra: {created_at: 2026-11-02T04:43:33.460Z,group: GRP-C8C47B23103B}}
---

# Goal

Finish the documentation cleanup after the repository was consolidated under the `source/` folder, so that no document describes the old top-level `apps/` and `services/` layout.

## Why it matters

Agents read README, ARCHITECTURE and the READMEs under source/ to decide where code belongs. Diagrams showing paths that do not exist send them to the wrong place. Success means every diagram, link and path in the documentation matches the real layout, a final search for stale paths comes back clean, and `task validate` passes.

## Success measures

A repository-wide search for the old `apps/` and `services/` prefixes returns only legitimate matches, namely the documentation-expansion tree that names a folder of specification documents and the untouched historical audits. Every README under source/ names its own real path, and the mobile README links to the contract document that actually exists.

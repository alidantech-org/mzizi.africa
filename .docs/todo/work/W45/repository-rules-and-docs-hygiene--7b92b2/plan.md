---
{id: GRP-22E1D57B92B2,name: Repository rules and docs hygiene,type: documentation,extra: {created_at: 2026-11-02T04:38:48.238Z}}
---

# Plan

## Approach

Work happens directly on the `develop` branch in the main checkout, with no branches or worktrees. First write the branching and mandatory Task rules and link them from AGENTS.md, README.md and the guidance documents. Then correct stale references: documents that moved into `.docs/docs/`, the `.tasks` name that became `.docs`, and the `apps/` and `services/` folders that now live under `source/`. Finally add the missing YAML frontmatter so the workspace validates.

## Milestones

1. Rules written and linked from the entry documents.
2. Stale paths and Task group references corrected.
3. Frontmatter added and `task validate` passes.

## Risks

Architecture diagrams still show the old top-level layout and need a follow-up pass. Bulk path rewrites could touch historical audit text, so the diff must be reviewed before committing.

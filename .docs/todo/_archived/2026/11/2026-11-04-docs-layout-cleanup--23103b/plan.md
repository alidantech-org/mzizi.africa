---
{id: GRP-C8C47B23103B,name: Docs layout cleanup,type: documentation,extra: {created_at: 2026-11-02T04:43:33.460Z}}
---

# Plan

## Approach

Work directly on develop with no branches or worktrees. Search for stale path references, update the directory-tree diagrams in README.md and ARCHITECTURE.md, update the documentation-map diagrams in the docs README, and update the READMEs under source/ including the broken contract link in the mobile README. Track the work in a single detailed task.

## Milestones

1. Diagrams in the top-level documents corrected.
2. READMEs under source/ corrected.
3. Final grep for stale paths is clean and the workspace validates.

## Risks

The documentation expansion tree in the docs README legitimately names a services folder of specification documents; it must not be rewritten by mistake. Historical audit documents are left untouched.

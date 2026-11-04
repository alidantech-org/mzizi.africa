---
{id: GOAL-GRP-22E1D57B92B2,name: Repository rules and docs hygiene goal,type: documentation,extra: {created_at: 2026-11-02T04:38:48.238Z,group: GRP-22E1D57B92B2}}
---

# Goal

Establish the repository operating rules for every coding agent and contributor on Mzizi Africa, and keep the project documentation truthful after the repository was consolidated into the `source/` folder layout.

## Why it matters

Agents were creating their own branches and worktrees, and the documentation still referred to paths and workspaces that no longer exist. Both problems erode trust in the repository contract and make work hard to review. Success means agents only work on `develop`, every piece of work is planned and recorded through the Task CLI, and `task validate` passes with no stale path references in AGENTS.md, README.md or the .docs documents.

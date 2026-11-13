---
{id: GRP-FAA224D85481,name: Dryv authoring and enforcement for Reference,type: documentation,extra: {created_at: 2026-11-13T07:26:23.628Z}}
---

# Plan

The work is split into five tasks, executed strictly one at a time. After each task the agent stops and reports what changed so the owner can review it before the next starts. Verification stays light on purpose: formatting and type checks only, with full compile and generation checks reserved for the first task, which unblocks them, and for a final owner-driven run.

Order and rationale:
1. Unblock the compile path and settle how null comparisons are typed, because every later step needs a working check.
2. Partial indexes with a where clause, which also fixes unique codes on soft-deleted rows.
3. A constraint construct for overlapping windows and nullable-scope uniqueness.
4. Acyclic and same-scheme constraints, composite foreign keys and numeric precision.
5. Deferred relations for targets that do not exist yet, plus clean-up of the remaining comments.

Risks: the Dryv engine (Python) and the SQL pack must both change for each feature, and the Dryv repository already holds other uncommitted work. Each task therefore lists the exact files it will touch, keeps the IR change minimal, and records any engine limitation found instead of working around it silently. Later, optional work covers new expression nodes such as string functions and coalesce.

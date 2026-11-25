---
id: PLAN-NEW-MZIZI-DISCUSSION-REGISTER
name: New Mzizi — owner concerns and discussion register
type: planning-proposal
tags: [discussion, decisions, scope, review]
extra: {status: discussion_only, approval: not_approved, opened_on: 2026-11-23}
---

# Discussion register — agreements must be explicit

This is a **discussion trace**, not a parallel Task backlog or a new decision authority. Use the Task workspace for implementation work. Use the existing decision records for accepted architectural decisions. Revisit this document as the owner clarifies individual topics.

## Direct user requests recorded in this discussion

| Topic | What the owner asked for | State |
| --- | --- | --- |
| Database revisit | Reconsider the current database design rather than accept its complexity as inevitable | Requested; review underway |
| Geography performance | Investigate why Geo queries are becoming slow | Reported; no benchmark yet |
| Common queries | Investigate growing latency for frequently requested/cross-domain questions | Reported; no benchmark yet |
| Clear data flow | Explain and establish a comprehensible path from acquisition to accepted data | Requested; current paths documented |
| Dedicated documentation | Add Markdown topic files in `.docs/_plan/the-new-mzizi/` as discussion progresses | **Documentation authorized** |

## Established decisions to preserve unless the owner revises them

- The accepted single-PostgreSQL/Mongo-staging/S3 design: [decision](../../../decisions/DEC-SINGLE-POSTGRES-MONGO-STAGING-20261115.md).
- The owner-approved Source/Filesystem/Geography separation and evidence ownership: [ownership guide](../../../design/data/SOURCE_FILESYSTEM_GEOGRAPHY.md).
- One identity for a real-world geographic thing and separate territorial/governing/activity concerns, subject to checking the latest contracts.
- Authored contracts in Dryv, generated SQL rather than hand-edited generated tables; no new `.github/**` workflow without permission.
- Work on `develop`; `main` remains stable.

These are **pre-existing decisions**, not approvals created by this discussion.

## Observed in current code, not yet measured live

- Generated snapshot: 165 tables across 14 schemas.
- Explorer uses a recursive slug-based place CTE and a ten-minute process-local country-language registry.
- Map reads simplify and serialize PostGIS polygons and fetch latest population values.
- Some read paths repeat country lookup, hierarchy reconstruction or count queries.
- Geometry area from SRID 4326 is calculated with `ST_Area(geometry)`, which returns squared coordinate units rather than km².
- Seed loader and artifact-linked CSV provenance exist; a general reviewed candidate promotion/change ledger is incomplete.

See the topic documents for the exact file links and caveats.

## Assistant proposals awaiting owner discussion — none approved

| Proposal | Reason to consider | What evidence is needed first |
| --- | --- | --- |
| One understandable ingestion/promotion story for reviewed seed and acquired candidates | Preserve evidence, source, identity and approvals consistently | Trace an IEBC document all the way to the exact canonical table/write |
| Targeted country/place reads and bulk lookups | Avoid repeated full-tree work for simple queries | Cold/warm plans and query counts |
| Explicit performance-oriented query composition or projections | Serve common place/governance/finance/statistics questions efficiently | Query timings and freshness/update guarantees |
| Simplified geometry/tiles | Reduce expensive polygon serialization and client work | Geometry complexity, response sizes and render timings |
| Area-unit and boundary-point correctness review | Prevent wrong geographic measures and inconsistent point resolution | Representative polygon/point test cases |
| Revisit database permissions | Align intended canonical write ownership with SQL grants | Actual role/grant inventory |

## Questions to discuss next, in order

1. Follow **one original source** to its exact canonical output, including raw artifact, intermediate draft, review and citation.
2. Choose **one slow real query** and capture its input, SQL/call graph and measured plan.
3. Identify which geographic relationships represent routing, administrative containment, electoral containment or jurisdiction, and which should be queried together.
4. Decide whether to change a query, add a derived view or adjust canonical contracts. Record each explicit user decision before any implementation.
5. Extend the folder with **new topic documents only when a distinct discussion needs one**. Do not multiply near-duplicate design notes.

**Current authorization boundary:** writing and updating this planning folder only. No schema edits, migrations, index changes, seeds, runtime changes, deployment or background automation are approved by this register.

---
id: PLAN-SCHEMA-REDESIGN-CHECKBOOK
name: Schema redesign checkbook
type: plan
tags: [database, schemas, superseded]
extra: {status: superseded, superseded_on: 2026-11-12}
---

# Schema redesign checkbook — superseded

This planning note described the earlier Phase 01 candidate inventories. On 12 November 2026, the user accepted Reference's existing nine-table foundation and Geography's nine table names and responsibilities. Detailed fields and new Reference tables remain under review; current status is recorded in the owning documents:

- [Reference — Phase 01](mzizi-db/phase-01/reference.md)
- [Geography — Phase 01](mzizi-db/phase-01/geography.md)
- [Schema redesign catalogue](README.md)

The accepted Reference foundation is `countries`, `schemes`, `values`, `units`, `topics`, `patterns`, `pattern_versions`, `pattern_bindings` and `pattern_dependencies`. The accepted Geography inventory is `features`, `units`, `places`, `names`, `identifiers`, `geometries`, `relationships`, `changes` and `datasets`. The former Geography candidates `countries`, `boundaries` and `legal_bases` are not part of the accepted inventory. Reference owns modern country identities; Geography owns territory representations and cross-border or historical features need not have one country.

The remaining Main Phase 01 schemas continue to be reviewed individually. Operational approvals and Phase 02 deferrals are unchanged. This superseded checkbook is retained as planning history and must not be used as the current schema specification.

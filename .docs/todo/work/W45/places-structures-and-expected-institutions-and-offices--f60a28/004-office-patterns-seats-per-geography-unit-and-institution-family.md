---
{id: TSK-02CA35EA9ED1,name: "Pattern engine: scoped offices, units and expectations with legal cardinality",type: task,status: planned,priority: medium,created_at: 2026-11-02T20:59:36.185Z,updated_at: 2026-11-02T21:34:17.785Z,order: 4096,depends_on: [TSK-0FDD5A808362]}
---

# Pattern engine: scoped offices, units and expectations with legal cardinality

## Goal
Generate expected geographic offices, branches and placement expectations from patterns justified by law, with deterministic identities and idempotent updates.

## Context
Keep separate: reusable office definitions (in pattern JSON), geographically scoped office instances, election-specific contested seats, actual holders, expected placements and confirmed occupancy. Patterns state which records they generate, the subject family, the geography level, the cardinality rule, legal basis, effective period, exceptions and a version. Cardinality is never one per unit by assumption: county executive membership, nominated assembly seats and women's seats follow the law. Operational branches such as an NTSA regional office use unit patterns, not the parliamentary seat pattern. Stable codes (for example ke/county/047/governor) make regeneration idempotent; when a pattern version changes, rows no longer justified are marked superseded, never deleted. Existing holders (350 MPs, 67 senators) link to the generated instances. Totals are checked against geography (47, 290, 1,450). Patterns never produce coordinates, addresses, buildings or rooms; they produce only expectations.

## Acceptance checklist
- [ ] Define the pattern shape, deterministic identity and version handling, with a decision record.
- [ ] Generate county, constituency and ward offices with legal cardinality and link existing holders.
- [ ] Generate unit patterns and placement expectations for institution families.
- [ ] Check totals against geography and report mismatches.
- [ ] Test idempotency and the effect of a changed pattern on earlier rows.

---
{id: GOAL-GRP-D6BCF80A06C4,name: "Dryv foundations: slugs, typed sections and manifest goal",type: documentation,extra: {created_at: 2026-11-18T20:41:21.179Z,group: GRP-D6BCF80A06C4}}
---

# Goal

Implement the first foundations of contract-first frontends in Dryv and the Mzizi contracts, following the agreed design documents: the slug registry in the source schema, typed sections replacing the dynamic response fields, and a committed generation manifest with gates. Success is measured by generated output that matches the contracts, a passing verify gate across every app, no dynamic fields in the converted documents, and each generated file traceable to its contract source.

The group builds on the design group and the decision DEC-CONTRACT-FIRST-FRONTENDS-20261118. It changes contracts and generated code, so each step is checked with the Dryv typecheck, doctor, compile and verify commands before anything is committed, and the Dryv repository is changed only when a test shows a real gap.

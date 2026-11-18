---
{id: TSK-0A9E5ED02AFE,name: "Phase B: author the API contract, response shapes and queries",type: task,status: planned,priority: medium,created_at: 2026-11-18T22:29:03.503Z,updated_at: 2026-11-18T22:29:03.503Z,order: 2048}
---

# Phase B: author the API contract, response shapes and queries

## Goal

Author in the contracts every composed read, typed response section and data-driven query the web screens need, so no screen assembles endpoints and no section is dynamic. It follows the delivery plan backend-web-dev-delivery-plan and the decisions recorded with it, and it runs autonomously, ending at its gates with a commit and a push.

## Context

Read the delivery plan, the design documents in .docs/design, the feature register and the Dryv plan note. The Dryv repository holds uncommitted owner changes that are never committed or reverted. Seed additions follow the seed rules and invented data is tagged dev.

## Acceptance checklist

- [ ] Replace every dynamic section with typed schemas and unions.
- [ ] Author composed reads per screen from the address map, including context, slug resolution, copy delivery, preferences and interactions with the mobile-only write rule.
- [ ] Author the generic metric engine over statistics.metrics and list every hand query as a recorded Dryv gap.
- [ ] Contracts typecheck, doctor and compile and no dynamic field remains.

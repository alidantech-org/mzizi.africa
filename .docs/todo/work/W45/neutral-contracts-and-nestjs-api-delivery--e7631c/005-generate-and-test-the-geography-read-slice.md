---
{id: TSK-D3CB7D9CC4B2,name: Generate and test the geography read slice,type: task,status: planned,priority: medium,created_at: 2026-11-02T04:56:58.525Z,updated_at: 2026-11-02T04:58:11.814Z,order: 5120,due_at: 2026-11-02}
---

# Generate and test the geography read slice

## Goal

Generate the NestJS geography module from the Dryv packs and prove it serves the mobile geography contract from a read-only role.

## Context

Builds on the geography contracts and the scaffold. Only service implementations are hand-written; controllers, DTOs and entities come from Dryv. The existing Python endpoints /units, /levels, /hierarchy and /v1/geography/* define expected behaviour, and .docs/docs/geography-api-contract.md defines the contract. Read .docs/handoffs/neutral-model-and-nestjs-api-handoff.md, .docs/decisions/nestjs-api-and-dryv-placement.md and .docs/docs/audits/LEGACY_MODEL_INVENTORY.md before starting. Keep work on develop, track it through the Task CLI and update the matching .docs files in the same change.

## Acceptance checklist

- [ ] Generate controllers, DTOs and TypeORM entities into the NestJS app from the geography contracts.
- [ ] Hand-write the service layer for search, hierarchy, boundaries and map context.
- [ ] Add integration tests against a PostgreSQL test database with PostGIS or the chosen geometry approach.
- [ ] Verify the API connects with the read-only role and cannot write.
- [ ] Compare responses with the Python service for a sample of units and record differences.

---
{id: TSK-9EEB47279B23,name: Deliver the first NestJS geography read API slice,type: task,status: planned,priority: high,created_at: 2026-11-01T00:36:41.276Z,updated_at: 2026-11-01T05:36:17.450Z,tags: [api,nestjs,geography],depends_on: [TSK-39C88A553155],extra: {description: Implement a minimal approved geography read slice in the target NestJS API using canonical data access and the documented mobile geography contract. Do not deepen the legacy FastAPI service as the long-term product API.,acceptance_criteria: [Search and entity resolution return stable canonical IDs and explicit hierarchy.,Boundary endpoints publish only verified geometry with attribution metadata.,"Governance absence, invalid IDs, and transient failures have documented HTTP behavior.","API-level contract tests cover success, empty, and failure paths."]},due_at: 2026-11-01}
---

# Deliver the first NestJS geography read API slice

## Summary

Implement a narrow target NestJS geography read slice backed by approved canonical data and consistent with the mobile contract.

## Acceptance criteria

- [ ] Search and entity resolution return stable IDs and explicit parent relationships.
- [ ] Only verified geometry is returned and carries source/license metadata.
- [ ] Empty, missing, unauthorized, and transient-failure behavior is covered by contract tests.

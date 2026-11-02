---
{id: TSK-EFD9E84630E1,name: Specify versioned NestJS API contracts for geography and evidence,type: task,status: planned,priority: high,created_at: 2026-11-01T00:36:41.096Z,updated_at: 2026-11-01T05:35:14.963Z,tags: [api,nestjs,contracts],depends_on: [TSK-39C88A553155],extra: {description: "Define the target product API boundary and versioned DTOs for geography, source provenance, evidence links, validity time, verification, pagination, and error responses. Keep extraction, AI, migration/seeding, and file custody in their target owners.",acceptance_criteria: [Contract documents name endpoint ownership and stable canonical IDs.,"DTOs preserve source, license, retrieval time, reference year, validity, and verification metadata.","Contract review records auth, pagination, compatibility, and error semantics."]},due_at: 2026-11-05}
---

# Specify versioned NestJS API contracts for geography and evidence

## Summary

Define target NestJS product API boundaries and versioned DTOs, starting with geography and source/evidence metadata.

## Acceptance criteria

- [ ] DTOs preserve canonical IDs, explicit hierarchy, provenance, verification, reference year, and validity time.
- [ ] Document auth, pagination, compatibility, and standard error behavior.
- [ ] Contracts distinguish product API work from extraction, AI, files, and database lifecycle.

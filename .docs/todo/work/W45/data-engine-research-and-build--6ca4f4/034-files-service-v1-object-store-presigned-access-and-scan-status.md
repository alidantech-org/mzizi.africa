---
{id: TSK-D4FF6DDE34B7,name: "Files service v1: object store, presigned access and scan status",type: task,status: planned,priority: medium,created_at: 2026-11-02T09:55:59.503Z,updated_at: 2026-11-02T09:55:59.503Z,due_at: 2027-01-29,order: 34816}
---

# Files service v1: object store, presigned access and scan status

## Goal
Replace the local directory interface with the real files service for production.

## Context
The data engine writes the filesystem schema through a local directory store. Production needs an S3-compatible store, presigned upload and download, scan status handling, retention and legal hold, and a purge job. The interface used by the engines must not change. Read .docs/docs/DATA_INTAKE_PLAN.md, .docs/docs/DATA_ENGINE_STATUS_AND_GAPS.md and .docs/docs/LEGALITY_SAFETY_AND_COMPLIANCE.md first. Work only on develop, record progress in this file and tick items with task check.

## Acceptance checklist
- [ ] S3-compatible store implementation behind the existing put, get and ref interface.
- [ ] Presigned upload and download endpoints with expiry.
- [ ] Scan status workflow; downloads refuse unscanned or infected objects.
- [ ] Retention, legal hold and purge job.
- [ ] Migration of local objects.

## Notes
Until this exists, evidence lives in a local directory on the development machine and nothing is published. Keep checksums verifiable end to end so a migrated object can be proven identical to the original capture.

---
{id: TSK-76DD5D22DDB8,name: "Phase C: regenerate and finish the API",type: task,status: planned,priority: medium,created_at: 2026-11-18T22:29:03.905Z,updated_at: 2026-11-18T22:29:03.905Z,order: 3072}
---

# Phase C: regenerate and finish the API

## Goal

Regenerate the API, engine models and SDKs, migrate the hand-written reads, and prove every operation against the seeded database. It follows the delivery plan backend-web-dev-delivery-plan and the decisions recorded with it, and it runs autonomously, ending at its gates with a commit and a push.

## Context

Read the delivery plan, the design documents in .docs/design, the feature register and the Dryv plan note. The Dryv repository holds uncommitted owner changes that are never committed or reverted. Seed additions follow the seed rules and invented data is tagged dev.

## Notes

This task is part of the autonomous delivery programme. Its output must be reproducible from the contracts by regeneration alone, every deviation from the plan is recorded in the handoff with the reason, and any step that cannot be verified on this machine is reported as unverified instead of being claimed. The previous phase must be green before this one starts, except where the plan says otherwise.

## Acceptance checklist

- [ ] Regenerate with post-generation actions on apply and no hand edits in managed files.
- [ ] Migrate or replace every hand-written read that queries a removed schema and delete stale generated files.
- [ ] API typecheck and tests pass and every operation is exercised against mzizi_ux.
- [ ] Export the generation manifest and run dryv:verify for every app.

---
{id: TSK-684184122E8C,name: "Phase G: the Flutter app (after the web app is verified)",type: task,status: archived,priority: medium,created_at: 2026-11-18T22:29:05.749Z,updated_at: 2026-11-24T19:24:41.315Z,depends_on: [TSK-0CE2BE62D0CC],order: 7168,extra: {status_history: [{from: blocked,to: archived,at: 2026-11-24T19:24:41.315Z}]},archived_at: 2026-11-24T19:25:20.163Z}
---

# Phase G: the Flutter app (after the web app is verified)

## Goal

Regenerate the Flutter app from the same views, providers and repositories once the web app is complete and verified, and remove the hand-written duplicates. It follows the delivery plan backend-web-dev-delivery-plan and the decisions recorded with it, and it runs autonomously, ending at its gates with a commit and a push.

## Context

Read the delivery plan, the design documents in .docs/design, the feature register and the Dryv plan note. The Dryv repository holds uncommitted owner changes that are never committed or reverted. Seed additions follow the seed rules and invented data is tagged dev.

## Notes

This task is part of the autonomous delivery programme. Its output must be reproducible from the contracts by regeneration alone, every deviation from the plan is recorded in the handoff with the reason, and any step that cannot be verified on this machine is reported as unverified instead of being claimed. The previous phase must be green before this one starts, except where the plan says otherwise.

## Acceptance checklist

- [ ] Wait for phase E to be verified.
- [ ] Regenerate the app, replace singleton stores with generated providers, copy and theme.
- [ ] Analyze clean and run on a device or emulator.

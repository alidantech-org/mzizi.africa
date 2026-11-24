---
{id: TSK-516D56F78018,name: "Phase F: the dev app",type: task,status: archived,priority: medium,created_at: 2026-11-18T22:29:05.295Z,updated_at: 2026-11-24T19:24:34.266Z,order: 6144,extra: {status_history: [{from: planned,to: archived,at: 2026-11-24T19:24:34.266Z}]},archived_at: 2026-11-24T19:25:20.163Z}
---

# Phase F: the dev app

## Goal

Switch the dev app to the generated server-only engine SDK and remove client fetches and bad hard-coding, with no other UI change. It follows the delivery plan backend-web-dev-delivery-plan and the decisions recorded with it, and it runs autonomously, ending at its gates with a commit and a push.

## Context

Read the delivery plan, the design documents in .docs/design, the feature register and the Dryv plan note. The Dryv repository holds uncommitted owner changes that are never committed or reverted. Seed additions follow the seed rules and invented data is tagged dev.

## Notes

This task is part of the autonomous delivery programme. Its output must be reproducible from the contracts by regeneration alone, every deviation from the plan is recorded in the handoff with the reason, and any step that cannot be verified on this machine is reported as unverified instead of being claimed. The previous phase must be green before this one starts, except where the plan says otherwise.

## Acceptance checklist

- [ ] Replace the proxy route and hand fetches with the generated engine SDK.
- [ ] Remove use client pages that fetch and hard-coded values only.
- [ ] Typecheck and build pass and the portal pages load against the engine.

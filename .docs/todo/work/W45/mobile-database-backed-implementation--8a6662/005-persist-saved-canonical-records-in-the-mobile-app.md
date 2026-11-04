---
{id: TSK-2919C7C8CE49,name: Persist saved canonical records in the mobile app,type: task,status: planned,priority: medium,created_at: 2026-11-02T21:15:42.409Z,updated_at: 2026-11-02T21:15:49.974Z,order: 5120,depends_on: [TSK-B245174A4FD4]}
---

# Persist saved canonical records in the mobile app

## Goal

Let mobile users keep a durable library of Mzizi records and return to the same canonical detail after the app closes. Saved state should reference records by stable API IDs, not preserve a disconnected copy of facts as if that copy were canonical.

## Context

`SavedLibrary` currently holds entries in a process-local map, and `SavedScreen` filters a small set of fixed content categories. The planned geography, event and finance detail views will provide stable IDs and record types for saved items. Implement after the first API-backed detail routes are in place. Keep the library device-local for this slice; account sync requires a separate identity and privacy decision.

## Acceptance checklist

- [ ] Define a versioned local saved-item record containing canonical ID, domain/type, saved time and optional display snapshot version.
- [ ] Persist and restore saved IDs across app restarts without persisting credentials or private API payloads.
- [ ] Replace hard-coded categories with categories derived from actual saved item types and support remove/search/empty states.
- [ ] Reopen the canonical detail route and show a useful unavailable/stale state when the record cannot be fetched.
- [ ] Document cache freshness and offline behavior for saved items.

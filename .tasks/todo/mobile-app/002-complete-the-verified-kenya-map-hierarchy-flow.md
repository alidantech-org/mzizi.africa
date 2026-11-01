---
{id: TSK-471C902B718F,name: Complete the verified Kenya map hierarchy flow,type: task,status: planned,priority: high,created_at: 2026-11-01T00:36:49.584Z,updated_at: 2026-11-01T05:36:50.835Z,tags: [mobile,map,geography],depends_on: [TSK-9EEB47279B23],extra: {description: "Finish the home map flow using the geography API contract: verified county selection, immediate child boundaries for constituency navigation, canonical-ID selection, explicit parent navigation, and source/license attribution.",acceptance_criteria: [County collection is rejected if IDs or verified flags are missing.,Child selection uses stable canonical IDs and backend hierarchy labels.,Unverified or missing geometry is never substituted or highlighted.,"Map context, loading, empty, and retry states are usable."]},due_at: 2026-11-03}
---

# Complete the verified Kenya map hierarchy flow

## Summary

Complete verified Kenyan county selection and navigation to backend-provided immediate child boundaries.

## Acceptance criteria

- [ ] County features require stable IDs and verified status.
- [ ] Child selection, breadcrumbs, and parent navigation use canonical IDs and backend hierarchy.
- [ ] Missing or unverified geometry is never substituted or highlighted.
- [ ] Source/license attribution and loading, empty, and retry states are visible.

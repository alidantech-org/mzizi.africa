---
{id: GOAL-GRP-56FB9A8A6662,name: Mobile database-backed implementation goal,type: documentation,extra: {created_at: 2026-11-02T21:15:38.251Z,group: GRP-56FB9A8A6662}}
---

# Implement the database-backed mobile experience

## Goal

Deliver a public Flutter experience that uses approved canonical Mzizi data through NestJS read contracts. Mobile users should be able to explore a place, inspect its geography and governance, follow sourced events through time, and review public finance/procurement records with evidence. The project succeeds when screen content comes from stable API record IDs, source and time context are visible, and the app represents missing or restricted data honestly.

## Scope and constraints

This group covers the Flutter client, its versioned API contracts where needed, and the read-only verification needed to select safe datasets. It does not move migrations, extraction, AI review, canonical truth, file custody or private data into the app. Start with a readiness gate and small vertical slices. The real database inventory last recorded in the handoff must be confirmed because database access was unavailable in the previous session.

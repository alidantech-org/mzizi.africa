---
{id: GOAL-GRP-FBFFB0FF973E,name: Database-backed mobile experience goal,type: documentation,extra: {created_at: 2026-11-02T21:01:49.562Z,group: GRP-FBFFB0FF973E}}
---

# Database-backed mobile experience

## Goal

Make the Mzizi Africa Flutter application a useful public window into approved canonical knowledge already held in Mzizi. Mobile users should be able to start from a place, explore its present and history, understand connected institutions and public resources, and inspect the evidence supporting each published record. The app will consume versioned NestJS contracts and must never become a direct database client or the place where canonical data rules live.

## Success measures

The Home, Explore, History and Money journeys show API-backed records with stable IDs and meaningful place/time context; source and verification details are reachable from every factual view; Saved items survive app restarts; and unpopulated or unverified data is represented honestly. Delivery is gated by read-only inventory of actual public-ready data and confirmation of API response support. Data such as supplier identifiers, contact fields, unreviewed candidates and restricted artifacts must not leak into the public client.

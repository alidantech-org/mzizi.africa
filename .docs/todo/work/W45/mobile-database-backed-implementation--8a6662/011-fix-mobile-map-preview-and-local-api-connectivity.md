---
{id: TSK-1CBC54CCED4A,name: Fix mobile map preview and local API connectivity,type: task,status: completed,priority: high,created_at: 2026-11-02T22:04:42.820Z,updated_at: 2026-11-02T22:05:37.729Z,tags: [mobile,geography,api],order: 11264,extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-02T22:04:44.891Z},{from: in-progress,to: completed,at: 2026-11-02T22:05:37.729Z}]}}
---

## Goal

Make the mobile map experience match the flat county map design on both Home and Explore, and make local browser/API connection failures understandable and recoverable.

## Context

A user screenshot shows Home still embedding the old Cesium globe, with a `ClientFailed to fetch` message for `http://127.0.0.1:3000/v1/geography/boundaries?country=KE&level=county`. The separate Explore map is already a Flutter polygon renderer backed by verified geography records. The API is not listening on port 3000 in this environment. Do not invent or bundle county shapes to conceal missing database/API connectivity. Ensure the NestJS API supports configured browser origins for Flutter Web, while keeping origins explicit and documented. Improve the map error state so it explains the local API requirement and offers Retry.

## Acceptance checklist

- [x] Replace the Home globe preview with the same flat database-backed county map used by Explore.
- [x] Keep Home and Explore map entry points tappable and county selection connected to canonical records.
- [x] Configure NestJS CORS from an explicit environment allowlist suitable for Flutter Web and document local setup.
- [x] Display actionable API connection guidance and Retry instead of raw fetch exceptions or a black globe.
- [x] Preserve verified boundary/provenance requirements and never use fake fallback geometry.
- [x] Format and statically analyze changed Flutter files; validate API formatting/typecheck as feasible and run Task workspace validation.

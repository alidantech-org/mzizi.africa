---
{id: TSK-8D646F2132AE,name: Build data-led mobile experience from design reference,type: task,status: completed,priority: medium,created_at: 2026-11-02T21:45:44.568Z,updated_at: 2026-11-02T21:47:58.860Z,order: 8192,extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-02T21:45:46.246Z},{from: in-progress,to: completed,at: 2026-11-02T21:47:58.860Z}]}}
---

# Build the data-led mobile experience from the Mzizi reference

## Goal

Reshape the current Flutter app around the supplied Mzizi mobile reference while retaining the repository's evidence-first rules. The result should have a clearer Home overview, practical navigation to Explore, public finance, History and Saved, and responsive layouts that feel coherent on a phone. Visible domain content must come from the NestJS API or the canonical database through it. Reference-only example totals, county populations, official names, imagery and claims must not become bundled facts.

## Context

The supplied reference presents onboarding, Kenya overview, search and browse, county profiles, public money, institution profiles and saved items in a warm editorial visual style. The existing app already has five bottom tabs and a warm theme. Explore uses the geography API for search, stored boundary geometry and governance records; History fetches events; Money fetches fiscal years and budgets. The Home screen still contains extensive sample copy and fixed claims, so it should become a live overview using returned Mzizi records and a verified map layer. The API/database are currently unavailable in this environment, so loading, retry, empty and offline behavior must be clear and no screen may disguise missing data with design samples. Implement only routes supported by current app/API contracts and record unsupported data sections as follow-up work.

## Acceptance checklist

- [x] Rework Home into the reference's warm Mzizi hierarchy with clear search, geography/map, finance, history and saved entry points.
- [x] Populate Home event and finance previews only from live API responses, with loading, retry, empty and offline states; keep the map on verified database geometry.
- [x] Remove the old Home filters, totals and example records that imply unsupported live database facts.
- [x] Align navigation labels and content framing with the reference while preserving access to existing Explore, History, Money and Saved functionality.
- [x] Add save/unsave actions for API-backed event and budget records, showing canonical record identity in Saved.
- [x] Format changed Dart files, run `task validate`, and record API/database runtime verification as unavailable when services are offline.

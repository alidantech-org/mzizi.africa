---
{id: TSK-C1DB8E0167CD,name: Connect mobile UI to canonical Mzizi records,type: task,status: completed,priority: medium,created_at: 2026-11-02T21:32:03.744Z,updated_at: 2026-11-02T21:34:01.674Z,order: 6144,extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-02T21:32:05.263Z},{from: in-progress,to: completed,at: 2026-11-02T21:34:01.674Z}]}}
---

# Connect the mobile UI to canonical Mzizi records

## Goal

Make the Flutter mobile app use Mzizi's maintained NestJS read API for visible domain data, and ensure the map displays only database-backed, verified boundary geometry. Correct configuration guidance so developers point the app at the actual API. Replace fabricated or static History and Money content where the existing public API contracts support real reads, with explicit loading, retry, empty and error states so unavailable data is never mistaken for canonical knowledge.

## Context

The current app config guide points at port 8000, the legacy Python service, while `source/backend/api/README.md` documents NestJS on port 3000. The geography client already reads versioned geography endpoints and the globe renders boundary features returned by that client; it does not provide an offline substitute. The History screen embeds a timeline with descriptive claims and the Money screen contains fixed amounts and fiscal-year options. The NestJS events and finance read DTOs expose paginated public records, but no API process/database is currently reachable in this workspace. Therefore implementation can wire existing contracts and show safe empty/error states, but must not claim live records or invent source joins. Read `.docs/docs/MOBILE_DATA_DISPLAY_PLAN.md` and keep PostgreSQL access server-side.

## Acceptance checklist

- [x] Correct mobile local setup instructions to use the NestJS API port and platform-specific host addresses.
- [x] Add a shared mobile read client using the configured API origin and safe HTTP/JSON error handling for events and finance reads.
- [x] Replace the hard-coded History timeline with public API events, search/pagination behavior as supported by current UI, and loading/retry/empty/error states; preserve event date/status fields without inventing citations.
- [x] Replace fixed Money fiscal-year and budget claims with API-returned fiscal periods and budget records, showing exact amount, currency, kind and period only when returned.
- [x] Keep map geometry sourced from the geography API and surface connection/empty verified-boundary states without drawing bundled geography.
- [x] Format changed Dart code and run `task validate`; do not claim runtime/API verification while the API/database is unavailable.

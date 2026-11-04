---
{id: TSK-087A648C5F7F,name: Replace the mobile History sample timeline with sourced Mzizi events,type: task,status: planned,priority: high,created_at: 2026-11-02T21:15:41.824Z,updated_at: 2026-11-02T21:15:49.507Z,order: 3072,depends_on: [TSK-7C92F20B477C]}
---

# Replace the mobile History sample timeline with sourced Mzizi events

## Goal

Turn the History tab into a real place-aware timeline using canonical Mzizi events and geography history. Users should be able to follow changes through time and inspect the records and sources behind each item, with approximate dates and disputes presented honestly.

## Context

`HistoryScreen` currently embeds a static list of Kenya events and descriptive source labels. The NestJS API has events and geography history routes, and the mobile geography model already carries canonical place IDs. Actual event counts, location links, evidence joins and public DTO shape still need confirmation by the data-readiness task. Do not add bundled fallback claims or filter all events locally. Keep event time separate from source capture time and leave this task gated until a suitable place-timeline query is confirmed.

## Acceptance checklist

- [ ] Confirm public-ready event/history records and API query support for filtering by canonical place ID and time.
- [ ] Define/adjust typed mobile DTOs for event date precision, place/entity links, evidence summaries and verification/dispute state.
- [ ] Replace static timeline rows with paginated API-backed records, loading/retry/empty states and selected-place context.
- [ ] Add an event detail view linking related places/entities and opening source evidence.
- [ ] Remove unsupported hard-coded claims and verify unknown or approximate dates remain explicit.

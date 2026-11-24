---
{id: TSK-2063A0FD67FD,name: Settle grouped URL state and contextual navigation before implementation,type: task,status: archived,priority: medium,created_at: 2026-11-19T11:46:49.874Z,updated_at: 2026-11-24T19:13:22.608Z,order: 2048,extra: {readiness: ready,implementation_authorized: true,status_history: [{from: planned,to: in-progress,at: 2026-11-19T13:16:02.311Z},{from: in-progress,to: archived,at: 2026-11-24T19:13:22.608Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-2063A0FD67FD/1795094162313-start,started_at: 2026-11-19T13:16:03.729Z,end_ref: refs/tracking/TSK-2063A0FD67FD/1795547602613-end,ended_at: 2026-11-24T19:13:22.608Z,summary: {files: 1871,insertions: 40177,deletions: 21479}}]}},archived_at: 2026-11-24T19:23:21.131Z}
---

# Settle grouped URL state and contextual navigation before implementation

## Goal

Specify predictable grouped URL state and desktop/mobile navigation. Distinguish geographic ancestry, product subsections and record relationships. Keep the selected place visible while moving between subjects, opening records and following evidence. Preserve the approved distinction between explicit language links and cookie-only language preferences.

## Context

This is planning work in the geographic explorer task group, which remains IMPLEMENTATION AUTHORIZED. The owner chose a single site with explicit country prefixes such as /ke and /ug. Country subdomains are excluded from the initial scope. The owner also approved optional lang selection, cookie persistence and a language-in-sharing toggle, without language path prefixes or translated place slugs. These are agreed product behaviours; technical implementation has not yet been documented or approved. Preserve unrelated work and update these same task records as discussion continues. No application changes, generation or deployment follow from completing this documentation update.

## Acceptance checklist

- [ ] Define view, view.tab, view.entity, view.id and related selections with unambiguous record meanings.
- [ ] Define filters.*, sort.*, page.* and display.* responsibilities, defaults, invalid combinations and independent result lists.
- [ ] Specify sidebar selection, geographic/content breadcrumbs, mobile navigation, Back/Forward and detail return behaviour.
- [ ] Settle place switching with open records, applicability labels and empty/error states; preserve optional explicit lang without forcing it onto cookie-only journeys.

## Readiness

Product direction is agreed, but this task remains planned and authorized for implementation. Further discussion will refine its acceptance criteria. Technical implementation details are intentionally deferred.

## MUST-FIX consolidation

Include MUST-FIX sidebar/place-switcher layout, richer place overview, hard-coded levels/topics, copy gaps and client-only selection behaviour. Navigation is contract-owned; do not maintain a second handwritten sidebar plan.

## Implementation authorization

The owner explicitly requested implementation of the integrated database, API and web redesign on 19 November 2026. That request supersedes earlier planning-only gates in this record. Implement web only, with realistic labelled synthetic development fixtures, contract-generated screen reads and clients/types. Engine operations, the dev frontend, Flutter and real-data acquisition are excluded. The accepted plan in this conversation is authoritative where older task prose conflicts. Seed-file approval rules remain in force.

## Comments

### 2026-11-19T13:16:09.912Z · PETER IRUNGU

Implemented contract-generated grouped address parsing, serialization, per-view accepted fields and entity kinds, navigation order/grouping, place and subject transitions, and list transitions that reset page number. Thirteen web tests pass. Browser verified ex-officio position navigation, retained country prefix, canonical identity parameters, and exactly one active sidebar item. Nested subsection value validation and the full legacy destination migration remain unfinished.

---
{id: TSK-2063A0FD67FD,name: Settle grouped URL state and contextual navigation before implementation,type: task,status: planned,priority: medium,created_at: 2026-11-19T11:46:49.874Z,updated_at: 2026-11-19T11:46:49.874Z,order: 2048,extra: {readiness: not_ready,implementation_authorized: false}}
---

# Settle grouped URL state and contextual navigation before implementation

## Goal

Specify predictable grouped URL state and desktop/mobile navigation. Distinguish geographic ancestry, product subsections and record relationships. Keep the selected place visible while moving between subjects, opening records and following evidence. Preserve the approved distinction between explicit language links and cookie-only language preferences.

## Context

This is planning work in the geographic explorer task group, which remains NOT READY FOR IMPLEMENTATION. The owner chose a single site with explicit country prefixes such as /ke and /ug. Country subdomains are excluded from the initial scope. The owner also approved optional lang selection, cookie persistence and a language-in-sharing toggle, without language path prefixes or translated place slugs. These are agreed product behaviours; technical implementation has not yet been documented or approved. Preserve unrelated work and update these same task records as discussion continues. No application changes, generation or deployment follow from completing this documentation update.

## Acceptance checklist

- [ ] Define view, view.tab, view.entity, view.id and related selections with unambiguous record meanings.
- [ ] Define filters.*, sort.*, page.* and display.* responsibilities, defaults, invalid combinations and independent result lists.
- [ ] Specify sidebar selection, geographic/content breadcrumbs, mobile navigation, Back/Forward and detail return behaviour.
- [ ] Settle place switching with open records, applicability labels and empty/error states; preserve optional explicit lang without forcing it onto cookie-only journeys.

## Readiness

Product direction is agreed, but this task remains planned and not ready for implementation. Further discussion will refine its acceptance criteria. Technical implementation details are intentionally deferred.

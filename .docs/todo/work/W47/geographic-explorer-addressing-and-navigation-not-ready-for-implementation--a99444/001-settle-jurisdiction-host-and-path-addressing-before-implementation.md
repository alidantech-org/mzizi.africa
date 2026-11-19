---
{id: TSK-83C1E896E4C8,name: Settle country-prefixed place addresses before implementation,type: task,status: planned,priority: medium,created_at: 2026-11-19T11:46:49.448Z,updated_at: 2026-11-19T11:59:23.278Z,order: 1024,extra: {readiness: not_ready,implementation_authorized: false}}
---

# Settle country-prefixed place addresses before implementation

## Goal

Define the single-site country and place address experience. Every geographic explorer destination uses an explicit country prefix, followed by the selected place hierarchy. Establish entry, switching and invalid-address behaviour so neither saved preferences nor detection can silently override a shared place URL.

## Context

This is planning work in the geographic explorer task group, which remains NOT READY FOR IMPLEMENTATION. The owner chose a single site with explicit country prefixes such as /ke and /ug. Country subdomains are excluded from the initial scope. The owner also approved optional lang selection, cookie persistence and a language-in-sharing toggle, without language path prefixes or translated place slugs. These are agreed product behaviours; technical implementation has not yet been documented or approved. Preserve unrelated work and update these same task records as discussion continues. No application changes, generation or deployment follow from completing this documentation update.

## Acceptance checklist

- [ ] Specify /ke, /ug and variable-depth place paths on the single public site and local development site.
- [ ] Decide the neutral root entry journey, reserved routes, global utility-page exceptions and unknown country/place responses.
- [ ] Specify country switching and the preservation of compatible view state, including optional explicit lang.
- [ ] Map previous place addresses to country-prefixed destinations without adding subdomains or language prefixes.

## Readiness

Product direction is agreed, but this task remains planned and not ready for implementation. Further discussion will refine its acceptance criteria. Technical implementation details are intentionally deferred.

---
{id: TSK-83C1E896E4C8,name: Settle country-prefixed place addresses before implementation,type: task,status: in-progress,priority: medium,created_at: 2026-11-19T11:46:49.448Z,updated_at: 2026-11-19T13:16:00.059Z,order: 1024,extra: {readiness: ready,implementation_authorized: true,status_history: [{from: planned,to: in-progress,at: 2026-11-19T13:16:00.059Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-83C1E896E4C8/1795094160062-start,started_at: 2026-11-19T13:16:01.748Z}]}}}
---

# Settle country-prefixed place addresses before implementation

## Goal

Define the single-site country and place address experience. Every geographic explorer destination uses an explicit country prefix, followed by the selected place hierarchy. Establish entry, switching and invalid-address behaviour so neither saved preferences nor detection can silently override a shared place URL.

## Context

This is planning work in the geographic explorer task group, which remains IMPLEMENTATION AUTHORIZED. The owner chose a single site with explicit country prefixes such as /ke and /ug. Country subdomains are excluded from the initial scope. The owner also approved optional lang selection, cookie persistence and a language-in-sharing toggle, without language path prefixes or translated place slugs. These are agreed product behaviours; technical implementation has not yet been documented or approved. Preserve unrelated work and update these same task records as discussion continues. No application changes, generation or deployment follow from completing this documentation update.

## Acceptance checklist

- [ ] Specify /ke, /ug and variable-depth place paths on the single public site and local development site.
- [ ] Decide the neutral root entry journey, reserved routes, global utility-page exceptions and unknown country/place responses.
- [ ] Specify country switching and the preservation of compatible view state, including optional explicit lang.
- [ ] Map previous place addresses to country-prefixed destinations without adding subdomains or language prefixes.

## Readiness

Product direction is agreed, but this task remains planned and authorized for implementation. Further discussion will refine its acceptance criteria. Technical implementation details are intentionally deferred.

## MUST-FIX consolidation

Include MUST-FIX section 1 route, slug, sitemap and redirect regressions in the same address migration. Older hierarchy text is historical where it conflicts with the owner-approved country-prefix and grouped-query direction.

## Implementation authorization

The owner explicitly requested implementation of the integrated database, API and web redesign on 19 November 2026. That request supersedes earlier planning-only gates in this record. Implement web only, with realistic labelled synthetic development fixtures, contract-generated screen reads and clients/types. Engine operations, the dev frontend, Flutter and real-data acquisition are excluded. The accepted plan in this conversation is authoritative where older task prose conflicts. Seed-file approval rules remain in force.

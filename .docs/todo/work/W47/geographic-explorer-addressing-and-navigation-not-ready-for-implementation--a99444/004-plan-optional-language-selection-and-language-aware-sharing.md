---
{id: TSK-F411B380B819,name: Plan optional language selection and language-aware sharing,type: task,status: in-progress,priority: medium,created_at: 2026-11-19T11:59:23.716Z,updated_at: 2026-11-19T13:16:06.151Z,order: 4096,extra: {readiness: ready,implementation_authorized: true,status_history: [{from: planned,to: in-progress,at: 2026-11-19T13:16:06.151Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-F411B380B819/1795094166152-start,started_at: 2026-11-19T13:16:07.593Z}]}}}
---

# Plan optional language selection and language-aware sharing

## Goal

Record and finish the language experience for the geographic explorer without requiring language in every URL. Visitors should normally use their saved preference, while shared links may explicitly select a supported language. Language must remain independent of country and geographic identity.

## Context

This is planning work in the geographic explorer task group, which remains IMPLEMENTATION AUTHORIZED. The owner chose a single site with explicit country prefixes such as /ke and /ug. Country subdomains are excluded from the initial scope. The owner also approved optional lang selection, cookie persistence and a language-in-sharing toggle, without language path prefixes or translated place slugs. These are agreed product behaviours; technical implementation has not yet been documented or approved. Preserve unrelated work and update these same task records as discussion continues. No application changes, generation or deployment follow from completing this documentation update.

## Agreed behaviour

A valid supported lang query parameter overrides the language cookie, saves the preference and remains visible in the URL. Without lang, use the cookie and configured fallback. The language selector updates an existing lang parameter but does not add one when absent. Preserve place, view, selected record and compatible filters. Sharing offers Include selected language, initially on: on includes effective language, off removes lang from the generated share link. Sharing does not change the current URL or cookie. Use supported BCP 47 tags, including sw and en. Unsupported languages are not saved as supported choices. Missing translations disclose their actual fallback. Language path prefixes and translated slugs are excluded.

## Acceptance checklist

- [ ] Confirm explicit language precedence, cookie persistence, unsupported-value handling and truthful translation fallback.
- [ ] Confirm selector behaviour with and without lang, preserving the active geographic and content context.
- [ ] Confirm the sharing toggle, its initially-on state and generated links without mutating sender preferences.
- [ ] Verify the expected experience for recipients opening explicit language links and later navigating without lang.
- [ ] Obtain owner acceptance of remaining language details before implementation; do not document technical implementation yet.

## Readiness

This task stays planned with readiness not_ready and implementation_authorized false. The product decisions above are accepted, but implementation planning is still incomplete.

## MUST-FIX consolidation

MUST-FIX historically marks lang-consume-and-redirect and language alternates complete. That is a historical baseline, not the new target: explicit lang remains visible and sharing can include it. Combine the English-copy cleanup with generated copy bindings and truthful language fallback. No forced language paths or country subdomains.

## Implementation authorization

The owner explicitly requested implementation of the integrated database, API and web redesign on 19 November 2026. That request supersedes earlier planning-only gates in this record. Implement web only, with realistic labelled synthetic development fixtures, contract-generated screen reads and clients/types. Engine operations, the dev frontend, Flutter and real-data acquisition are excluded. The accepted plan in this conversation is authoritative where older task prose conflicts. Seed-file approval rules remain in force.

## Comments

### 2026-11-19T13:16:10.283Z · PETER IRUNGU

Implemented explicit supported lang validation, response cookie persistence without stripping the parameter, cookie-only links without forced lang, selector update behavior, and initially-enabled language inclusion in sharing. Browser verified /za?view=leaders&lang=sw and then cookie-selected Swahili at a parameter-free Kenya URL. Copy coverage and truthful per-section translation fallback labels remain incomplete.

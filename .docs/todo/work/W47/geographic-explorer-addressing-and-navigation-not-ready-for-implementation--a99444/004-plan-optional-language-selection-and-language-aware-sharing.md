---
{id: TSK-F411B380B819,name: Plan optional language selection and language-aware sharing,type: task,status: planned,priority: medium,created_at: 2026-11-19T11:59:23.716Z,updated_at: 2026-11-19T11:59:23.716Z,order: 4096,extra: {readiness: not_ready,implementation_authorized: false}}
---

# Plan optional language selection and language-aware sharing

## Goal

Record and finish the language experience for the geographic explorer without requiring language in every URL. Visitors should normally use their saved preference, while shared links may explicitly select a supported language. Language must remain independent of country and geographic identity.

## Context

This is planning work in the geographic explorer task group, which remains NOT READY FOR IMPLEMENTATION. The owner chose a single site with explicit country prefixes such as /ke and /ug. Country subdomains are excluded from the initial scope. The owner also approved optional lang selection, cookie persistence and a language-in-sharing toggle, without language path prefixes or translated place slugs. These are agreed product behaviours; technical implementation has not yet been documented or approved. Preserve unrelated work and update these same task records as discussion continues. No application changes, generation or deployment follow from completing this documentation update.

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

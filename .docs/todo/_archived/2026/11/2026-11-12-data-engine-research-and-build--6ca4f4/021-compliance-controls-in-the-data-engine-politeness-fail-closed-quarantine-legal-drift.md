---
{id: TSK-599BCDD0BF5F,name: "Compliance controls in the data engine: politeness, fail-closed, quarantine, legal drift",type: task,status: completed,priority: medium,created_at: 2026-11-02T08:27:29.080Z,updated_at: 2026-11-02T09:11:25.892Z,due_at: 2026-11-24,order: 21504,extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-02T09:06:23.278Z},{from: in-progress,to: completed,at: 2026-11-02T09:11:25.892Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-599BCDD0BF5F/1793610383280-start,started_at: 2026-11-02T09:06:23.626Z,end_ref: refs/tracking/TSK-599BCDD0BF5F/1793610685894-end,ended_at: 2026-11-02T09:11:25.892Z,summary: {files: 17,insertions: 1472,deletions: 17}}]}},archived_at: 2026-11-12T05:47:56.094Z}
---

# Compliance controls in the data engine: politeness, fail-closed, quarantine, legal drift

## Goal
Implement the operational controls the compliance document requires so the data engine cannot collect outside its approval: identified, rate-limited and bounded access, stop conditions, fail-closed behaviour, quarantine of unexpected personal data and detection of legal-condition drift.

## Context
Read .docs/docs/LEGALITY_SAFETY_AND_COMPLIANCE.md first, then the Legal and source approval gate section of .docs/docs/WEBSITE_DESIGN.md. Public visibility is not permission, technical validation is separate from legal approval, and agents may draft but never approve. This is an engineering baseline, not legal advice: qualified counsel must review before production collection. Work only on develop, record progress here and tick items with task check. Controls: an identifiable user agent with a monitored contact, documented rate and concurrency ceilings, bounded retries with backoff and jitter, caching and conditional requests, size limits, timeouts and circuit breakers, stop on 401 403 429 repeated 5xx and access challenges with no retry loop around a restriction, robots as a default operational rule, no stealth or evasion. Structure bundles never contain secrets. Depends on the structure runner and the collection gate.

## Acceptance checklist
- [x] Global safety ceilings plus per-source policy resolution that takes the most conservative limit, with tests.
- [x] Stop conditions end a run, write a check and pause scheduled jobs; no code path retries around a block.
- [x] Detector for unexpected personal-data fields and sensitive categories that sets affected candidates to quarantined.
- [x] Legal drift checks for terms, licence, robots, redirects and new access challenges (domain-ownership monitoring is recorded as a gap: it needs registry data the engine does not have).
- [x] Incident procedure implemented as commands: stop collection, quarantine candidates, preserve evidence with restricted access.
- [x] Lint rejecting secrets, cookies or tokens in structure bundles.

## Progress
Implemented in the data engine: global ceilings with the most-conservative-limit rule, rate limiter, identified user agent, bounded retries with backoff and jitter, conditional requests with an on-disk cache, response size cap and timeouts, stop on 401 403 429, repeated 5xx and access-challenge markers with a circuit breaker and no retry around a block, robots.txt respected by default, the Python gate mirroring the TypeScript gate (both tested against contracts/gate-vectors.json), personal-data scanner with quarantine of candidates and an issue row, legal drift checks (hashes of robots and registered terms pages; a change pauses the site), redirects reported as drift, incident commands (stop_collection and the mzizi-data stop CLI: pause site, cancel pending jobs, quarantine unpromoted candidates, record the incident, keep evidence), and the secrets lint in the validator. Gaps: domain-ownership monitoring, licence-page discovery (only registered URLs are watched), the personal-data scanner is heuristic and Kenya-centred (phone and ID patterns), robots rules for other agent names are not merged, and there is no alerting channel beyond website.checks rows.

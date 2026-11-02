---
{id: TSK-599BCDD0BF5F,name: "Compliance controls in the data engine: politeness, fail-closed, quarantine, legal drift",type: task,status: planned,priority: medium,created_at: 2026-11-02T08:27:29.080Z,updated_at: 2026-11-02T08:27:29.080Z,due_at: 2026-11-24,order: 21504}
---

# Compliance controls in the data engine: politeness, fail-closed, quarantine, legal drift

## Goal
Implement the operational controls the compliance document requires so the data engine cannot collect outside its approval: identified, rate-limited and bounded access, stop conditions, fail-closed behaviour, quarantine of unexpected personal data and detection of legal-condition drift.

## Context
Read .docs/docs/LEGALITY_SAFETY_AND_COMPLIANCE.md first, then the Legal and source approval gate section of .docs/docs/WEBSITE_DESIGN.md. Public visibility is not permission, technical validation is separate from legal approval, and agents may draft but never approve. This is an engineering baseline, not legal advice: qualified counsel must review before production collection. Work only on develop, record progress here and tick items with task check. Controls: an identifiable user agent with a monitored contact, documented rate and concurrency ceilings, bounded retries with backoff and jitter, caching and conditional requests, size limits, timeouts and circuit breakers, stop on 401 403 429 repeated 5xx and access challenges with no retry loop around a restriction, robots as a default operational rule, no stealth or evasion. Structure bundles never contain secrets. Depends on the structure runner and the collection gate.

## Acceptance checklist
- [ ] Global safety ceilings plus per-source policy resolution that takes the most conservative limit, with tests.
- [ ] Stop conditions end a run, write a check and pause scheduled jobs; no code path retries around a block.
- [ ] Detector for unexpected personal-data fields and sensitive categories that sets affected candidates to quarantined.
- [ ] Legal drift checks for terms, licence, robots, redirects, domain ownership and new access challenges.
- [ ] Incident procedure implemented as commands: stop collection, quarantine candidates, preserve evidence with restricted access.
- [ ] Lint rejecting secrets, cookies or tokens in structure bundles.

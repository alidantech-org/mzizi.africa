---
{id: TSK-28433845A905,name: "Model promises, speeches, activities, Gazette evidence and subscriptions",type: task,status: planned,priority: medium,created_at: 2026-11-19T10:29:49.816Z,updated_at: 2026-11-19T10:29:49.816Z,order: 15360}
---

# Model promises, speeches, activities, Gazette evidence and subscriptions

## Goal

Track what leaders promise, in the House, at rallies and in recordings, link each promise to real projects, contracts, budgets or bills when they exist, and say honestly "no record found in the sources we checked up to this date" when they do not. Citizens can subscribe to a leader's promises and be notified when one materialises. A leader's activity trail is kept over time and the screens show the recent part. Gazette notices become the evidence that creates appointments and other changes.

## Context

Existing: `governance.speeches` (`governance.ts:444-470`; sitting, holder, optional motion, bill and hansard, kind, position, page, summary, word count), `politics.manifestos` and `manifesto_items`, read-only `accountability.PromiseProgress` (topic match, "asserts no causal link"), `source.coverage` (`source.ts:407`), `source.artifacts`, `filesystem.media`, `community.subscriptions` with scheme `com.subscription.kind` and `community.notifications`, `event.occurrences` and `event.participants` (`event.ts:249`), `legal.effects` (`legal.ts:295-309`, effects point at a wording only). Design: `.docs/design/data/POWER_MONEY_PATTERNS_AND_SITES.md` sections 6 and 7.

## Proposed

- `governance.promises` (maker holder or individual, office then, the statement, made on, place, topic, quantity and unit, due date, occasion occurrence, citation, status scheme: made, in progress, delivered, broken, withdrawn, no record found, status as-of date).
- Recordings, videos, social posts, long statements and news items are `filesystem.media` and `filesystem.contents` rows whose subject is the promise or speech (no new table); `filesystem.media` gains `startSecond` and `endSecond` for the moment in a recording.
- `governance.fulfilments` (promise to project, contract, appropriation or bill; link kind: stated by official source, matched on place and topic, model-proposed; review status; citation). Model-proposed links stay proposals until reviewed.
- "No record found" is a `source.coverage` result plus the promise status, naming the sources searched and the date.
- Activities are a read model unioning event participation, sittings, votes, speeches, bills, contracts signed, appointments made and promises; add a signatory and chief-guest participant role value if missing. No `activities` table.
- Subscriptions: add kinds for leader, promise, place and supplier; status changes and new links write notifications.
- Gazette: an instrument kind for notices, and `legal.effects` that can name the governance, geography, event or civic record they create or change (using the closed subject list), so an appointment links notice to holder.

## Method options

A. One `activities` table (rejected: duplicates facts). B. Promises as manifesto items only (cannot hold rally promises or a recording moment). C. Promises plus links, feed as read model. Recommended.

## Acceptance checklist

- [ ] Owner reviews promises, promise links, status scheme and the effects change; author after approval.
- [ ] Define the exact wording of the "no record found" state and prove it can be produced from coverage rows alone.
- [ ] Define the activity feed query and its ordering without a new stored table.
- [ ] Specify notification rules per subscription kind with consent, using existing `community` consent and preference tables.
- [ ] Define the video and recording handling: artifact reference and start time only; no storage of third-party video bytes without a licence decision.
- [ ] Paper-test a rally promise with a recording, a House promise, a promise matched to a project by place and topic, and one with no record.
- [ ] Run `task validate`.

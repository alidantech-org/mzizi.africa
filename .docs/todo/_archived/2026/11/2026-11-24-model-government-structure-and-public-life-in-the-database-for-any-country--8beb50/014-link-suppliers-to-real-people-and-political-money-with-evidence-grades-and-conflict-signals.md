---
{id: TSK-69558B65F321,name: "Link suppliers to real people and political money, with evidence grades and conflict signals",type: task,status: archived,priority: medium,created_at: 2026-11-19T10:29:48.154Z,updated_at: 2026-11-24T19:25:12.587Z,order: 14336,extra: {status_history: [{from: planned,to: archived,at: 2026-11-24T19:25:12.587Z}]},archived_at: 2026-11-24T19:25:18.937Z}
---

# Link suppliers to real people and political money, with evidence grades and conflict signals

## Goal

Let the system show, with cited evidence, when a person with power owns or directs a company that supplies a body they lead or oversee, when a supplier funds a party or candidate and later wins public money, and when a relative or associate is in the chain. It must do this fairly: as recorded connections with dates, match method and confidence, never as accusations, and never publishing a name-match as fact.

## Context

Existing: `official.relationships` links any two identities (entity or individual), with kind, dates and `sharePercentage`, and exactly-one on each side (`official.ts:140-172`); `official.identifiers`; `official.individuals`; `politics.parties` (an entity), `politics.memberships`; `governance.holders` (a person's tenure in an office); `finance.flows`. `ofc.relationship.kind` does not exist as a scheme (`schemes.csv` lists ofc entity, name, identifier, contact and branding kinds only), so the relationship kind column has no vocabulary. Entity resolution is in `.docs/design/data/ENTITY_RESOLUTION.md`; policy in `.docs/design/policy/LEGALITY_SAFETY_AND_COMPLIANCE.md`. Design: `.docs/design/data/POWER_MONEY_PATTERNS_AND_SITES.md` section 5.

## Proposed

1. Vocabulary `ofc.relationship.kind`: kinship (spouse, parent, child, sibling), business (director, shareholder, beneficial owner, partner, agent), political (party leader, officer, adviser). Add `evidenceBasisId` (registry record, official declaration, court record, news report, inferred by matching) and `confidence` to `official.relationships`; inferred rows stay proposals until reviewed.
2. Declared interests: a declaration is a source artifact whose rows become relationships with basis "official declaration"; no new table.
3. `politics.contributions`: donor (entity or individual, exactly one), recipient (party or candidate, exactly one), optional election, amount, currency, in-kind flag, given on, disclosure artifact, citation.
4. A defined meaning of "person with power" and "relative or associate" as vocabulary with a legal basis, not a guess.
5. Right of reply: a correction and response record attachable to any signal.

## Signals (read models)

Officeholder or relative owns or directs a supplier; holder's body is buyer or oversees buyer (via `powers`, task 012); donor wins within a window; contract signed or approved by a person with an interest in the contractor; award concentration in one network. Each shows the chain of cited records, that interest and office overlap in time, the match method and confidence, and a base rate. Wording: "connection recorded".

## Method options

A. Store a conflict flag on the contract (rejected: a claim stored as fact, stale when facts change). B. Compute signals as read models over graded evidence. Recommended. C. Put donations in `finance.flows` (possible, but loses election link and disclosure rules; compare in review).

## Acceptance checklist

- [ ] Owner reviews the relationship vocabulary, evidence grades and the contributions table; author after approval.
- [ ] Define publication gates by evidence grade (what may be shown, to whom) with legal review noted in the policy document.
- [ ] Define the time-overlap rule and window parameters for every signal as parameters, not constants.
- [ ] Specify privacy handling for private individuals and relatives (visibility classes, minimisation).
- [ ] Paper-test five cases: director-owned supplier, relative-owned supplier, supplier donor before award, shell-company chain, false name match that must not publish.
- [ ] Run `task validate`.

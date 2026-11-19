---
{id: TSK-01C192FD6422,name: "Model rights to appoint, nominate, approve, remove and elect, and how they were used",type: task,status: planned,priority: medium,created_at: 2026-11-19T10:29:45.072Z,updated_at: 2026-11-19T10:29:45.072Z,order: 12288}
---

# Model rights to appoint, nominate, approve, remove and elect, and how they were used

## Goal

Make the structure of influence understandable: who holds which right over whom, in what order, with what threshold, under which article, and how each real appointment actually happened (which body nominated, which approved, which vote, which Gazette notice). The screens then answer "who can remove the Governor" and "how did this person get the seat" from cited data, and the analytics can compute reach and concentration without storing opinions.

## Context

Existing: `governance.holders` (`governance.ts:71-87`, `appointmentKindId`, `appointedByEntityId`), `governance.relationships` (116-134, institution to institution), `governance.motions` (kind `appointment`) and `votes`, `politics.contests`, `candidates`, `results`, `politics.memberships`, `legal.effects` (`legal.ts:295-309`). `official.relationships` already uses `rule.exactlyOne` on both sides (`official.ts:140-172`), so a table that takes a position or an institution on either side is possible without a Dryv gap. This corrects the assumption in task 004. Design: `.docs/design/data/POWER_MONEY_PATTERNS_AND_SITES.md` section 3.

## Proposed contract

`governance.powers`: holder (position or institution, exactly one; the electorate is an institution row), target (position or institution, exactly one), `rightId` (scheme `gov.power.kind`: initiate, nominate, vet, approve, appoint, confirm, remove, veto, assent, dissolve, fund, audit, oversee, summon, elect), `procedureId` and `stepOrder` for multi-step procedures, `thresholdKindId` and `thresholdValue`, `isBinding`, `basisProvisionId`, `sourceCitationId`, period fields. Exercised rights: `Holders.appointmentMotionId` and `Holders.nominatedByEntityId`; Gazette notice evidence through `legal.effects` that name the affected record (task 015 area). Informal ties live in `official.relationships` with the vocabulary of task 014, never in `powers`.

## Method options

A. Store influence scores (rejected, opinion as fact). B. Powers on institution relationships only (cannot express positions or voters). C. `powers` with exactly-one on each side and ordered procedures. Recommended. Influence measures (reach, depth of chain, mutual oversight) are read models in the `accountability` surface.

## Acceptance checklist

- [ ] Author `governance.powers` with exactly-one rules, uniqueness on holder, target, right, procedure and step, and the `gov.power.kind` and threshold schemes after owner approval.
- [ ] Add the exercised-right columns on `holders` and decide how motions and votes tie to a seat.
- [ ] Define how `task 004` links are replaced or kept (update that task to avoid two overlapping tables).
- [ ] Paper-test a judge (commission recommends, head of state appoints, legislature may approve), a prime minister, a governor removal, a party-list seat and a customary authority.
- [ ] Define the influence read models (reach, chain depth, mutual oversight) with their evidence counts and the wording rule: structure shown, no intent implied.
- [ ] Run `task validate`.

---
{id: TSK-C0BAB78E2685,name: "Add positions and seat rules so offices can be counted, filled and explained",type: task,status: archived,priority: medium,created_at: 2026-11-19T09:53:15.907Z,updated_at: 2026-11-24T19:24:15.608Z,order: 3072,extra: {status_history: [{from: planned,to: archived,at: 2026-11-24T19:24:15.608Z}]},archived_at: 2026-11-24T19:25:18.937Z}
---

# Add positions and seat rules so offices can be counted, filled and explained

## Goal

The leadership screens show "Governor, 47, one per county, elected, five-year term, two terms at most" and "Members of County Assembly, 1,450, one per ward", with seat counts and vacant seats. The database stores only individual offices. It has no concept of a kind of position with a rule for how many seats exist, where, how they are filled and for how long. This task adds that concept, generically, so counts come from data and never from typed text.

## Context

`governance.offices` (`dryv/contracts/schemas/postgres/governance.ts:51-68`) is one established office, optionally scoped by `unitFeatureId`, with `officeKindId`, `institutionId` and dates. `Holders` (71-87) attach a person and an `appointmentKindId`. `Terms` (231-260) holds a body's term (parliament, assembly) with `termKindId`, `institutionId` and optional `unitFeatureId`. `politics.contests` has `seatCount` (politics.ts:145). There is nothing that states "one office per unit of level L", "12 nominated seats", a term length or limit, who selects, or the legal basis. Therefore the tree cannot show "47", the matrix cannot place "Senators" under national-elected, and vacancy cannot be computed against an expected number. Geography `Levels` (geography.ts:279-297) already gives each country its own ladder (`countryId`, `hierarchyKindId`, `depth`), which is the neutral way to say "one per unit of this level".

## Proposed contract (Dryv, new table `governance.positions`, then `offices.positionId`)

Fields: `code` (coded entity), `institutionId` (belongs to the body), `roleId` (scheme gov.position.role), `selectionMethodId` (scheme gov.selection.method), `jurisdictionLevelId` (belongs to `geography.Levels`: where it serves), `seatBasisId` (fixed number, one per unit of a level, set by formula, variable), `seatUnitLevelId` (belongs to `Levels`, the level that gets one, when basis is per unit), `seatCount` (positive integer, optional), `termYears` and `termLimit` (optional), `basisProvisionId` (belongs to legal `Provisions`), `sourceCitationId`, `displayOrder`, period fields. Rule: a fixed basis requires `seatCount`; a per-unit basis requires `seatUnitLevelId`. Offices gain `positionId` and an optional `seatOrdinal` for seats that belong to no unit (special seats).

## Method options

A. New `positions` table with offices as seats of a position. Recommended: offices stay independent of holders (their stated purpose), the rule lives once, vacancy is "offices of a position with no current holder" and a count check compares rows to the rule.
B. Put the rule columns on `offices`. Rejected: repeats the rule for 1,450 seats.
C. Store counts only on `institutions`. Rejected: one body holds several kinds of position (constituency members, women's seats, nominated seats).
D. Counts as statistics observations. Rejected: counts of seats are structure, not published measurements.

Decide in review whether `offices.officeKindId` is removed or kept as a derived duplicate; the role moves to `positions.roleId`.

## Link to patterns

Task 010 generates positions and offices from pattern parts (for example one assembly-member position fanned out over the ward level). A position's seat rule must therefore be expressible as data a pattern part can carry, and every generated office must be recorded in the pattern ledger with status expected. Positions never create holder rows.

## Neutrality checks

The same table must express, with rows only: a presidential ticket, a directly elected single seat per district, a party-list chamber (seat basis formula, selection method party list, seats awarded to parties not units), an indirectly elected upper house, a nominated block, an ex officio presiding officer and a customary council.

## Acceptance checklist

- [ ] Author `Positions` and the `Offices.positionId` change in `governance.ts` with descriptions, indexes (`institutionId`, `selectionMethodId`, `jurisdictionLevelId`) and the two conditional rules; record any rule Dryv cannot yet generate against DRYV_GAPS gaps 5, 8 and 9.
- [ ] Decide and record what happens to `officeKindId` and update every contract and generated model that uses it.
- [ ] Add a check design (query or constraint) comparing the number of office rows to the position's rule, and a definition of "vacant" that does not depend on any holder row existing.
- [ ] Paper-test the table with a presidential ticket, a per-unit seat, a fixed block, a party-list seat and an ex officio seat from at least three countries.
- [ ] Show the field list and rules to the owner and record approval before generation.
- [ ] Run `task validate`.

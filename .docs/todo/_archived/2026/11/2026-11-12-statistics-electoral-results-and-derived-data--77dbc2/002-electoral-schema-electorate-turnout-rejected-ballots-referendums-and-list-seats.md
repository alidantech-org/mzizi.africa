---
{id: TSK-5FDCE3173A75,name: "Electoral schema: electorate, turnout, rejected ballots, referendums and list seats",type: task,status: completed,priority: medium,created_at: 2026-11-02T19:25:51.389Z,updated_at: 2026-11-03T01:13:53.351Z,order: 2048,depends_on: [TSK-1F02AF48DAD0],extra: {status_history: [{from: planned,to: completed,at: 2026-11-03T01:13:53.351Z}]},archived_at: 2026-11-12T05:47:55.562Z}
---

# Electoral schema: electorate, turnout, rejected ballots, referendums and list seats

## Goal

Make the electoral schema hold the electorate and not only the candidates: how many voters were registered, how many voted, how many ballots were valid, rejected or spoilt, in each area at each level of each election, plus referendum options and party-list allocations.

## Context

Today `electoral.elections`, `seats`, `candidates` and `results` record who stood for which seat and how many votes each candidate won at a result level (polling station, ward, constituency, county, national), with a winner flag, rank and declaring institution. That covers a candidate-based contest. It does not hold registered voters, votes cast, valid, rejected and spoilt ballots per area, turnout, a referendum question with its options and the votes for each option, or nominated and party-list seat allocations (women's seats, special seats, nominated senators, county assembly nominations). It also cannot carry the version of a voter register (the register used for a given election) or the Forms 34A, 34B and 34C evidence from which results are declared. The addition must reference geography units and institutions, link results to the IEBC publications that support them, and keep contested or revised results as new versions rather than overwrites.

## Acceptance checklist

- [ ] Add an electorate table: election, geography unit, result level, registered voters, votes cast, valid, rejected, spoilt, with the register version.
- [ ] Add referendum questions and options and tie results to an option as well as to a candidate.
- [ ] Add party-list and nominated seat allocation records linked to the party and the person.
- [ ] Link results and electorate rows to the supporting source documents (IEBC forms and declarations).
- [ ] Author the contracts in Dryv, regenerate and add the migration.
- [ ] Add engine tests for a candidate result, an electorate row, a referendum result and a revised result.

---
{id: TSK-FDB011601399,name: "Political party register: parties, logos, officials and constitutions from ORPP PDFs",type: task,status: blocked,priority: medium,created_at: 2026-11-02T20:02:41.627Z,updated_at: 2026-11-03T06:12:42.759Z,order: 5120,depends_on: [TSK-C6D4EC067F97],extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-02T22:38:12.821Z},{from: in-progress,to: blocked,at: 2026-11-03T01:12:15.274Z},{from: blocked,to: completed,at: 2026-11-03T05:44:12.325Z},{from: completed,to: blocked,at: 2026-11-03T05:46:13.699Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-FDB011601399/1793659092823-start,started_at: 2026-11-02T22:38:13.344Z,end_ref: refs/tracking/TSK-FDB011601399/1793668335276-end,ended_at: 2026-11-03T01:12:15.274Z,summary: {files: 265,insertions: 13322,deletions: 50}}]}},due_at: 2026-11-04}
---

# Political party register: parties, logos, officials and constitutions from ORPP PDFs

## Goal

Load every registered political party with its legal name, abbreviation, registration details, status, officials, constitution and logo, from the ORPP publications, and reconcile it with the party rows created from the Parliament lists.

## Context

The Parliament import created 25 party rows named only by their abbreviation (UDA, ODM, WDM and others), one of them a coalition mixed with a party name. The ORPP register provides the proper names and the status of each party, plus logos and officials in its PDFs. The pipeline must preserve each PDF first, extract text and tables (with OCR where scanned and with the arithmetic and consistency checks used for the budget summary), extract embedded logo images as raw artifacts, and map rows to the political party schema. Party names and acronyms are matched fuzzily to existing party rows and must update or supersede them, never duplicate them; coalitions are modelled apart from parties. Officials are people and go through the matching system, with public-role facts only: name, party office, term. The party constitution PDF is kept as a source document linked to the party.

## Acceptance checklist

- [x] Design the party document pipeline and extractor for the register PDFs, including embedded logo extraction.
- [x] Match ORPP parties to existing party rows by name and acronym with a report of matches, new parties and conflicts.
- [x] Update party rows (name, abbreviation, registration data, status) and record coalitions separately.
- [x] Store logos and constitutions as raw artifacts linked to each party with source and licence.
- [ ] Load party officials as office holders through the matching system.
- [x] Add extractor and matching tests with a fixture PDF.

## Outcome (Lane C, 3 November 2026)

- Pipeline: `extractors/orpp_parties.py` (text tables, symbol boxes), `imports/orpp_parties.py` (match, stage, apply), commands `import-orpp-parties` and `apply-orpp-parties`; tests in `tests/test_orpp_parties.py`.
- Result in `mzizi`: 107 fully and 41 provisionally registered rows (6 parties in both registers merged, full wins) give 142 parties. 23 matched stored rows were updated in place (audited, previous values in the decision rationale; the party table has one row per code, so promotion cannot supersede) and 119 new parties were staged, reviewed by the agent account and promoted. 107 symbols stored as documents linked to the party (licence unassessed). Postal addresses, head offices and provisional emails are restricted contact points, never in staging.
- Migration `1794700000100` adds the `provisional` party status (provisional parties were otherwise indistinguishable from active ones).
- Conflicts reported, not linked: stored `IND` (independent candidates are not a party) and the mixed coalition row `ODM | Azimio La Umoja One Kenya Coalition`. The register lists "Azimio la Umoja One Kenya Coalition Party" as a party, so it became a new party row; splitting the 407 memberships between ODM and the coalition needs a coalition model that does not exist yet.
- Not done, because the data is not published in the register PDFs fetched: party officials and party constitutions (see `ke-orpp-catalogue.json`, `notPublishedThere`). Form PP-7 filings are not published as a list.

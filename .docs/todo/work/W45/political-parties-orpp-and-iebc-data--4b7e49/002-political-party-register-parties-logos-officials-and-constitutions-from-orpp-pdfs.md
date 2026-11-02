---
{id: TSK-FDB011601399,name: "Political party register: parties, logos, officials and constitutions from ORPP PDFs",type: task,status: planned,priority: medium,created_at: 2026-11-02T20:02:41.627Z,updated_at: 2026-11-02T21:36:48.634Z,order: 2048,depends_on: [TSK-C6D4EC067F97]}
---

# Political party register: parties, logos, officials and constitutions from ORPP PDFs

## Goal

Load every registered political party with its legal name, abbreviation, registration details, status, officials, constitution and logo, from the ORPP publications, and reconcile it with the party rows created from the Parliament lists.

## Context

The Parliament import created 25 party rows named only by their abbreviation (UDA, ODM, WDM and others), one of them a coalition mixed with a party name. The ORPP register provides the proper names and the status of each party, plus logos and officials in its PDFs. The pipeline must preserve each PDF first, extract text and tables (with OCR where scanned and with the arithmetic and consistency checks used for the budget summary), extract embedded logo images as raw artifacts, and map rows to the political party schema. Party names and acronyms are matched fuzzily to existing party rows and must update or supersede them, never duplicate them; coalitions are modelled apart from parties. Officials are people and go through the matching system, with public-role facts only: name, party office, term. The party constitution PDF is kept as a source document linked to the party.

## Acceptance checklist

- [ ] Design the party document pipeline and extractor for the register PDFs, including embedded logo extraction.
- [ ] Match ORPP parties to existing party rows by name and acronym with a report of matches, new parties and conflicts.
- [ ] Update party rows (name, abbreviation, registration data, status) and record coalitions separately.
- [ ] Store logos and constitutions as raw artifacts linked to each party with source and licence.
- [ ] Load party officials as office holders through the matching system.
- [ ] Add extractor and matching tests with a fixture PDF.

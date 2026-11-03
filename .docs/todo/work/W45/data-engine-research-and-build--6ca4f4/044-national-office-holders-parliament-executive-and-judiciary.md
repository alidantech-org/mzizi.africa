---
{id: TSK-5E7E7B7EEFA0,name: "National office holders: Parliament, executive and judiciary",type: task,status: planned,priority: medium,created_at: 2026-11-03T11:22:57.682Z,updated_at: 2026-11-03T11:22:57.682Z,order: 46080}
---

# National office holders: Parliament, executive and judiciary (Lane P3)

## Goal

Complete and extend the people who hold or held national public offices so that the seeded structure (constituency seats, county woman-representative and senator seats, nominated seats, ministries, commissions, courts) shows real holders with the term, how the seat was obtained and the party, each backed by a source document and extraction. Success is measured by growth in `person.individuals`, `governance.holders` and `political.memberships` and by seeded seats that now have a holder.

## Context

Built on DEC-COMPLETION-FIRST, DEC-AUTO-APPROVAL and DEC-ENTITY-MATCHING: a name alone never reuses a person, unmatched places and parties stay unlinked and are reported, soft warnings promote as unverified. Sources are Wikipedia list pages read through the MediaWiki API (en.wikipedia.org added to the Wikimedia site and approved at 0.2 requests per second), the Parliament lists already imported, and a curated seed (`ke-office-holders-curated.json`, marked custom-prepared from manual research and unverified). The importer is `imports/office_holders.py` with extractor `wikipedia_holders.py`; the staged run script is `scripts/pipeline/office-holders.sh`.

## Acceptance checklist

- [x] Members of the 11th and 12th Parliaments (constituency, woman representative, nominated) staged, validated, reviewed and promoted.
- [x] Senators 2013, 2017 and 2022 including nominated women, youth and disability seats.
- [x] Current Cabinet, Attorney-General, Chief Justices, Deputy Presidents, Supreme Court justices and Speakers loaded.
- [x] 13th Parliament holders attached to the seeded constituency, woman-representative and county-senator seats with a recorded score.
- [x] Placeholder person Vacant ended (not deleted) and reported.
- [x] Curated seed of previous cabinets, speakers, party leaders and commission heads loaded as unverified.
- [ ] Principal Secretaries, commission members, Court of Appeal and High Court principal judges, state corporation CEOs and chairs: need Gazette appointment notice extraction or ministry sites.
- [ ] Gazette appointment notices parsed into holders (33 notices in the registry are not yet read for appointments).
- [ ] Office, party and county search filters on the API (lane P1 owns search).

## Notes

Before and after counts and gaps are in the Lane P3 status section of the data engine status document.

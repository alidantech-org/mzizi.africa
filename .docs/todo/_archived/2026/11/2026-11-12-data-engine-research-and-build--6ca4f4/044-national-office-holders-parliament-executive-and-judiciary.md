---
{id: TSK-5E7E7B7EEFA0,name: "National office holders: Parliament, executive and judiciary",type: task,status: archived,priority: medium,created_at: 2026-11-03T11:22:57.682Z,updated_at: 2026-11-12T05:47:51.778Z,order: 46080,due_at: 2026-11-05,extra: {status_history: [{from: planned,to: archived,at: 2026-11-12T05:47:51.778Z}]},archived_at: 2026-11-12T05:47:56.094Z}
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
- [x] Gazette appointment extractor (`gazette-appointments`) built and run over all Gazette issues in the registry (83 files after a bounded harvest of 37 more): 6 appointees from one tribunal notice promoted as unverified; the other appointment notices have OCR names too corrupted to accept, and nothing is guessed.
- [x] Office holder search endpoint `/v1/governance/office-holders/search` with person, office, institution, party, county and current filters, rows carrying names (Dryv contract, regenerated, unit tests); lane P1 never did search, so this lane owns it.
- [x] Guessed seat links (Dagoretti North/South, Mwingi Central) kept as `under_review` verifications with the guess in the rationale.
- [x] Leadership pages of the 55 reachable ministry, commission and agency sites that serve a governance institution fetched through the gate (`fetch-leadership`, at most 6 pages per host, 159 pages) and extracted (`leadership-page`): 138 unverified holders (Cabinet and Principal Secretaries, commission chairs and commissioners, CEOs, board members) linked to seeded offices by suffix and fuzzy state-department match; 39 offices created where the seed had none; heads of departments skipped; 11 junk readings rejected and ended.
- [x] Gazette notices re-OCRed (Tesseract, English, 300 dpi, only pages whose text layer hints at an appointment) and re-extracted: 8 appointees with clean names; fuzzy name correction only on a unique match of 92 or more (one correction); the rest loaded as low confidence with `under_review` verifications; 4 earlier noisy readings marked superseded.

## Notes

Before and after counts and gaps are in the Lane P3 status section of the data engine status document.

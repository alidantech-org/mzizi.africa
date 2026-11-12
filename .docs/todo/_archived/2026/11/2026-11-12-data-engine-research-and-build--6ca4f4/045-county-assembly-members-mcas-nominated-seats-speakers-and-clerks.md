---
{id: TSK-8CB0574383EB,name: "County assembly members (MCAs), nominated seats, speakers and clerks",type: task,status: archived,priority: medium,created_at: 2026-11-03T11:45:10.805Z,updated_at: 2026-11-12T05:47:52.768Z,order: 47104,due_at: 2026-11-05,extra: {status_history: [{from: planned,to: archived,at: 2026-11-12T05:47:52.768Z}]},archived_at: 2026-11-12T05:47:56.094Z}
---

# County assembly members (MCAs), nominated seats, speakers and clerks

## Goal

Give Mzizi the people who sit in the 47 county assemblies for the 2022 to 2027 term: the elected ward representatives (about 1,450 wards), the nominated members (marginalised-group and gender top-up seats), the speakers and the clerks. Each person is a public-office record linked to the ward post by a scored geography match, with its party where known, a source document and a confidence, and with doubtful links left visible for review instead of hidden.

## Context

The ward posts, the shared nominated-seat posts and the speaker and clerk posts already exist from the office patterns (DEC-OFFICE-PATTERNS). The base list is the IEBC gazette (Notices 9956 and 10712, with the 21 September 2022 addendum) fetched through the collection gate; assembly websites corroborate and add speakers and clerks. Design is in DEC-COUNTY-ASSEMBLY-MEMBERS; approval follows DEC-COMPLETION-FIRST (unverified, with warnings in the rationale) and identity follows DEC-ENTITY-MATCHING (a name alone never merges). Code is in the data engine imports and extractors named county_assembly_members, gazette_assembly_members, mca_resolve_unplaced and mca_harvest.

## Acceptance checklist

- [x] Elected MCAs from Gazette Notice 9956 staged, validated, reviewed and promoted for all 47 counties (1,433 of 1,452 ward posts have a current holder).
- [x] Nominated members from Notice 10712 and the 21 September addendum promoted onto the shared seat posts (gender, ID mask and nature of special interest deliberately not kept).
- [x] Assembly sites harvested through the gate (27 plus Bomet, Homa Bay and Nandi via www hosts); speakers loaded for 5 counties; 6 clerks loaded (Isiolo, Kiambu, Kisii, Lamu, Nyandarua, Siaya).
- [x] Unplaced wards re-tried with alias scores: 6 linked, 5 recorded under_review; 28 reported as missing from the geography tree, listed in .data/reports/mca-unplaced-resolution.json.
- [x] dedup person run: of the pairs involving an MCA record, 140 flagged and 1 auto-merged.
- [ ] Marsabit assembly site (access challenge, stopped, not retried) and 17 assembly domains that do not resolve are not harvested; their members come from the gazette only.
- [ ] Clerks for Baringo and Nyeri (pages name several people) and the other 39 counties; party for site-only members; by-election winners for the 7 postponed wards (Meru Nyaki West, Kitui Kyome/Thaana, Narok Oloimasani, Kakamega Mumias North, Siaya South Gem, Nairobi Kwa Njenga and Utawala) were not found in the gazette or the document registry.
- [ ] A reviewer confirms the under_review links and the flagged duplicate pairs.

---
{id: DEC-COUNTY-ASSEMBLY-MEMBERS,name: "Decision - MCAs come from the IEBC gazette, assembly sites corroborate and add speakers",type: decision,tags: [people,mca,iebc,county-assembly,provenance]}
---

# Decision: county assembly members (Lane P2)

Date: 3 November 2026. Builds on DEC-COMPLETION-FIRST and DEC-ENTITY-MATCHING.

- **Base list.** IEBC Gazette Notice 9956 (24 Aug 2022, elected, about 1,442 wards read by column position) and Notice 10712 (9 Sep 2022, nominated, 715 rows), fetched from iebc.or.ke through the gate. Elected members link to the ward post `ke/ward/<county>/<constituency>/<ward>/mca` by score (constituency narrows the pool, clear margin required); unmatched wards keep the person and a post of their own (`mca-unplaced`) and are reported in `.data/reports/mca-gazette-report.json`. Nominated members hold the county's shared marginalised-group or gender top-up post.
- **Not kept.** Masked ID numbers, gender and each nominee's nature of special interest (can reveal disability or ethnic group). Votes are left to the election-results loader.
- **Assembly sites** (gated harvest, `mca_harvest.py`) corroborate the gazette winner of a ward (reported as corroborated or different) and add speakers. 20 of 47 assembly domains were unreachable or suspended, so the gazette is the only source there.
- **Identity.** Person codes carry the county (`ke/person/<name>-mca-<county>`); the same person written in another name order is a new record and a duplicate flag, never a name-only merge.
- **Known gaps.** Clerks, party for site-only members, by-election replacements, the Sept 21 and Oct 4 gazette addenda, constituencies missing from the geography tree (for example Kericho Bureti).

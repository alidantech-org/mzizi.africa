---
{id: TSK-074A0071405E,name: "Electoral loader: registered voters and results for 2013, 2017 and 2022",type: task,status: archived,priority: medium,created_at: 2026-11-02T19:25:52.319Z,updated_at: 2026-11-12T05:47:35.740Z,order: 7168,depends_on: [TSK-D4BDEB42D93E],extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-03T01:24:42.868Z},{from: in-progress,to: archived,at: 2026-11-12T05:47:35.740Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-074A0071405E/1793669082870-start,started_at: 2026-11-03T01:24:43.427Z,ended_at: 2026-11-12T05:47:35.741Z,end_error: "EROFS: read-only file system, open '/home/alidante/.local/share/taskcode/projects/f166568a11ef213d/.init.lock'"}]}},due_at: 2026-11-03,archived_at: 2026-11-12T05:47:55.562Z}
---

# Electoral loader: registered voters and results for 2013, 2017 and 2022

## Goal

Load the IEBC voter registers and results for the three most recent general elections and the 2010 referendum at every level the IEBC publishes, linked to geography units, candidates, parties and the source forms.

## Context

IEBC publishes the register by county, constituency and ward, and results by polling station, ward, constituency and county for the presidential, governor, senate, woman representative, national assembly and ward races, with Forms 34A, 34B and 34C as evidence. The Mzizi site registry already holds `www.iebc.or.ke` with an approved assessment. The loader must first inspect which machine routes exist (the results portal, downloadable spreadsheets or PDFs) and prefer them over scraping pages. Candidates are people and must pass the matching system so the same person across elections and between offices is one profile, with common names flagged and never merged on the name alone. Results that are later revised or set aside by a court become new versions with the declaring institution and the court decision as the source. Totals must reconcile: polling station sums to ward, ward to constituency, constituency to county, county to national, and valid plus rejected equals votes cast.

## Acceptance checklist

- [x] Probe the IEBC site and results portal for downloadable data and record the routes.
- [ ] Load elections, seats and candidates for 2013, 2017 and 2022, linking persons through the matching system.
- [x] Load registered voters and turnout rows per area and election.
- [ ] Load results at the lowest published level and check each roll-up against the next level.
- [ ] Record the supporting forms and declarations as source documents.
- [ ] Add loader tests, including a result table that does not reconcile.

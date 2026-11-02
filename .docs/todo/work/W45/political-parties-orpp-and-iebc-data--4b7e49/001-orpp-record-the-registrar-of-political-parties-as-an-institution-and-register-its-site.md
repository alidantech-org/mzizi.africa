---
{id: TSK-A67F72A02702,name: "ORPP: record the Registrar of Political Parties as an institution and register its site",type: task,status: completed,priority: medium,created_at: 2026-11-02T20:02:41.390Z,updated_at: 2026-11-02T22:38:08.817Z,order: 1024,extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-02T22:32:13.927Z},{from: in-progress,to: completed,at: 2026-11-02T22:38:08.817Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-A67F72A02702/1793658733929-start,started_at: 2026-11-02T22:32:14.393Z,end_ref: refs/tracking/TSK-A67F72A02702/1793659088821-end,ended_at: 2026-11-02T22:38:08.818Z,summary: {files: 122,insertions: 4996,deletions: 202}}]}}}
---

# ORPP: record the Registrar of Political Parties as an institution and register its site

## Goal

Research what the Office of the Registrar of Political Parties publishes at orpp.or.ke, record the ORPP as an institution under the right parent, register and assess its hosts, and probe it through the gate.

## Context

The ORPP registers and regulates political parties and administers the Political Parties Fund under the Political Parties Act, 2011. Its site publishes PDFs: lists and details of registered parties (the parties PDF carries party information and logos), fund allocations and parties' accounts and returns. Its hostname is on .or.ke, which the .go.ke trusted rule does not cover, so it needs an explicit host rule or assessment before any request. The institution row belongs in the governance structure seed with its legal basis, and the site in the site registry linked to it. Research must list each publication type, URL pattern, update frequency, format (text PDF, scanned PDF, spreadsheet, HTML) and licence or terms. Nothing is fetched beyond bounded gated requests, robots.txt is respected and any challenge stops the run.

## Acceptance checklist

- [x] Add the ORPP institution to the governance structure seed with parent and legal basis, labelled as manual research.
- [x] Register the ORPP site and its domains, assess it, and probe it through the gate.
- [x] Catalogue every publication type with URL pattern, format, frequency and terms.
- [x] Save the catalogue as a seed JSON and describe the pipeline design for each format.
- [x] Update the status document.

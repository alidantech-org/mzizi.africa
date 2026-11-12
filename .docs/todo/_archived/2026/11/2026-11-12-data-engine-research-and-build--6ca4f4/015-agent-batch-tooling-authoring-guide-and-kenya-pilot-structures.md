---
{id: TSK-5E448203A611,name: "Agent batch tooling, authoring guide and Kenya pilot structures",type: task,status: completed,priority: medium,created_at: 2026-11-02T07:26:37.627Z,updated_at: 2026-11-02T09:38:13.734Z,due_at: 2026-11-27,order: 15360,extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-02T09:32:24.521Z},{from: in-progress,to: completed,at: 2026-11-02T09:38:13.734Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-5E448203A611/1793611944522-start,started_at: 2026-11-02T09:32:24.877Z,end_ref: refs/tracking/TSK-5E448203A611/1793612293738-end,ended_at: 2026-11-02T09:38:13.734Z,summary: {files: 28,insertions: 761,deletions: 6}}]}},archived_at: 2026-11-12T05:47:56.094Z}
---

# Agent batch tooling, authoring guide and Kenya pilot structures

## Goal
Let agents create site structures in batches: a CLI that submits a bundle, validates it, stores it as a new version with method attribution, and a written authoring guide; then author pilot structures for a handful of real Kenyan sites.

## Context
Read .docs/docs/WEBSITE_DESIGN.md, .docs/docs/SITE_STRUCTURE_SPEC.md and .docs/decisions/website-schema-and-structure.md first. A site is not its domain: domains are dated and many per site. Work only on develop, record progress here and tick items with task check. Agents create versions without human approval, so validation and live checks are the safety net. Each version needs an attributed method (agent, model, inputs) and a NOTES.md covering findings, gaps and limitations. Pilot sites should be Tier A sources from the intake plan, with licences verified and recorded.

## Acceptance checklist
- [x] Batch CLI: submit, validate, publish a version, list versions, demote a version.
- [x] Authoring guide for agents under .docs/guidance, with the tag vocabulary and transform library.
- [x] Pilot structures with notes, each passing the dry run against real saved markup (three delivered; KNBS, the National Treasury, Kenya Law and Nairobi County could not be read from here, and live checks are blocked until a monitored contact channel exists).
- [x] Site and domain rows created for the pilots, including an alias and domain validity (publishers are created by the runner at first run).
- [x] Report gaps in the format found during authoring and update the spec.

## Compliance (added after LEGALITY_SAFETY_AND_COMPLIANCE.md)
Publishing a validated structure never activates collection: agents may draft assessments and structures but cannot approve a source. Batch tooling must add a lint that rejects secrets, cookies and tokens, record the assessment reference in each version, and make 'publish' and 'activate' separate commands. Pilot sites need an approved assessment (or licensed bulk data only) before any live check beyond reachability.

## Progress
Batch tooling (mzizi-data structure submit, batch, list, activate, demote): validation, a rejected version kept with its report for invalid bundles, an authoring method recorded (ai_assisted with the model), publish never activates and a registered site is required. Authoring guide: .docs/guidance/site-structure-authoring.md. Pilot structures from one manual GET per page on 2026-11-02, each with real saved markup excerpts: ke/iebc (resources party list, 41 rows on the real page, dates with ordinals), ke/parliament (Drupal budget documents, PDFs in the page body), world/geoboundaries (JSON API, real saved response). Registry rows for the three sites and four domains are a research seed. A fail-closed user-agent rule refuses live requests until MZIZI_USER_AGENT names a real monitored contact (none exists, so no live check was run). The IEBC recipe is exercised end to end against the saved markup with a mocked transport and a test assessment. Gaps: https://www.knbs.or.ke and https://www.treasury.go.ke did not answer (connection failed) from this machine and were not retried; new.kenyalaw.org and www.nairobi.go.ke answered with redirects that were not followed; so only three of the five intended pilots exist and only two are Kenyan government sites. IEBC serves HTML instead of robots.txt. No licences were found on the pages read. The jsonpath subset, one-slot patterns and listing-only discovery limit what bundles can express.

---
{id: TSK-8A0652B2AD28,name: Validate and export schema-aware draft CSVs through engine HTTP,type: task,status: planned,priority: medium,created_at: 2026-11-17T07:36:52.114Z,updated_at: 2026-11-17T07:44:49.981Z,order: 29696,depends_on: [TSK-583968232F6B],links: [{type: relates,task: TSK-C5499450BD6D}]}
---

# Validate and export schema-aware draft CSVs through engine HTTP

## Goal

Let a developer or API client prepare and validate draft CSVs against the selected generated table contract and existing portable reference data, then export the evidence-linked draft for owner review.

## Context

The portal design uses the IEBC office-location PDF as a backend-first example. The existing loader resolves identity paths and writes canonical data only on explicit application. The draft workflow should share the manifest package's validation and operate against a pinned reference snapshot, with a report that distinguishes table shape errors, unresolved or ambiguous links and fields with no representation in the target. Draft export cannot silently register a seed input or start a PostgreSQL write. Before implementation, settle the draft workspace and artifact-reference lifecycle and reuse the catalog and replay work.

## Acceptance checklist

- [ ] Provide typed HTTP operations to validate a draft and retrieve its report and evidence.
- [ ] Preserve IEBC location details outside any unsupported seed target and report the contract gap.
- [ ] Prove repeatable report and draft output from an HTTP client without canonical writes.

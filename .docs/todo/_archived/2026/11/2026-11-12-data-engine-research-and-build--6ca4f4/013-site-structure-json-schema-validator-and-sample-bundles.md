---
{id: TSK-C1DEFF5842A4,name: "Site structure JSON Schema, validator and sample bundles",type: task,status: completed,priority: medium,created_at: 2026-11-02T07:26:37.336Z,updated_at: 2026-11-02T09:02:31.988Z,due_at: 2026-11-13,order: 13312,extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-02T08:58:30.994Z},{from: in-progress,to: completed,at: 2026-11-02T09:02:31.988Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-C1DEFF5842A4/1793609910996-start,started_at: 2026-11-02T08:58:31.346Z,end_ref: refs/tracking/TSK-C1DEFF5842A4/1793610151990-end,ended_at: 2026-11-02T09:02:31.988Z,summary: {files: 36,insertions: 3808,deletions: 1}}]}},archived_at: 2026-11-12T05:47:56.094Z}
---

# Site structure JSON Schema, validator and sample bundles

## Goal
Define mzizi.site/v1 as a closed JSON Schema with static checks and a dry-run validator, plus two sample bundles, so agents have an exact target and the engine can reject invalid structures automatically.

## Context
Read .docs/docs/WEBSITE_DESIGN.md, .docs/docs/SITE_STRUCTURE_SPEC.md and .docs/decisions/website-schema-and-structure.md first. A site is not its domain: domains are dated and many per site. Work only on develop, record progress here and tick items with task check. The format is modular: a manifest, module files, mapping files, optional tags file, NOTES.md and saved example responses. It is declarative only, with no executable code and no natural-language rules. Authentication, CAPTCHAs and evasion are unsupported. The validator belongs to engine/data in Python.

## Acceptance checklist
- [x] JSON Schema files for manifest, module, mapping and tags, with unknown keys rejected.
- [x] Static checks: module references, known tags, mapping targets exist in the contracts, transforms in the library.
- [x] Dry run against examples applying each module's expect block.
- [x] Two sample bundles (one HTML listing, one JSON API) with NOTES.md, and tests for valid and invalid cases.

## Compliance (added after LEGALITY_SAFETY_AND_COMPLIANCE.md)
Extend the manifest schema with the machine-enforced policy block (assessment reference, allowed hosts, schemes and paths, rate, retries, limits, identification, robots, stop conditions, excluded data categories, purposes) and reject any bundle that contains secrets, cookies or tokens. Technical validity must remain independent of legal approval.

## Progress
Closed JSON Schemas (manifest incl. the policy block, module, mapping, tags), a Python validator with static checks, secret lint, NOTES requirement, dry run and family inheritance, a CLI, four sample bundles and 12 passing pytest cases. Limits: the jsonpath subset is minimal; XPath and next-link pagination are validated but only exercised once the runner lands; the dry run uses one saved example per module; tag proposals in tags.yml are only checked against known namespaces.

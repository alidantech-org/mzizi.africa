---
{id: TSK-5E448203A611,name: "Agent batch tooling, authoring guide and Kenya pilot structures",type: task,status: planned,priority: medium,created_at: 2026-11-02T07:26:37.627Z,updated_at: 2026-11-02T07:26:37.627Z,due_at: 2026-11-27,order: 15360}
---

# Agent batch tooling, authoring guide and Kenya pilot structures

## Goal
Let agents create site structures in batches: a CLI that submits a bundle, validates it, stores it as a new version with method attribution, and a written authoring guide; then author pilot structures for a handful of real Kenyan sites.

## Context
Read .docs/docs/WEBSITE_DESIGN.md, .docs/docs/SITE_STRUCTURE_SPEC.md and .docs/decisions/website-schema-and-structure.md first. A site is not its domain: domains are dated and many per site. Work only on develop, record progress here and tick items with task check. Agents create versions without human approval, so validation and live checks are the safety net. Each version needs an attributed method (agent, model, inputs) and a NOTES.md covering findings, gaps and limitations. Pilot sites should be Tier A sources from the intake plan, with licences verified and recorded.

## Acceptance checklist
- [ ] Batch CLI: submit, validate, publish a version, list versions, demote a version.
- [ ] Authoring guide for agents under .docs/guidance, with the tag vocabulary and transform library.
- [ ] Five pilot Kenyan site structures with notes, each passing dry run and a live check.
- [ ] Site, domain and publisher rows created for the pilots, including aliases and domain validity.
- [ ] Report gaps in the format found during authoring and update the spec.

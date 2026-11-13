---
{id: TSK-9C0388C92157,name: Agent-assisted manifest rule proposals,type: task,status: planned,priority: medium,created_at: 2026-11-13T10:12:18.654Z,updated_at: 2026-11-13T10:12:18.654Z,order: 6144}
---

# Agent-assisted manifest rule proposals

## Goal

Let agents propose manifest improvements from crawl evidence: new section and link rules, aliases, tags, mapping fixes after drift and purposes for low-confidence files, always as reviewable patches validated before activation.

## Context

Blocked until the assistive application in `source/backend/agent` exists and the engine job model, classification jobs and staging scratch area are in place. Agents act only through the engine API and produce Proposals stored as artifacts. Patches are validated against `mzizi.site/v1` schemas and dry-run against saved examples; approval follows the existing AI-or-human rule. Accepted and rejected proposals become labelled data for calibration and later fine-tuning.

## Acceptance checklist

- [ ] An `agent.manifest_repair` job kind consumes failed events and sampled pages and emits a manifest patch proposal.
- [ ] Patch proposals are validated and dry-run automatically and cannot activate without the required approval.
- [ ] Accepted and rejected proposals are recorded as labelled examples for the semantic index.
- [ ] The agent README and design guides describe the final tool surface.

---
{id: GRP-DC75BC77CC31,name: Documentation currency audit,type: documentation,extra: {created_at: 2026-11-12T06:00:22.028Z}}
---

# Audit plan

First inventory every Markdown file in `.docs/docs/` and `audits/`, read its frontmatter and opening/closing sections, and inspect all internal references from README, AGENTS, code READMEs and neighboring documents. Compare referenced source paths with the active `source/`, `dryv/`, `seed/` and `scripts/` layout; archives are historical evidence only. For each file, record its role, concrete stale claims, broken/missing code references, inbound links and a suggested KEEP, REVISE, HISTORICAL, MERGE or REMOVE disposition.

Keep this pass read-only with respect to the documentation set except for its Task record. Avoid changing runtime code, contracts, seeds, database content or `.github`. Produce an actionable summary and a complete per-file audit table. Validate the Task workspace after recording results and report existing repository-wide documentation-link failures separately from links introduced by a future cleanup.

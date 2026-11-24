---
{id: GRP-91A1F558A0AB,name: "Governance, institutions and content",type: documentation,extra: {created_at: 2026-11-18T11:15:23.614Z}}
---

# Governance, institutions and content plan

## Approach

Contracts first (Dryv), then generated models and SDKs, then hand-written reads, then the dev seed rows and texts. Texts are authored as markdown files; images are referenced by media code and resolved by the API. Details: `.docs/design/data/GOVERNANCE_AND_CONTENT.md`. The reads are covered by database-backed tests in `source/backend/api/test/modules/insights/reads` and by `scripts/dev/smoke.sh`, which run against the dev database built by `bun run dev:data`. Verification happens against that database because the arms, tiers and tabs are rows, not code.

## Milestones

1. Contracts and migration regenerated (institutions arm and basis, value position, contents and tags).
2. Seed: reference values, bodies, offices, relationships, mandates, effects, texts.
3. API reads, smoke checks, tests and documentation.

<!-- Ordered steps or phases. -->

## Risks and open questions

Acts of Parliament are not loaded as legal instruments with provisions, so an Act appears as a statement and not as an article to open. Performance bars exist only where votes or projects are recorded. People who hold offices are invented and tagged dev, and the texts are development text until they are checked against official sources. The database is rebuilt whenever the schema changes because person codes shift when seed rows are added.

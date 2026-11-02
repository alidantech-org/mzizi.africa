---
{id: DEC-AUTO-APPROVAL,name: Decision - approvals by an AI agent or a person,type: decision,tags: [data-engine,legal-gate,review,rbac]}
---

# Decision: approvals by an AI agent or a person

Date: 2026-11-02. Decided by the product owner. The earlier rule that only a named human may approve a site assessment, a dossier stage or a staged record cannot scale to the number of sites and documents Mzizi will meet, so it is removed.

## What changes

- **Any active account holding the permission may approve**: `assessment.approve` for assessments and dossier stages, `review.decide` for staged candidates, `candidate.promote` for promotion. The reviewer role now holds all of them; `access.manage` stays with admin. An AI agent is an ordinary account (`agent-mzizi` issuer, subject `mzizi-agent`) with a reviewer grant.
- **Trusted domains**: `fixtures/policy/trusted-domains.json` lists suffixes (today `.go.ke`) whose public sites the engine assesses and approves itself (`auto-assess <account>`). The scope is bounded: https, plain HTTP fetching, the site's own hosts, 0.2 requests per second, a one-year review date. A site with any domain outside the trusted suffixes is left alone. `advance-dossier <account> <jurisdiction> <stage>` moves a dossier, as a new row that supersedes the old one.
- **The gate still fails closed**: it needs a current approved assessment that names the approving account and a review date, a covering scope, rate limits, robots.txt, and a dossier at pilot or production. Only the word "human" is removed from the rule.

## What does not change (so approval stays trustworthy)

- Every approval and decision is a row naming the approving account and the rule applied; assessments and dossiers are append-only. Nothing is overwritten.
- AI-approved data keeps its method, source capture and extraction result. Records that fail an arithmetic or validation check are not approved (see the budget summary import: a table that does not add up under any OCR reading stages nothing).
- Personal data, restricted sources, a challenge, 401, 403 or 429 still stop collection. The incident `stop` command still works.
- The legal risk is now carried by the rules and the audit trail rather than by a person: review the trusted suffix list and the dossier open questions when opening a jurisdiction.

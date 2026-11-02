---
{id: TSK-2A15C7E9908D,name: "Priority publishers: Gazette, Parliament, Lands, Budget and Audit",type: task,status: planned,priority: medium,created_at: 2026-11-02T20:24:23.076Z,updated_at: 2026-11-02T20:24:23.076Z,order: 4096}
---

# Priority publishers: Gazette, Parliament, Lands, Budget and Audit

## Goal
Register and model the most important Kenyan public sources so each has an institution, a site, sections, expected document kinds and a first import.

## Context
Beyond ORPP, parties and NG-CDF, the product owner asked for the Kenya Gazette, Parliament (Acts, Bills, Hansard), the National Land Commission and lands registries, KNBS and IEBC statistics, procurement history, the Controller of Budget and the Auditor-General. Kenya Law is bot-challenge-gated and is reached only through official PDFs or allowed mirrors. Candidate sites include kenyagazette.go.ke, parliament.go.ke, nlc.go.ke, cob.go.ke, oagkenya.go.ke, knbs.or.ke, iebc.or.ke, orpp.or.ke and ngcdf.go.ke; every non-`.go.ke` host needs an explicit host rule and an assessment first. Each entry is seed data (custom-prepared from manual research) that guides automated fetching.

## Acceptance checklist
- [ ] Add institutions and site seeds with hosts, sections and expected document kinds for each publisher.
- [ ] Add exact-host rules and assessments for the non-.go.ke hosts.
- [ ] Probe and crawl each site within the gate and record outcomes per domain.
- [ ] Import Gazette notices and Acts into the legal schema with provenance.
- [ ] Import budget and audit reports as documents with extracted figures flagged for review.

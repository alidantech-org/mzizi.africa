---
{id: TSK-166220F2A41E,name: Paper-test the whole model on Kenya and two different countries before generation,type: task,status: planned,priority: medium,created_at: 2026-11-19T09:53:18.087Z,updated_at: 2026-11-19T09:53:18.087Z,order: 8192}
---

# Paper-test the whole model on Kenya and two different countries before generation

## Goal

A model that fits Kenya only is a Kenya database. Before the new contracts are generated, the full design must be tested on paper against Kenya and at least two structurally different systems, so every gap is found in review and not after seeds are written. The result is a recorded set of worked examples that become the acceptance tests for later seed work.

## Context

Kenya (the PDF) has: presidential head of state and government with a running mate; a bicameral legislature, constituency, women's and nominated members; a Senate with county seats and nominated seats; ex officio speakers; appointed Cabinet Secretaries and commissions; counties with an elected governor on a ticket and an assembly with ward members and special seats; national administration officers below county level; independent commissions beside the arms. Other systems to test, chosen by the owner from, for example: South Africa (party-list national assembly, provinces with premiers chosen by legislatures, municipal councils with ward and proportional seats), Nigeria (federal states, local government areas, senators per state), Ghana (district assemblies with elected and appointed members, regional ministers, chieftaincy), Ethiopia (regions, indirectly elected councils), Uganda (reserved seats). Contracts under test: `dryv/contracts/schemas/postgres/{governance,geography,politics,event,statistics,reference,official}.ts` plus the new tables from tasks 002 to 006.

## Method

For each country, write a small worked example in the review document: the institutions, positions with seat rules, links, functions, a place's resolution, and one election with its milestone events (`event.rules`, `Occurrences.knowledgeId`, `Schedules.basisProvisionId`). For each example, list the table and columns used. A requirement that needs a new column, a Kenyan word in a contract, or free text where data belongs is a failure to fix before approval. Include time: a constitution change that creates a level (for example county governments created in 2013), a boundary change (`geography.changes`), and an office that changes selection method.

Options: (a) written examples in a design document, recommended now; (b) executable fixtures loaded into the disposable `mzizi_test` database after generation, as a later check. Keep one scratch database only and drop extras (project rule).

## Acceptance checklist

- [ ] Choose with the owner the two comparison countries and record the choice.
- [ ] Add worked examples for patterns (county governments, ward seats, cabinet, site candidates), for powers (a judge, a removal), for a joint-venture contract with an amendment, for a supplier-owner-officeholder chain with graded evidence, and for a promise with and without a record (tasks 010 to 015).
- [ ] Write the Kenya example in full for the leadership tree (all four selection classes), the ward ladder, the two-government view and one institution page.
- [ ] Write the two comparison examples to the same depth and list every difficulty found.
- [ ] Fix each difficulty by changing the contract design or by recording a deliberate exclusion with a reason; update tasks 002 to 007 accordingly.
- [ ] Confirm by search that no contract file contains a place name, an office title or a legal article number.
- [ ] Owner sign-off recorded in `.docs/decisions/`; run `task validate`.

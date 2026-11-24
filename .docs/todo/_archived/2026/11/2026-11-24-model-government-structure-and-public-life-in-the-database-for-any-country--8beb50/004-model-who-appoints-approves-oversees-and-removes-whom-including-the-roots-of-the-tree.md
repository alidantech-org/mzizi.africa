---
{id: TSK-D37B397A574D,name: "Model who appoints, approves, oversees and removes whom, including the roots of the tree",type: task,status: archived,priority: medium,created_at: 2026-11-19T09:53:16.316Z,updated_at: 2026-11-24T19:24:21.236Z,order: 4096,extra: {status_history: [{from: planned,to: archived,at: 2026-11-24T19:24:21.236Z}]},archived_at: 2026-11-24T19:25:18.937Z}
---

# Model who appoints, approves, oversees and removes whom, including the roots of the tree

## Goal

The tree, family tree, radial chart, hierarchy map and three-arms screen all draw typed connections: the President appoints judges on the Judicial Service Commission's advice, the National Assembly approves, a selection panel nominates, the Governor answers to voters and the county assembly, a Deputy runs on the same ticket as the Governor, removal is by a stated process, and "The People" and "The Constitution" sit above everything. The database can only link one institution to another institution with an untyped kind. This task adds the missing links so any government's hierarchy and checks and balances can be stored once and drawn in every view.

## Context

`governance.relationships` (`dryv/contracts/schemas/postgres/governance.ts:116-134`) has `subjectInstitutionId`, `objectInstitutionId` and `relationshipKindId`, unique on the triple, with a rule against self reference and a citation, but the kind has no scheme tag (see task 002) and it cannot express links where one side is a position (Governor, President), the electorate, or the constitution. `Institutions.armId` (26-48) records the arm. `Obligations` (161-196) already capture "reports to" and "publishes to" as duties with a basis provision, frequency and recipient; accountability of that kind should keep using it. `legal.provisions` gives the article that creates each link. The PDF also needs the root nodes ("The People of Kenya", "Constitution, Article 2") and the group nodes (Executive, Parliament, National administration) that are not offices.

## Method options

A. Extend `governance.relationships` to accept a position or institution on either side, with an exactly-one rule per side. Smallest change, one place for all links; Dryv already supports `rule.exactlyOne` across several columns (used in `dryv/contracts/schemas/postgres/official.ts:140-172`), so this is not a Dryv gap. Task 012 now owns the rights model (`governance.powers`: who may initiate, nominate, approve, appoint, remove, with procedure steps and thresholds); this task keeps the structural links (part-of, ticket pairing, reports-to, the sovereign roots) and must not create a second table that overlaps `powers`. Decide in review whether structural links are a vocabulary of `powers` or stay in `relationships`.
B. Add `governance.powers` for position to position and position to institution, and keep `relationships` for institution to institution. Two tables, simple constraints. Recommended if A needs engine work.
C. A generic polymorphic reference with a type column. Rejected by the typed-contract rules: no free-form targets.

Roots: model "the electorate" and "the constitution" as institution rows of dedicated kinds (task 002) with `establishmentBasis` and a legal source, rather than special cases in code. Group nodes are institutions linked by `part-of`; the tree is `part-of` plus positions per institution plus links.

Add to each link: `basisProvisionId` (the article), `sourceCitationId`, optional `groundsProvisionId` for removal, a period (links change when constitutions change), and `displayOrder`. Plain-language sentences (the "Reports up to" and "Works with" lines) are copy keyed by link code, not columns.

## Neutrality checks

Express with rows only: an executive president, a parliamentary prime minister answerable to the legislature, a monarch as head of state, a federal state governor removed by a state legislature, a chief appointed by a customary body, a constitutional court with no executive appointer.

## Acceptance checklist

- [ ] Decide A or B in a decision record after testing generation of the exactly-one rule across position and institution columns, and agree with task 012 which table holds rights and which holds structure.
- [ ] Author the link table or changes in `governance.ts` with kind scheme tag, provision and citation references, period fields, uniqueness and anti-self-reference rules.
- [ ] Define how the two display trees are derived (institution part-of tree, positions under each institution, reports-up and works-with lists) and that no ordering is hard-coded.
- [ ] Model ticket pairing (`runs-with`) and show how a deputy's election and removal follow the head's.
- [ ] Define institution kinds for the sovereign roots and confirm both can be loaded for any country.
- [ ] Paper-test the arms-of-government arrows (legislature checks executive and the reverse, judiciary shapes) as link rows with article citations.
- [ ] Owner review and approval recorded before generation; run `task validate`.

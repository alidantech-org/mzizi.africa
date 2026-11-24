---
{id: TSK-9CEC51D54EC4,name: Model which level of government is responsible for which public function,type: task,status: archived,priority: medium,created_at: 2026-11-19T09:53:16.847Z,updated_at: 2026-11-24T19:24:27.627Z,order: 5120,extra: {status_history: [{from: planned,to: archived,at: 2026-11-24T19:24:27.627Z}]},archived_at: 2026-11-24T19:25:18.937Z}
---

# Model which level of government is responsible for which public function

## Goal

The "Who handles what for you" table says local roads, dispensaries, early childhood education and markets belong to county government, while police, public schools, ID documents and national roads belong to national government, and land titles are shared, with a plain "start with" contact for each. Every federal or devolved system divides functions this way, but the database has nowhere to record the division. This task adds a country-neutral model of public functions and who is responsible, with the law that assigns them.

## Context

`civic.services` (`dryv/contracts/schemas/postgres/civic.ts:26-52`) records one provider's service at a place or coverage unit, with `responsibleInstitutionId`; it describes delivery, not the constitutional or statutory split. `governance.mandates` (governance.ts:90-113) assigns a described responsibility to one institution or one office, with a free description and an untagged `mandateKindId`; it has no shared structure, no function identity, and no way to say "county" as a class of body rather than one institution. `Obligations` already solve a similar problem for duties by allowing either one institution or a kind of body (`obligorInstitutionId` or `obligorKindId`, governance.ts:164-182), which is the right neutral pattern to reuse. `reference.Topic` (reference.ts:300-) is the cross-domain topic tree. The legal provision that allocates each function is `legal.provisions`.

## Proposed contract

- `governance.functions`: `code`, `countryId`, `parentFunctionId` (self, so a schedule can nest), `topicId` (reference Topic), `basisProvisionId`, `sourceCitationId`, period fields. The name and the plain "if you need" phrasing are copy keyed by code.
- `governance.assignments`: `functionId`, `responsibleInstitutionId` or `responsibleKindId` (a body class from task 002, as obligations do), `shareId` (scheme gov.responsibility.share: exclusive, shared, concurrent), `startPositionId` or `startInstitutionId` (the "start with" office), `basisProvisionId`, `sourceCitationId`, period fields, and a rule that at least one responsible form is set.

## Method options

A. New functions and assignments tables. Recommended: a function is stable while assignments change with constitutions and court rulings.
B. Reuse `mandates` with a function code. Possible, but mandates are tied to one institution or office and carry free text; we would lose the class-of-body form and the shared/exclusive split.
C. Reuse `civic.services`. Rejected: that is service delivery at a place.

Link functions to civic service kinds and facility classes only where useful (for example dispensary to a health function) through a reviewed relation, not by embedding kinds in the function row.

## Neutrality checks

Express with rows only: a federal country with exclusive federal, exclusive state and concurrent lists; a unitary country with deconcentrated local government; a country where a metropolitan authority holds transport but the province holds health.

## Acceptance checklist

- [ ] Author `Functions` and `Assignments` in `governance.ts` with descriptions, indexes (`countryId`, `parentFunctionId`, `functionId`, responsible institution and kind), the "at least one responsible form" rule and the self-parent acyclic rule.
- [ ] Decide how a class of body is named (reuse `gov.obligor.kind` or add `gov.responsible.kind`) and record why.
- [ ] Define how a screen finds the responsible body for a place: function assignment to body class to the authority scope covering that place (`AuthorityScopes`, governance.ts:137-158).
- [ ] State where plain-language need phrases live (copy rows) and confirm no phrase is stored in a column.
- [ ] Paper-test three structurally different countries and one function that changed hands over time.
- [ ] Owner review recorded; run `task validate`.

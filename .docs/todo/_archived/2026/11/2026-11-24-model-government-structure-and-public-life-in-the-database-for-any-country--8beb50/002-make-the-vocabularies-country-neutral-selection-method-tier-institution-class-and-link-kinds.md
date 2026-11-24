---
{id: TSK-FF4160600055,name: "Make the vocabularies country-neutral: selection method, tier, institution class and link kinds",type: task,status: archived,priority: medium,created_at: 2026-11-19T09:53:15.521Z,updated_at: 2026-11-24T19:24:09.391Z,order: 2048,extra: {status_history: [{from: planned,to: archived,at: 2026-11-24T19:24:09.391Z}]},archived_at: 2026-11-24T19:25:18.937Z}
---

# Make the vocabularies country-neutral: selection method, tier, institution class and link kinds

## Goal

The design classifies every office as elected, nominated, appointed or ex officio, groups institutions into constitutional commissions, service commissions, independent offices, regulators, security services and so on, and draws typed connections (appoints, approves, nominates, oversees, funds, audits, reports to, runs on one ticket with, removable by). Today the database cannot say any of this. This task defines the controlled vocabularies, as reference schemes in the seed, so that every later table can point at them and so that other countries add values rather than columns.

## Context

What exists (citations in `dryv/contracts/schemas/postgres/`):

- `governance.offices.officeKindId` is an untagged value reference (governance.ts:54) and the only office scheme in `seed/data/global/reference/schemes.csv` is `gov.office.kind`. Its values (`seed/data/global/reference/values/gov.values.csv`) mix two different questions: the role (`head`, `deputy`, `member`, `secretary`, `chairperson`) and how it is filled (`elected`, `appointed`). There is no nominated and no ex officio value, so the second axis is incomplete and shares a field with the first.
- `Holders.appointmentKindId` (governance.ts:75), `Mandates.mandateKindId` (94), `Relationships.relationshipKindId` (120) and `AuthorityScopes.authorityKindId` (143) carry no `scheme:` tag and no scheme with those names exists in `schemes.csv` (the gov schemes there are institution.kind, office.kind, arm, establishment.basis, agenda, bill, motion, obligation, report, sitting, speech, stage, term, vote). So today these four columns have nowhere to take values from.
- Kenya-shaped values: `gov.arm.devolved-government`, `gov.institution.kind.county-government`, `gov.term.kind.ward`, `gov.term.kind.county-assembly`, `gov.term.kind.presidential`.
- `Value` (reference.ts:118-157) already supports `parentId` (a value has one broader value in its scheme), `supersedesId`, `position` (display order), `iconCode` and `colorToken` (theme token, never a raw colour). `ValueRelation` (reference.ts:328-347) links values across schemes. `Copy` (reference.ts:349-) holds wording per language and optional country.

## Proposed vocabularies (each needs owner approval before any seed row is added)

1. `gov.selection.method`, with display classes as parents using `Value.parentId`: class `elected` (children direct election by unit, party-list allocation, indirect election by a body), class `nominated` (named by a party or body then confirmed), class `appointed`, class `ex-officio`, plus `customary` for hereditary or traditional authority. The four chips in the PDF are the parents; `iconCode` and `colorToken` give the marker and chip colour so no screen keeps its own map.
2. `gov.position.role`: head, deputy, presiding officer, member, administrator, adjudicator. Takes over the role half of today's office kind.
3. `gov.institution.class`: a hierarchy (constitutional commission, service commission, independent office, regulator or state corporation, security service, court, house of legislature, subnational government, ministry) so the Institutions sidebar groups come from data. This extends `.docs/design/data/PUBLIC_BODIES_CLASSIFICATION.md`.
4. `gov.link.kind`: appoints, approves, nominates, oversees, funds, audits, reports-to, runs-with (a joint ticket), removable-by, checks, part-of, answers-to. Each has a short definition value-label (the "Words used on the connections" panel).
5. `gov.responsibility.share`: exclusive, shared, concurrent (used by task 005).
6. Schemes added by the later tasks and reviewed here for naming and codes: `gov.evidence.status` (expected, sourced, verified, not-found, disputed), `gov.pattern.kind` (task 010), `src.domain.status` (011), `gov.power.kind` and threshold kinds (012), `civ.contract.role` (013), `ofc.relationship.kind` with evidence basis (014), promise status and promise link kind (015). `official.relationships.kindId` currently has no scheme at all. Keep one evidence-status vocabulary for every table instead of per-table flags.
7. Scheme tags: add the missing `scheme:` tags and schemes for `appointmentKindId`, `mandateKindId`, `authorityKindId`, institution `relationshipKindId`.

## Method options for the Kenya-shaped values

A. Supersede with neutral values (`devolved-government` becomes `subnational-government`) using `supersedesId`. Recommended, preserves history.
B. Leave Kenyan values and add neutral parents with `ValueRelation`. Acceptable for terms where the Kenyan name is the legal name.
C. Make schemes country-scoped (a country column on `Value`). Rejected for now: it hides shared meaning and complicates codes; use `Copy` with a country for wording instead.

## Acceptance checklist

- [ ] Draft the scheme and value lists as CSV proposals in a review document, not in `seed/`, and show them to the owner; record approvals and refusals in `.docs/decisions/`.
- [ ] Write the final scheme and value rows only after approval, following `.docs/rules/codes.md`, then run `uv run mzizi-manifest check`.
- [ ] Add the missing `scheme:ref.sch.*` tags to `appointmentKindId`, `mandateKindId`, `authorityKindId` and the institution `relationshipKindId` in `governance.ts`.
- [ ] Decide and record the fate of `gov.office.kind` (split into role and selection method) and each Kenya-shaped value (supersede, keep with a neutral parent, or retire).
- [ ] Add copy keys for every value label and definition the screens show; wording rows go in `reference.copy`.
- [ ] Verify no new value or scheme code contains a country name, a place name or an article number.
- [ ] Run `task validate`.

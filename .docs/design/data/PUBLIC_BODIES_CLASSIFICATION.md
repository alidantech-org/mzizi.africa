---
id: DOC-PUBLIC-BODIES-CLASSIFICATION-20261115
name: PUBLIC_BODIES_CLASSIFICATION
type: documentation
tags: [institutions,governance,classification,comparison,proposal]
---

# Public bodies: classification, control and comparison

**Status: proposal, 15 November 2026. Nothing here is implemented or approved.** It supports the civic accountability pilot in [ROADMAP](../../docs/ROADMAP.md) and is built on the Phase 01 schemas in the [design catalogue](../../_plan/.old/schema-redesign/README.md); it adds no schemas. The delivery plan, risks and open questions are in the [planning proposal](../../_plan/guides/public-accountability-map-and-international-comparison.md). Related: [DATABASE_DESIGN](DATABASE_DESIGN.md), [SOURCING_DESIGN](SOURCING_DESIGN.md), [PEOPLE_DESIGN](PEOPLE_DESIGN.md).

## Goal

Describe any public body in any country by facts that can be sourced and compared, instead of by its name, its web domain or one fixed hierarchy. A reader should be able to say what law created a body, what job it does, who controls it, and what it costs, with every statement traceable to evidence.

## Rules

- Classification comes from the **founding instrument**, never from a body's name, abbreviation or domain. A domain such as `.go.ke` or `.or.ke` is stored as a fact about the body and is not evidence of its legal status.
- Each attribute below is independent and carries its own source, retrieval time and uncertainty. Model-assisted classification is a reviewable proposal, not canonical data.
- Bodies that are merged, renamed or abolished keep their records and link to successors. Control relationships are time-bounded.
- Country-specific knowledge (which Kenyan bodies exist, which Act created them) lives in seed inputs and database records, not in generic package code.

## Attributes of a body

| Attribute | Values or meaning |
|---|---|
| Legal basis tier | Constitutional, statutory (Act of Parliament), subsidiary or executive (regulation, order, notice) |
| Function type | Policy, regulation, service delivery, commercial delivery, oversight or investigation, adjudication, representation, advisory, financing |
| Level | National or sub-national (county in Kenya) |
| Branch | Executive, legislative, judicial or independent |
| Legal form | Commission, authority, state corporation, ministry, tribunal, council, company |
| Web domain | A recorded fact only; a weak hint |

Tier matters because it fixes how a body can be removed: a constitutional body needs an amendment, a statutory body needs an Act, an executive body can be changed by executive action. In Kenya, for example, the Chapter 15 commissions are constitutional, while bodies such as EACC and NCIC are established by Acts and are statutory even though they are often called independent commissions.

## Control levers

Control is recorded as typed, time-bounded relationships rather than a single "parent" link:

| Lever | Relationship types |
|---|---|
| Appointment | appointed by, board selected by |
| Money | funded by, levy funded |
| Accountability | reports to, audited by, overseen by |
| Law | established by, amended by, abolished by |

A body is more independent when no single person holds all four levers. Five questions place any body: what law created it, what job it does, who appoints its head and board, who funds it, and who it reports to.

## Money and evidence

Attach budget against actual spending, audit opinions and queries, pending bills, wage bill as a share of revenue, and development budget absorbed. Show whether each claim is claimed, partly verified or verified against an official record. Publish only audited findings and official records; keep allegations separate from findings.

## Comparison across countries

Compare bodies by function, not name: anti-corruption agencies, supreme audit institutions, procurement regulators, electoral bodies, revenue authorities and revenue-sharing arrangements. Constraints:

- Describe association, not cause; show other major events in the same period.
- Rank only within documented peer groups; avoid a single league table.
- Record each indicator's source, year, type (perception or measured) and licence.
- Include failed and reversed reforms.

Where foreign institutions and country-level indicators belong in the schema catalogue is an open decision for the owner.

---
id: DOC-MZIZI-ACCOUNTABILITY-MAP-20261115
name: Public accountability map and international comparison
type: architecture-proposal
tags: [accountability, institutions, kenya, comparison, governance, public-finance]
extra:
  status: working_proposal
  approval: not_approved
  implementation: not_authorized
  recorded_on: 2026-11-15
---

# Public accountability map and international comparison

> **STATUS: PLANNING PROPOSAL.** Nothing here is approved for SQL, migrations, API work, seed data or deployment. It describes a product direction built on the existing Phase 01 civic accountability schemas and does not add schemas. Figures quoted from the originating discussion are **unverified orders of magnitude** and must be replaced by sourced values before anyone cites them.

## 1. Purpose

A newcomer to Kenya cannot easily answer four basic questions: what public bodies exist, why they exist, who controls them, and what they cost and deliver. No single official register answers them. This proposal defines a source-linked **map of public bodies and public money** for Kenya and a **comparison layer** that sets Kenya's institutional designs and outcomes beside other countries. The aim is to make the system visible, which is the precondition for voters, courts, auditors and the press to act. It does not claim that information alone reduces corruption.

## 2. Origin and boundaries

This record comes from an explanatory discussion on how Kenya's government is organised (2010 Constitution, two levels of government, independent commissions, state corporations, county bodies). Statements about headcounts, budget shares and county comparisons were given from memory with explicit caveats and are not evidence. The claim that a particular county built 32 hospitals was **not verified** and is treated as an example of a claim to be checked against the Ministry of Health facility register and audit reports.

Fit with the repository rules (`AGENTS.md`):

- Every classification and indicator keeps its source, retrieval time and uncertainty.
- Model-assisted classification (for example "this body is an anti-corruption agency") is a **reviewable proposal**, not canonical truth.
- Historical bodies keep their records when merged, renamed or abolished; they link to successors.
- Source-neutral rules stay in contracts and manifests. Publisher- and country-specific knowledge lives in seed inputs and database records, never in generic package code.

## 3. Classification model for public bodies

Do not force bodies into one tree. Each body is described by several independent attributes, each with its own source.

### 3.1 Legal basis tier

| Tier | Created by | Removable by | Examples (Kenya) |
|---|---|---|---|
| Constitutional | The Constitution | Referendum or constitutional amendment | Parliament, Judiciary, IEBC, PSC, JSC, SRC, TSC, NLC, CRA, NPSC, Commission on Administrative Justice, Auditor-General, Controller of Budget, DPP, Central Bank of Kenya |
| Statutory | An Act of Parliament | A later Act | EACC, NCIC, IPOA, ORPP, KRA, NTSA, PPRA, KEBS, KenGen, county water companies |
| Subsidiary or executive | Regulation, Executive Order, Gazette notice | Executive action | Task forces, many councils, restructured state departments |

The Constitution lists the Chapter 15 commissions; EACC and NCIC are **not** among them even though they are widely called independent commissions. The classification must come from the founding instrument, never from the body's name or web domain.

### 3.2 Function type

Policy, regulation, delivery (service or commercial), oversight and investigation, adjudication, representation, advisory, financing. A sector usually separates these roles. Water is the model case: ministry (policy), resource authority, regional works agencies, a regulator (WASREB), service providers (including county-owned companies), a tribunal and a trust fund.

### 3.3 Other attributes

Level (national or county), branch (executive, legislative, judicial, independent), legal form (commission, authority, state corporation, ministry, tribunal, council, company), and web domain. The domain (`.go.ke`, `.or.ke`, `.co.ke`, `.ac.ke`) is recorded as a fact about the body. It is a weak hint only: some independent commissions use `.or.ke`, some state corporations use `.co.ke`.

### 3.4 Control levers as typed, time-bounded relationships

Control is read from four levers, each a relationship with validity dates:

| Lever | Relationship |
|---|---|
| Appointment | `appointed_by`, `board_selected_by` |
| Money | `funded_by`, `levy_funded` |
| Accountability | `reports_to`, `audited_by`, `oversight_by` |
| Law | `established_by`, `amended_by`, `abolished_by` |

A body is more independent when no single person holds all four levers.

### 3.5 Five questions that place any body

1. What law created it?
2. What job does it do?
3. Who appoints the head and board?
4. Who funds it?
5. Who does it report to?

## 4. Phased delivery

All phases remain proposals until the owner approves scope, sources and the target schemas.

### Phase A — Registry of public bodies

Capture each national body and each of the 47 counties with legal basis, function type, parent, appointing authority, funding source, reporting line, board size and staff size. Start with one sector (water or roads) as a pilot, then widen. Sources: Kenya Law, the Kenya Gazette, the founding Acts, State Corporations Advisory Committee material, each body's annual report. Output is evidence-linked records, with unknowns left explicit.

### Phase B — Money trace

For each body and county: budget against actual spending (Controller of Budget), audit opinion and queries (Auditor-General), pending bills, wage bill as a share of revenue, development budget absorbed, and own-source revenue against target. Flag bodies with overlapping statutory mandates by comparing the founding Act text; models may suggest candidate overlaps, and a person reviews each.

### Phase C — Plain-language scorecards and claim checking

County comparisons use spending per person, facilities delivered (from the Kenya Master Health Facility List), audit findings and wage ratios. Every public claim shown carries a label: **claimed**, **partly verified**, or **verified against an audit or official register**, so a promise sits beside the record.

### Phase D — Citizen and research use

County budget explainers ahead of public participation, change alerts on audit opinions and pending bills, open data exports for journalists and researchers. Prefer partnership with existing bodies (Controller of Budget, Auditor-General, civil society groups that already track budgets) over duplicating their work.

## 5. International comparison layer

### 5.1 Shape

Three linked layers:

| Layer | Content |
|---|---|
| Institutions | A body in any country, classified by **function**, with design attributes (legal basis, appointment, funding, reporting) |
| Outcomes | Indicators per country and year, each with source, vintage and licence |
| Reform events | What changed and when, with indicators before and after |

Classifying by function allows comparison across names: anti-corruption agencies, supreme audit institutions, procurement regulators, electoral bodies, revenue authorities, devolution and revenue-sharing arrangements.

### 5.2 Candidate indicator sources

| Area | Source |
|---|---|
| Governance quality | World Bank Worldwide Governance Indicators; V-Dem |
| Perceived corruption | Transparency International CPI |
| Budget transparency | International Budget Partnership Open Budget Survey |
| Public finance management quality | PEFA assessments |
| Procurement | Open Contracting Partnership data |
| Rule of law | World Justice Project |
| Africa-specific | Mo Ibrahim Index, Afrobarometer |
| Economy, population, health | World Bank, IMF, UN, OECD |
| Wellbeing | World Happiness Report |

Licence terms vary and must be recorded per dataset before use.

### 5.3 Comparator set (starting proposal, for review)

African success cases (Botswana, Mauritius, Rwanda), African peers (Ghana, Tanzania, Uganda, South Africa, Nigeria), and cases from other regions (Singapore, South Korea, Estonia, Georgia, Indonesia, Costa Rica). Include reversed and failed reforms so the set does not show only successes.

### 5.4 What the layer may and may not claim

| Risk | Rule |
|---|---|
| Correlation presented as cause | Use "associated with"; show other major events in the same period |
| Perception indices read as measured corruption | Show source type; combine several indicators |
| Similar bodies on paper behave differently | Compare design and track record together |
| Unfair league tables | Rank only within documented peer groups (income, size, structure) |
| Data lag or gaps | Always show the data year; show "no data" |
| Survivorship bias | Include failures and reversals |
| Missing context | Attach a short case note to each comparison |

The comparison output should be a descriptive profile, not a single national ranking.

## 6. Reform options the data could inform

These are policy ideas raised in discussion. They are not project goals and the system takes no political position; each should be evaluated against evidence the system holds.

1. Periodic sunset reviews of statutory bodies, with merger of those whose mandates overlap.
2. Published performance targets and results for state corporations.
3. Enforced county wage-bill ceilings.
4. Open contracting data for tenders above a threshold.
5. Published criteria and shortlists for board appointments.
6. Stronger whistleblower protection.

## 7. Risks and safeguards

| Risk | Safeguard |
|---|---|
| Defamation or unfair attribution | Publish only audited findings and official records; separate allegation from finding; keep the source with each statement |
| Incomplete or late public data | Show gaps openly; track which bodies fail to publish |
| Political capture or perceived bias | One fixed method and the same indicators for every body; public methodology |
| Data has no effect | Pair with media, courts, auditors and civil society that can act |
| Scope creep into Phase 02 schemas | Keep to approved Phase 01 schemas; propose additions separately |

## 8. Fit with the existing design

Placement against the current phased catalogue (`.docs/_plan/schema-redesign/README.md`) needs owner confirmation; the likely alignment is:

| Need | Likely home (unconfirmed) |
|---|---|
| Bodies, mandates, offices and tenure | Governance and Official (Phase 01) |
| Legal basis and provisions | Legal, reached through Reference (Phase 01) |
| Counties, wards, constituencies, coverage | Geography (Phase 01) |
| Budgets, expenditure, pending bills, audit amounts | Finance (Phase 01) |
| Tenders and contracts | Procurement or Civic (Phase 01) |
| Source documents and evidence | Source and Filesystem (Phase 01) |
| Derived scorecards and comparisons | Accountability (derived, read-only) |
| Cross-country comparators and indicators | **Open**: needs a decision on whether foreign institutions and indicators fit Phase 01 or require Phase 02 |

The legal-basis tier, function type and control-lever relationships above may map to reference classifications and typed relationships rather than new tables. This must be checked against the Phase 01 contracts before any design is drafted.

## 9. Open questions

1. Which sector pilots Phase A (water, roads, health or another)?
2. Is a national and county-wide registry in scope now, or only the pilot sector?
3. Where do foreign institutions and country-level indicators live in the current schema catalogue?
4. Which indicator sources are licensed for redistribution and in what form?
5. Who reviews classifications and overlap flags, and under what approval workflow (see the data-engine approval decision)?
6. How are scorecards worded to keep findings separate from opinion?
7. Which existing Kenyan initiatives should be linked or partnered with rather than rebuilt?

## 10. Success measures

- Share of national bodies and counties mapped with sourced legal basis and control levers.
- Share of mapped bodies with an audit opinion and budget data attached.
- Number of overlapping mandates identified and reviewed by a person.
- Number of comparator countries with sourced indicators and reviewed case notes.
- Reuse by journalists, researchers and civil society; any reform that cites the data.

## 11. Next steps (for the owner to direct)

1. Confirm pilot sector and whether this proposal should become a task group.
2. Check the Phase 01 contracts to confirm or correct the placement table above.
3. Verify the Kenyan figures cited in discussion (headcount, budget shares, county allocations) against the latest Economic Survey, budget documents and Controller of Budget reports before they enter any document or dataset.
4. Choose the first three institution functions for the international comparison.

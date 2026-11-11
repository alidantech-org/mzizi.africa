---
id: DOC-8F3C5B62DE19
name: Procurement domain schema redesign
type: documentation
tags: [improvements, schema-redesign, procurement, parties, geography, planning]
extra: {status: planning_only, design: explicitly_unapproved}
---

# Procurement — procuring entities, bidders, suppliers, awards and contract geography

**PLANNING ONLY. IMPORTANT: The user specifically withheld approval of the suggested procurement party/table design and wants further discussion.**

## User's problem and initial direction

Existing Kenya PPIP/e-GP and OCDS-style procurement data contain procuring entities and suppliers that are not consistently linked to MZIZI's canonical institutions/organizations and appropriate geographic units. The user wants true queryable links and better contract data, including contract type, responsible parties, values, dates and implementation information. They leaned toward canonical `organization.entities` for both procuring entities and suppliers, with `procurement` representing their participation and transactions, **but also suggested straightforward direct procurer/supplier FK columns and asked for tradeoff evaluation**.

Do not equate procuring authority, buyer, finance unit, contracting office, bidder, awardee, supplier, subcontractor, headquarters, registered jurisdiction and delivery/project location. The organization legally registered in Nairobi may supply a contract delivered elsewhere. A ministry's legally national scope does not mean its HQ or a construction site is nationwide.

## Five active tables: preserve and examine their real fields

| Existing table | Review focus |
|---|---|
| `procurement.tenders` | Issuer/procurer, official ref code, tender version, method/type, publication/closing dates, price estimate and applicable legal/financial rules. |
| `procurement.bids` | Bidder canonical organization, tender FK, offer amounts/currency, submission time, bid validity, stage/status and evidence. |
| `procurement.contracts` | Awarded legal entity, contracting finance unit/office, tender link, contract type, signed/effective/end dates, original/current amount, status and valid history. |
| `procurement.milestones` | Expected deliveries, due dates, completion evidence, actual performance and delays. |
| `procurement.variations` | Price/scope/term/date amendments, actor, approval basis, difference from prior contract version. |

**Verified examples from current model:** `tenders.issuing_unit_id`, optionally `procuring_office_id`; `bids.bidder_entity_id`; `contracts.awarded_entity_id`, `contracting_unit_id` and optionally `contracting_office_id`. Audit every other current TypeORM field (including late tender-version migration) before final column decisions. Avoid duplicating canonical organizations in procurement-specific entity tables.

### Candidates to debate, NOT approved

| Potential table | Why it may be needed | Alternative |
|---|---|---|
| `processes` | One procurement lifecycle can include multiple notices, awards and contracts; common official stable ID such as OCID. | Existing tender could own lifecycle if 1:1 and real sources justify it. |
| `awards` | Award decisions may precede contracts or cover multiple recipients; distinct value/date/status. | Award fields embedded in contract only when consistently 1:1. |
| `parties` | Multi-role/multi-organization association to process, award and contract. | Explicit direct buyer/procurer/supplier columns for truly singular roles. |
| `items` | Goods/works/services, quantities/classification. | Use tender/contract line items only if needed by source data. |
| `locations` | Multiple project/delivery geographic sites distinct from supplier HQ. | A singular project geo FK when one delivery area is reliably established. |

**Assistant recommendation pending user review:** A *hybrid* of direct FKs for genuinely singular common roles and FK-backed participant junction tables for multiple bidders, suppliers or contracting parties. Never mark this architecture approved simply because it is proposed here.

## Legal, geographic, financial and identity references

Require proper cross-schema FKs to `organization.entities` for procuring/supplying/bidding identities, `governance.institutions/offices` for public authority roles, `finance.units` for budgetary liability, `geography.units/places` for contract implementation, and `legal` rule/provision when relevant. Distinguish registration location, HQ, buyer jurisdiction, geographic beneficiary and contract delivery location. Match PPIP identifiers through `organization.identifiers` with verified issuer/scheme/value, not names alone.

Geographic resolution order: (1) authoritative explicitly given unit/site; (2) independently verified institutional relationships; (3) candidate inference requiring review; (4) unresolved instead of fabricated county. Preserve separate evidence for buyer identity and supplier address. Link publication and documents through `source` and `filesystem`; source bytes are not contract table fields.

## Acquisition and pattern eligibility

- **1A:** verified registries of public procuring entities, official procurement methods/classes and institutional identities.
- **1B:** legally expected procuring units or recurring procurement reporting structures, not imaginary tenders or awards.
- **2A:** official notices, bids, award publications, contracts, variation notices, supplier identifiers and delivery sites.
- **2B:** bidder competition, contract value changes, spend by county/sector/issuer and performance ratios with documented methods.

Use content hashes, portal IDs, stable aliases, dated records, reviewed conflicts and source links. Reprocessing an unchanged contract notice should not create a duplicate record; corrected contract data need supersession history.

## Grounded implementation starting points and risks

The repository importer `.docs/_archives/2026-11-08-rewrite-snapshot/source/backend/engine/data/src/mzizi_data/imports/procurement.py` already stages procuring entities and organizations, optional official county data, tender and contracts. Audit exactly when it writes the organization's geo_unit_id, the source address and the procuring unit's service scope; previous code risks conflating location and jurisdiction. Compare portal outputs to canonical target relationships and hard FKs, then plan non-destructive reconciliation, not silent reseeding.

Test: Same supplier bidding for contracts in different counties, joint award recipients, national procurer with local contract site, contract variation to date/value, explicit winning vs losing bidders, and provenance-based correction of a wrongly assigned county.

## Decisions explicitly reserved to the user

1. Should each tender/contract have direct `procuring_entity_id`/`supplier_id` columns, a party association table, or both? **NOT APPROVED.**
2. Exactly which contract types, dates, money fields, legal classifications and statuses are required?
3. Distinct procurement process, award, contract and tender identity: which tables are necessary?
4. How to represent multiple suppliers, subcontractors, joint ventures and multiple delivery geographies?
5. PPIP/e-GP/OCDS source mapping and institution-vs-budget-unit role separation?
6. Which automatic matching/correction thresholds and supporting evidence are acceptable?

**References:** [Master register](../mzizi-data-schema-storage-and-pipelines-redesign.md) · [Organization](organization.md) · [Finance](finance.md) · [Geography](geography.md).

## Human review — editable user notes and design sign-off

**Review status:** `NOT REVIEWED` — AI-authored proposals in this document are not final approval.

**In my own words, what this schema should represent and exclude:**

> _My understanding and questions:_

**Tables/columns I want to keep, rename, move, merge, split, remove or add (and why):**

> _My proposed changes and alternative names:_

**Hard foreign keys, geographical and legal scope, pattern generation, classification and evidence I want changed or explained:**

> _My technical feedback, disagreements and alternatives:_

**Real data and queries I want to use to validate this design:**

> _My examples and expected results:_

**Unresolved decisions I want to discuss further:**

> _My remaining questions:_

**Final user decision:** `NOT DECIDED` / `NEEDS CHANGES` / `DESIGN VALIDATED BY USER` / `APPROVED FOR TASK PLANNING`.

**Approval reference and date:** _None. Only record explicit later user authorization. Even design validation does not authorize code, migration or Taskcode task creation._

## Mandatory per-table temporal, rigid-column and deletion review (2026-11-07)

**USER REQUIREMENT; planning only.** Examine every existing/proposed field and expressly record **KEEP / REMOVE / DERIVE / MOVE / RENAME / ADD** for `valid_from`, `valid_to`, `valid_from_precision`, `valid_to_precision`, `is_current`, `status`, `version`, `created_at`, `updated_at` and other copied/rigid flags. These fields are **opt-in by justified meaning**, not blanket schema conventions. Assess `deleted_at` only for recoverable soft deletion where appropriate. The full policy and migration/approval checklist is in [schema redesign README](README.md).

**Domain-specific guidance:** Tenders need publication/closing deadlines; bids submission dates; contracts signing/effectiveness/end dates; milestones due/completed dates; variations amendment dates. Generic validity cannot represent these different legal events. Official historical transactions require version/supersession, not is_current or soft-delete. Drafts may justify recoverable deletion if explicitly modeled.

**OPEN for human review:** exact per-table/column disposition, derived status and as-of queries, pattern/legal links, justified precision, recoverable deletion versus domain lifecycle, history/identity preservation and hard-FK impact. No code or migration is authorized.

## 2026-11-11 — System-expansion alignment

Procurement remains the purchasing process owner. Economic market/product facts and Civic infrastructure assets may be linked but are not duplicate procurement records. See the [system-expansion proposal](../advancement-and-system-expansion.md). This alignment note does not approve proposed schemas, tables or implementation.

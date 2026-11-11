---
id: DOC-EXP-HISTORY-20261111
name: History domain expansion brief
type: documentation
tags: [system-expansion, hypothetical, schema-design, history]
extra: {status: hypothetical, approval: not_approved, implementation: not_authorized, recorded_on: 2026-11-11}
---

# History — chronology, periods and evidence-backed interpretation

> **Status: HYPOTHETICAL DOMAIN BRIEF.** This extends existing history commitments without approving new SQL. See the [system-expansion proposal](../advancement-and-system-expansion.md).

## 1. Purpose and exploration areas

History connects evidence and domain facts into researched explanations and chronology across Geography and Nature, Heritage, Civic and Society, Statistics, Economics and Governance.

## 2. Domain ownership

Candidate ownership: named period identities and source-specific definitions; evidence-backed interpretations; historical accounts/publications; curated chronologies and membership/order.

## 3. Exclusions

Activity owns event occurrence. Geography owns area identities, boundary editions and geographic relationships. Heritage owns artifact/collection identity and custody. Legal owns instruments/provisions. Other domains own actual entities and measurements interpreted by History.

## 4. Existing schema and table inventory

No History SQL schema is defined in the active migration tree or listed Dryv domain groups. Existing `activity` redesign is for events, actions, news and timelines. DOMAINS documentation already establishes historical chronology and historical geography as core purpose; this proposal refines ownership, not product implementation.

## 5. Candidate tables

| Candidate | Responsibility |
|---|---|
| `periods` | Stable identity for named historical period/era. |
| `definitions` | Sourced period boundaries, calendar, geography and uncertainty/alternative interpretation. |
| `interpretations` | Versioned research claim/explanation with evidence and argument. |
| `accounts` | Curated historical narrative or research publication. |
| `editions` | Versioned content for an account. |
| `chronologies` | Timeline collection by topic/place/period. |
| `entries` | Ordered links to dated events or domain facts in a chronology. |

A proposed generic `links` table is not approved; use explicit real FKs or domain-specific typed associations.

## 6. Primary and foreign-key relationships

Interpretations link to Source attribution/evidence and typed domain subjects. Entries should FK to Activity events or specifically supported domain records, not arbitrary `kind/id`. Period definitions link to Geography units/boundary editions and legal/history sources where relevant.

## 7. Cross-domain relationships

History interprets Activity events but does not create duplicate event identities. It references Geography historical areas and boundaries without determining their geometry. It links Heritage objects to interpretation without owning custody. Domain facts such as office terms or harvests remain with owning domains.

## 8. Geographic responsibilities

An interpretation may cite overlapping, disputed or reconstructed geography. Geographic identity and geometry remain Geography-owned; a current country is never silently assigned to a precolonial polity or historical event.

## 9. Temporal responsibilities

Support alternate calendars, partial/approximate dates, intervals, competing periodizations and source-specific date claims. Distinguish event date, period definition, interpretation publication, source publication/retrieval and record version.

## 10. Evidence and provenance

Each interpretive claim retains supporting and contradicting sources, exact file versions/locators, authorship, method, uncertainty, review/dispute status and revision history. AI summaries remain attributed suggestions.

## 11. Acquisition categories

Static seeded: reviewed period vocabularies. Pattern seeded: curated chronology templates only. Collected: archival accounts/transcriptions. Derived: chronology order/indexes from dated facts with method and source links. An interpretation is not direct extraction merely because AI assisted it.

## 12. Derived data

Chronology views and period maps are derived presentations; retain input record versions, date-resolution rules, geographic boundary edition and sorting method. Do not rewrite source dates to fit a timeline.

## 13. Example queries

- Which competing period definitions describe this area and what sources date them?
- What events and domain changes are included in this chronology, and how were they ordered?
- Which interpretations disagree about an institution's historical origin?

## 14. UI/API requirements

Timelines disclose uncertain ranges, alternate calendars, contested claims and evidence. Provide navigation from map/period to original source and domain record. Do not flatten a scholarly interpretation into a single unqualified fact.

## 15. Integrity constraints to investigate

Versioned chronology membership, date interval semantics, interpretation evidence thresholds, explicit subject typing/FKs, ordering when dates overlap, account edition lifecycle and non-destructive corrections.

## 16. Technical standards to evaluate

ISO 8601 where compatible, calendar systems relevant to sources, archival description conventions and linked open annotation models. No standard should erase cultural date semantics or local historiography.

## 17. Open questions

How is a typed multi-domain interpretation link enforced? Are historical accounts authored as source content or Mzizi editorial content? How to support oral histories, multilingual narratives and disagreement? Are historical periods entities or reusable reference concepts plus contextual definitions?

## 18. Review and approval status

Hypothetical; not reviewed or approved. Reconcile with Activity, Geography, Heritage, Source, Legal and Person designs before schema planning.

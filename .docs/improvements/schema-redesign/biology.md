---
id: DOC-EXP-BIOLOGY-20261111
name: Biology domain expansion brief
type: documentation
tags: [system-expansion, hypothetical, schema-design, biology]
extra: {status: hypothetical, approval: not_approved, implementation: not_authorized, recorded_on: 2026-11-11}
---

# Biology — taxa, biodiversity evidence and distributions

> **Status: HYPOTHETICAL DOMAIN BRIEF.** Candidate Biology structures are under investigation and not approved for SQL. See the [system-expansion proposal](../advancement-and-system-expansion.md).

## 1. Purpose and exploration areas

Biology makes organism identities and sourced biodiversity evidence discoverable across Geography and Nature, History and Heritage, Agriculture and Statistics.

## 2. Domain ownership

Candidate ownership: taxon concepts/identifiers, scientific and vernacular names, survey/sample events, organism occurrences and sourced or modeled distributions.

## 3. Exclusions

Agriculture owns managed cultivation and livestock operations. Statistical owns population estimates and comparable indicators. Geography owns places, habitats as spatial entities where applicable, and geometry. Heritage owns preserved specimens/collections. Person owns human identities.

## 4. Existing schema and table inventory

No Biology schema is defined in the active SQL migration tree or listed Dryv domain contracts. The proposed `biology` schema is new and hypothetical. GBIF/Darwin Core terms are exchange references, not an existing Mzizi database model.

## 5. Candidate tables

| Candidate | Responsibility |
|---|---|
| `taxa` | Stable taxonomic concept identity and rank. |
| `names` | Scientific, synonym, common and community names with language/source. |
| `identifiers` | External classification/catalogue identifiers tied to a taxon concept and authority release. |
| `surveys` | Sampling event/campaign, protocol, collector organization and time. |
| `occurrences` | Sourced occurrence or specimen observation with taxon, event, location and basis. |
| `distributions` | Sourced or modeled range assertion, time/version and spatial asset. |

Avoid individual plant/animal identity unless a tagged organism is itself the research subject.

## 6. Primary and foreign-key relationships

Occurrence should FK to a taxon concept and survey/event, with a typed Geography location and source evidence. Specimen records may link to Heritage collection/object identity. Distribution products pin boundary/model/source versions. Agriculture links crop/livestock records to taxa rather than copying taxonomic identity.

## 7. Cross-domain relationships

Biology owns a species/taxon; Agriculture owns its cultivation or managed herd. A wild occurrence is not a census population estimate. Statistical owns abundance/population estimates and carries sampling method, scope and uncertainty. History may interpret ecological change; Activity remains event owner for dated observations/events.

## 8. Geographic responsibilities

Occurrences may have exact, generalized or uncertain coordinates and should link to a Geography place/unit where justified. Distribution polygons are versioned sourced/modelled representations. Sensitive species locations may be private or generalized in public API output.

## 9. Temporal responsibilities

Separate observation/event date, survey interval, taxonomic concept validity, source publication/retrieval, and modeled distribution validity. Historical observations may have partial dates and uncertain locality.

## 10. Evidence and provenance

Retain verbatim determinations, observer/collector, source artifact/version, voucher identifier, method, coordinate precision, identification confidence, review history, license and corrections. AI taxon matching remains a proposal pending review.

## 11. Acquisition categories

Static seed: reference taxonomic releases. Pattern seed: normally not applicable to actual organisms. Collected: museum, survey, archive and biodiversity portal records. Derived: species range or richness model with inputs and method. Record whether a sighting is observed, specimen-based or inferred.

## 12. Derived data

Biology can create distribution/richness products and species checklists. Statistical owns comparable population estimates. Derived maps pin taxon authority, occurrences, spatial grid/boundary and algorithm version.

## 13. Example queries

- Which sourced occurrences of this taxon exist within this area and period?
- Which observations are specimen-backed versus field observations?
- How did the documented distribution change across dated boundary editions?

## 14. UI/API requirements

Map and list results must communicate coordinate uncertainty, observation basis, access generalization, temporal context and source. Avoid implying absence when coverage is incomplete.

## 15. Integrity constraints to investigate

Taxonomic synonym/version resolution, occurrence event/location consistency, date and coordinate validity, duplicate publication IDs, sensitive-location policies, and clear separation of abundance estimate from occurrence count.

## 16. Technical standards to evaluate

Darwin Core, Darwin Core Archive, GBIF dataset conventions and EML metadata; evaluate taxonomic authority releases and local names without making GBIF taxonomy canonical by default.

## 17. Open questions

How are taxonomic splits/lumps versioned? How should indigenous knowledge and community data rights be represented? What is the policy for sensitive species? Which data remain file assets versus relational observations? How should disputed identifications be reviewed?

## 18. Review and approval status

Hypothetical, not reviewed or approved. Coordinate with Agriculture, Heritage, Geography, Statistical, source and privacy design before SQL planning.

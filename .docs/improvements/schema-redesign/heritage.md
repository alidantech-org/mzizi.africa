---
id: DOC-EXP-HERITAGE-20261111
name: Heritage domain expansion brief
type: documentation
tags: [system-expansion, hypothetical, schema-design, heritage]
extra: {status: hypothetical, approval: not_approved, implementation: not_authorized, recorded_on: 2026-11-11}
---

# Heritage — artifacts, collections and cultural custody

> **Status: HYPOTHETICAL DOMAIN BRIEF.** This proposal does not authorize new tables. See the [system-expansion proposal](../advancement-and-system-expansion.md).

## 1. Purpose and exploration areas

Heritage preserves material and intangible heritage identities, their custodial context and community relationships, linking Geography and Nature, History and Heritage, language, people and evidence.

## 2. Domain ownership

Candidate ownership: heritage object/monument identity, collection membership, accession and custody/provenance history, cultural practice/tradition identity, and community-held heritage statements where consent permits.

## 3. Exclusions

Filesystem owns digital bytes and immutable file versions. Source owns publishers, documents and captures. History owns scholarly interpretation/chronology. Geography owns places. Person and Organization own people and institutions. Heritage must not duplicate a scanned artifact as a file identity.

## 4. Existing schema and table inventory

No Heritage SQL schema or listed Dryv domain contract exists in the active runtime tree. `.docs/docs/DOMAINS.md` already defines heritage/culture as a core research area. This brief proposes candidate structures only.

## 5. Candidate tables

| Candidate | Responsibility |
|---|---|
| `objects` | Physical artifact, monument, manuscript, artwork or archaeological object identity. |
| `collections` | Collection/holding institution or community collection identity. |
| `memberships` | Dated object membership/accession within a collection. |
| `provenance` | Documented discovery, custody, transfer, export/return or ownership claim events. |
| `practices` | Intangible heritage practice/tradition identity with language/community context. |
| `expressions` | Sourced performance, recording, description or documented variant of a practice. |

Separate provenance claims from a conclusively verified ownership chain; practice/expression tables require community-led terminology review.

## 6. Primary and foreign-key relationships

Objects link to a physical Geography place, relevant Persons/Organizations, Source evidence and Filesystem digital surrogates. Collection membership and provenance rows have real subject/collection FKs. Practice records require explicit community/organization and source relationships; avoid generic target pointers.

## 7. Cross-domain relationships

Heritage owns artifact identity and physical custody/provenance; Filesystem owns digital artifact bytes; Source owns source-document publication/capture; History interprets and contextualizes; Geography owns site/location. A museum scan is not the original object, and a digitized source is not automatically a Heritage object.

## 8. Geographic responsibilities

Sites, excavation locations, current holding locations and cultural landscapes are distinct geographic relationships with dates and uncertainty. Do not assume artifact origin equals current location or legal jurisdiction.

## 9. Temporal responsibilities

Record creation/use periods when known, accession/custody intervals, discovery dates, performance/documentation dates and source retrieval independently. Approximate or disputed dating must remain explicit.

## 10. Evidence and provenance

Preserve source artifacts, accession references, conservation reports, oral history consent, chain-of-custody evidence, authorship/community attribution, license/access rights, uncertainty and correction records. Provenance is a set of sourced claims, not a single mutable text field.

## 11. Acquisition categories

Static seed: curated heritage identities from cited catalogs. Pattern seed: generally not appropriate for actual objects. Collected: digitized catalogues/images/recordings. Derived: transcription, translation or digital restoration products with method and input-version lineage. Preserve community consent and restrictions.

## 12. Derived data

Digital surrogates and derivatives remain Filesystem artifacts, connected to Heritage identity with typed relations and source/method lineage. Historical narratives belong to History. Statistical counts of collections/objects belong to Statistical when published as measures.

## 13. Example queries

- Where is this artifact held now, and what sourced custody history is known?
- Which digitized versions represent this manuscript and which are derivative images?
- Which communities and oral traditions are documented in relation to a place and period?

## 14. UI/API requirements

Support collection/object pages, media/evidence viewers, multilingual names and clear access/license/consent state. Restrict culturally sensitive knowledge or locations according to community rights; do not imply open access by default.

## 15. Integrity constraints to investigate

Collection membership intervals, accession identifiers, duplicate artifact resolution, provenance assertion sources, digital derivative lineage, consent/license scope, sensitive metadata policy and non-destructive corrections.

## 16. Technical standards to evaluate

Museum/archive cataloguing and archival description standards, IIIF for interoperable image presentation, linked data vocabularies where useful, audiovisual preservation metadata and community protocols. Evaluate standards without forcing a colonial cataloguing ontology.

## 17. Open questions

Are intangible practices within Heritage or Culture as a distinct domain? How are community-controlled descriptions and withdrawal/consent represented? Which relationships are claims versus verified custody? What qualifies as an object versus a digital-only cultural expression?

## 18. Review and approval status

Hypothetical; not reviewed or approved. Reconcile with Source, Filesystem, History, Geography, Person, Organization and cultural/community stewardship before schema planning.

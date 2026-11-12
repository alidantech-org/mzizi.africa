---
id: DOC-MZIZI-FOUNDATION-20261111
name: Connected reference geography legal and domain foundation
type: documentation
tags: [improvements, reference, geography, legal, patterns, task03]
extra: {status: ready_for_detailed_design, recorded_on: 2026-11-11}
---

# Connected reference, geography, legal and domain foundation

## Status, precedence and scope

The user accepted the architectural direction discussed on 10–11 November and requested that task 03 and the improvement documents be made ready for local-agent work. This records that direction and the research behind it. Candidate table names below are design inputs, not completed SQL specifications or a claim of deployed capability. Task 03 owns the detailed foundation design; task 04 owns completion of downstream legal/governance/electoral/political/statistical schemas. This documentation instruction does not independently authorize production migrations, broad domain implementation or infrastructure changes.

For task 03, this document supersedes older proposals to retain an overloaded `reference.jurisdictions`, treat `world` as a legal jurisdiction, preserve legacy database IDs, use one universal geographic parent tree, or make all statistical meaning generic. The rewrite target remains the disposable `mzizi_new`; verify the actual connected database before destructive work. Existing S3 evidence remains protected. Historical inventories remain useful research material but are not current schema specifications.

## 1. User decisions and modeling principles

1. Modern countries organize the modern-governance experience. Geography is the shared spatial foundation, including Africa, country territories, subdivisions, settlements, cross-border regions and historical/reconstructed areas.
2. Country identity, legal authority, territorial applicability, physical location, service coverage and vocabulary applicability are different facts. A county's legal powers do not make it another top-level country context.
3. Global vocabulary has explicit global applicability, without a fictional `world` country or legal authority. Countries are not compulsory owners of languages, regional organizations, historical polities or cross-border areas.
4. Reference defines meanings; domains own actual entities and rules; backend capabilities interpret supported queries; UI presents available answers with their context and evidence.
5. Direct domain-to-geography and domain-to-legal FKs remain essential. Reference describes the kind of relationship; it is not an intervening entity through which every relationship must pass.
6. Historical validity and when Mzizi learned/revised a claim are distinct. Evidence and uncertainty qualify the assertion, boundary or relationship concerned, not an indiscriminate confidence flag on the whole entity.
7. No blanket `is_current`, validity/precision columns or soft deletion. Justify dates and lifecycle per table, use meaningful names, and preserve legally/historically relevant records.

## 2. Reference vocabulary and domain definitions

| Candidate | Meaning | Required design decisions |
|---|---|---|
| `reference.countries` | Modern country identities for discovery and context | Territorial FK/cardinality and dated territory changes; external identifiers, disputed recognition policy and source authority; no silent exclusion of disputed entities |
| `reference.schemes` | Described controlled vocabularies | Stable `code`, labels/descriptions, ownership and allowed applicability |
| `reference.values` | Entries within a scheme | Stable identity/code, scheme membership, descriptions, localized labels, retirement/supersession where justified |
| `reference.value_relations` | Broader/narrower/related meanings and cross-vocabulary mappings | Distinguish concept hierarchy from geographic containment; exact equivalence requires evidence |
| `reference.topics` and topic relations | User-facing exploration subjects | Topic can span multiple domains; topic is not an office/indicator classification |
| Pattern identity, versions and dependencies | Reviewed reusable generation definitions | Exact contracts, artifact versions, activation, prerequisites and typed lineage |

Example: `office_category` contains a broad governor concept. A governance-owned Kenyan county-governor definition records the country/system-specific selection and powers with legal support. Nairobi's actual governor office refers to that definition. A label shared across countries does not imply identical powers.

Choose an enforceable scheme-membership method: for example, a unique `(scheme_id, id)` key and composite FK from a consumer carrying a checked expected scheme, or a typed catalog FK. Prove a wrong-scheme UUID is rejected. Do not merely validate it in a form.

Follow `.docs/rules/code-columns.md`: identity is named `code`, dot-separated lowercase segments, shape constraints, uniqueness and no reuse. Vocabulary scheme examples in earlier chats containing hyphens/slashes are descriptive, not approved stored codes. For multi-parent geography, code prefixes are namespaces/identity conventions, not the authority for spatial ancestry. Document how the code rule's parent-prefix convention applies without inventing a universal parent or changing codes when geography changes.

Language identities may begin in a small reference catalog if justified; linguistic relationships and geographic use/distribution require dated sourced domain facts. Do not represent every language, community, region and institution as interchangeable classification values.

## 3. Geographic identities, relationships and representations

Specify `geography.units`, domain-specific unit types, dated typed relationships, names, changes and boundary representations. Distinguish geographic area from physical site/building; finalize place/presence/contact ownership explicitly rather than reviving obsolete expectations by default.

Relationships are authoritative for administrative, electoral, statistical and other systems. A closure/path cache is derived and must include relationship system, period and rebuild strategy. Containment hierarchies reject cycles within their defined systems; not every non-containment relationship is hierarchical or transitive. A contemporaneous unit can participate in several systems. No independently editable competing `parent_id`.

A boundary representation records source artifact/version, period, geometry/SRID, method and appropriate uncertainty. Official boundary, reconstruction, disputed claim, membership union, language distribution and hypothetical scenario must be distinguishable. Unknown geometry is allowed where an area identity is established. Approximate geometry must not appear legally authoritative.

| Relationship | What a geographic link means |
|---|---|
| Located at | Physical headquarters/site |
| Serves | Documented service coverage |
| Exercises authority within | Territorial mandate of an office/institution |
| Elects for | Area represented by a contest/seat |
| Applies within | Territorial applicability of a legal instrument/provision |
| Measures | Observation's geographic/boundary coverage |
| Member-territory coverage | Derived map of a dated organization membership |

Use clear singular FK names or domain-specific scope junctions according to cardinality. Nationwide Kenyan records link to the Kenya territorial unit; null does not mean national. Distinguish nonspatial, unknown and genuinely global context. Do not infer service coverage from headquarters or create country ownership for cross-border entities.

## 4. Legal identities, versions, provisions and domain links

Task 03 specifies the legal connection contract; task 04 finalizes legal tables. Candidate structure: instruments, instrument versions, provision identities, provision versions, amendment/instrument relations and applicability. Stable instrument/provision identity, textual revision/language, legal effective period and exact digital artifact are different things. Publication, enactment, commencement and repeal dates are not interchangeable; versions may have provision-specific effects or retroactivity.

Support multiple typed legal bases per entity/rule. Candidate associations include governance office/institution/rule legal bases, electoral rule legal bases, political rule legal bases and geography unit legal bases. Each references a real target and a precise provision version, with a controlled basis role such as establishes, defines powers, governs selection or alters boundary. Where an indirect rule-to-provision chain is authoritative, avoid duplicating contradictory direct links and document how the UI resolves it.

No unconstrained `target_kind + target_id` as a claimed FK. Distinguish cited support from a legally settled interpretation, contested applicability, and actual compliance. Structured executable rules require review and registered implementations; extracted legal text is not executable application logic. Do not require a constitutional foundation for every historically attested institution: preserve documented non-statutory/customary/de facto bases with clear evidence and status rather than inventing law.

| Domain | Canonical responsibility | Important links |
|---|---|---|
| Governance | Institutions, offices, rules/powers, holders/terms | Organization/person, legal bases, territorial mandates |
| Electoral | Elections, contests, candidacies, results/declarations | Office filled, area, legal rules, candidate person and electoral affiliation |
| Political | Parties, coalitions, memberships | Organization identities, dated affiliation, legal requirements |
| Legal | Instruments, provisions, changes and applicability | Issuing authority, exact evidence, territory/subjects |
| Statistical | Defined observations, releases, methods and dimensions | Domain subject/definition, period, boundary coverage and evidence |

Election win, declaration, appointment, assumption of office and term are separate events. Party affiliation during a candidacy is not timeless membership. A vacant office still exists without a holder.

## 5. Regional organizations, Africa and historical areas

EAC/COMESA are organizations, with dated members, organs, offices and legal bases. Their map coverage is a separate derived geographic representation. Record member roles, entry/exit/effective periods and sources; distinguish organization membership from participation in a particular protocol or regime.

Membership map recipe: membership as of date → corresponding member territories/boundary versions → geometric union. Pin input membership and boundary versions, derivation version and artifact provenance. A union is not sovereign territory, uniform treaty applicability or proof of operational control. Recompute on membership/boundary change without overwriting historical maps.

Africa is a continent geographic identity, not itself an authority appointing leaders. A continental representative needs an appointing body, mandate, capacity, activity and period with evidence. Do not label someone Africa's representative merely because their organization is located in Africa.

Historical polities and places can predate modern countries; Timbuktu must remain identifiable through changing names and administrations. Distinguish claimed sovereignty, actual control, administration, cultural association and linguistic distribution. A hypothetical region carries author/scenario/status; it cannot silently participate in official administrative traversal. A recurring citable analytical area merits stable identity; an ad hoc map selection may remain a query geometry.

## 6. Statistics and future domains

Preserve shared dataset/release, unit, time, measurement and provenance machinery, but do not erase domain meaning into `indicator + geo + year + value` or opaque dimensions JSON.

Population requires who is counted (usual residents, persons present, households, language speakers), definition, reference date/period, method, coverage/boundary edition, release/revision and uncertainty. A census, survey, projection and historical estimate are different observations. Unknown boundary edition remains explicitly unknown. Do not aggregate overlapping areas or incompatible definitions, transfer national values to counties, or equate absence with zero.

Test four cases before statistical design sign-off: census count, revised estimate, language-use survey and historical population estimate for an approximate area. Regions are geography entities; language/community identities and distribution are separate. Future history, land, goods, prices and inflation domains can reuse place/time/evidence without being fully built in task 03.

## 7. Patterns, methodology and reproducible execution

Reference owns identities, immutable versions and definition dependency graph. Filesystem owns exact versioned definition artifacts. Domain schemas own structured meaning and generated rows. Engine owns runs, scheduling/retries, reconciliation, gaps and execution dependencies. Preserve existing extraction/file lineage ownership; do not recreate filesystem extraction tables.

Distinguish definition dependency, required input resources and run dependency. Bind versions to recognized capabilities and validated schemas under `source/schema/`; never arbitrary SQL or executable expressions. Define stable identities, permitted inputs, applicability, cardinality, legal/policy support, preview/apply, conflict handling, fan-out bounds and stale-output rules.

Established existence permits real domain rows with unknown attributes left unknown. A legal duty does not prove a building/occupancy or current holder. Uncertain existence becomes a discovery job/manifest. Repeated runs adopt unchanged outputs; changed rules produce reviewed diffs and retain independent factual edits and history. Generated lineage must use real FK-backed associations. Reference does not store scheduler leases or transient retry state.

First runtime consumer should be implemented filesystem folder resolution/generation. Governance office generation is a detailed contract/proof case until its destination model is finalized under task 04. Reuse the seven-table filesystem, exact `file_versions`, `file_relations`, scoped RBAC and current sync interfaces; no new objects/type/extractions tables. Root `seed/` remains the only real system-input source. Registration of seed bytes and application of their records are separate operations.

## 8. UI and capability contracts

User context is place, date and topic, not a table name. GPS resolves candidate containing areas with boundary/date/source metadata; it does not establish residence, citizenship or voter registration. Missing or disputed geometry produces qualified answers, not fabricated certainty.

Topics organize navigation. A backend capability registry declares recognized handler, versioned input/result contract, allowed filters, geographic resolution rule, temporal interpretation, evidence output and supported presentations. Decide physical ownership during task 03; do not create an analytics schema merely because a catalog was discussed. Reference is the semantic entry point, not a generic SQL-query builder.

| Capability | Relationship to follow |
|---|---|
| Population | Observation's exact coverage, period, definition and release |
| Representatives | Applicable office mandates → term → person; legal basis explains authority |
| Voters/results | Election/registration release and electoral reporting area |
| Budget | Responsible institution and fiscal period, with explicit coverage |
| Projects | Documented sites or beneficiary/service area |
| Applicable law | Reviewed territorial, subject/personal and temporal applicability |

National fallback must be explicit, not relabeled local data. Offer trend, age filters, maps and comparisons only when data and methodology support them. Return scope used, requested date, actual data period, methodology, source/version, coverage gaps and legal explanation links. No frontend arbitrary FK traversal or automatic legal interpretation.

## 9. Design order and proof cases

1. Inspect active contracts/packages, completed auth/filesystem outputs, naming rules and actual consumers; inventory archives read-only. Label repository findings separately from live verification.
2. Specify countries, schemes/values/applicability and semantic identity contracts with enforceable keys.
3. Specify geographic identity/types, relationships, dated representations and scope contracts; include Africa and cross-border/history cases.
4. Specify minimal legal identity/provision-version interface and typed cross-domain legal-basis contracts, including bootstrap order without fake FKs to absent tables.
5. Specify pattern registry/version contracts, real input prerequisites, reproducible lineage and filesystem consumer.
6. Specify capability/topic discovery and three end-to-end query designs: population, representatives and budget. Use contract fixtures when owning domains are not yet implemented and label them as fixtures.
7. Deliver exact table/column SQL specifications, disposition matrix, examples, focused verification plan and task-04 integration backlog before requesting significant implementation approval.

Proof cases: Kenyan governor office with separate Articles 176/179/180 roles; contest-to-office-to-holder; EAC organ and dated member-territory map; historical area with uncertain boundary; wrong-scheme reference rejection; multiple geographic hierarchies; explicit national fallback; repeated folder pattern output without duplicate creation or public-access widening.

## 10. Research basis and limits

These sources support concepts and examples, not the proposed table names or a completed Mzizi implementation:

- [Kenya Constitution, county government provisions](https://www.mod.go.ke/the-constitution-of-kenya-2010-online/): Articles 176, 179 and 180 support different aspects of county structures, executive roles and selection.
- [KLRC Article 180](https://klrc.go.ke/index.php/constitution-of-kenya/138-chapter-eleven-devolved-government/140-part-2-county-governments/349-180-election-of-county-governor-and-deputy-county-governor): direct governor election and distinct deputy procedure; do not reduce all office selection to a generic election flag.
- [EAC Treaty, official court text](https://www.eacj.org/?page_id=33): Article 9 establishes organs and treaty-conferred powers. Membership coverage does not substitute for legal applicability.
- [COMESA decision-making](https://www.comesa.int/decision-making-2/): organization organs differ from the geographic region shown on a map. No current membership count is frozen by this document.
- [W3C SKOS Primer](https://www.w3.org/TR/skos-primer/): schemes, concepts, semantic relations and mapping distinctions. Relational adaptation does not require an RDF database.
- [W3C Organization Ontology](https://www.w3.org/TR/vocab-org/): organizations, posts, roles, memberships and sites are distinct; adapt to Mzizi's organization/governance ownership.
- [OASIS Akoma Ntoso vocabulary](https://docs.oasis-open.org/legaldocml/akn-core/v1.0/akn-core-v1.0-part1-vocabulary.html): legal work, expressions and manifestations provide an identity/versioning precedent, not a mandate to install that version or duplicate all its structures.
- [PostGIS ST_Covers](https://postgis.net/docs/ST_Covers.html) and [ST_Union](https://postgis.net/docs/ST_Union.html): point coverage and derived unions. Spatial operations do not infer legal authority.

Earlier discussion of USA, South Africa, Nigeria and Tanzania establishes a requirement for multiple levels and asymmetric authority, not verified executable national rule definitions. Research each actual rule and its current/historical legal source before adopting it. This preparation did not inspect a live database, execute S3 operations or verify current officeholders.

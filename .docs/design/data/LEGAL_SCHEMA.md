---
id: DOC-LEGAL-SCHEMA
name: Legal instruments, editions, wording, relationships and effects
type: documentation
---

# Legal schema target

## Approval and implementation status

On 17 November 2026 the owner approved the initial table design, subsequently extended by legal.names and corrected to separate legal.translations and requested clear technical documentation. This supersedes the earlier decision to defer Legal design and the assumption that all eight current tables would remain. It approves the table names, responsibilities and conceptual decomposition. Field details, cardinalities, SQL constraints and migrations must be made explicit and verified during implementation. Resolve routine technical choices within the agreed design without seeking repeat approval.

Implementation is now authorized by the owner through the [implementation handoff](../../handoffs/HANDOFF-IMPLEMENT-SCHEMA-OWNERSHIP.md); this guide remains a target design, not a claim of completed work. Current executable definitions remain in `dryv/contracts/schemas/postgres/legal.ts`. No schema generation, runtime refactoring, seed changes or database migration is performed by recording the agreement. Follow AGENTS.md, Task tracking, typed-contract and versioning rules; no invented revision fields or version-suffixed files. The name editions expresses the approved legal domain concept, not a generic schema-version mechanism.

## Product intent and boundaries

Legal answers: what instrument exists, what it says, how it is structured, how legal instruments/provisions relate, and what they establish or change in other domains. It preserves exact wording and historical meaning without treating a download, source classification or extracted suggestion as legal truth.

| Concept | Responsibility | Target table |
|---|---|---|
| Instrument | Stable legal identity of a constitution, act, regulation, treaty or other instrument | instruments |
| Name | Language-specific or unattributed name of an instrument, including preferred and canonical selection | names |
| Edition | Meaningful legal content state or consolidation of an instrument | editions |
| Structure | Stable provisions and their hierarchy | provisions |
| Wording | Exact authority-bearing provision text in an edition | wordings |
| Translation | Translated representation linked to exact authoritative wording | translations |
| Textual reference | Mention of another provision inside exact wording | references |
| Legal relationship | Substantive connection such as amendment, repeal, replacement or supplementation | relationships |
| Effect | What legal authority establishes, authorizes, governs, limits or changes for an affected record | effects |

Source owns products/publication editions/artifacts, acquisition URLs/captures, provenance, exact citations, review evidence and rights. Filesystem owns byte versions. Reference owns languages and shared controlled classifications. Geography owns places/geometries; Official owns organization/person identities. Legal owns legal meaning and effects involving those records.

## Target inventory and current-to-target mapping

| Current table | Target | Action |
|---|---|---|
| legal.instruments | legal.instruments | Retain and clarify identity/authority/scope |
| legal.instruments.title | legal.names | Move authoritative naming into the approved names table |
| legal.instrument_versions | legal.editions | Replace name and Source coupling; retain legal historical distinctions |
| legal.provisions | legal.provisions | Retain stable provision tree |
| legal.provision_versions | legal.wordings | Migrate wording, language, edition and historical evidence |
| legal.provision_translations | legal.translations | Preserve translations separately, mapping each to exact authoritative wording and retaining metadata |
| legal.provision_references | legal.references | Rename and make the originating wording explicit |
| legal.amendments | legal.relationships | Generalize substantive legal connections while preserving exact authority, affected and resulting wording |
| legal.bases | legal.effects | Generalize the meaning of legal effects on other records |

The updated target contains exactly nine tables: instruments, names, editions, provisions, wordings, translations, references, relationships and effects. The owner explicitly chose the short name legal.names, not instrument_names. No additional legal document/file/source-acquisition catalogue is proposed.

## Table definitions and contract requirements

The following fields are semantic contract candidates, not yet authored Dryv definitions. Existing code and lifecycle conventions must be reviewed per table rather than blindly inherited. Use actual foreign keys for fixed targets. Any generic target must have registered table/type validation and explicit integrity behavior. Names and examples below do not authorize adding classification seed files.

### legal.instruments

One row is one stable instrument independent of downloaded copies, publishing channels, language representations and successive editions.

Retain an identity/code and Reference kind. Instrument names are owned by legal.names; instruments.title must not remain a competing authoritative name store. Record issuing authority and territorial/jurisdictional scope explicitly. Current issuing_entity_id and issuing_unit_id need a field review: geography currently uses features, and scope must not be inferred from a stale units name. Do not assume every instrument has exactly one issuer or fits one current country. Review instruments with joint issuers, international reach or unknown scope before selecting cardinality.

Dates such as enactment and initial publication are instrument facts only when meaningful at this level. Changes in wording and historical applicability belong to editions/wordings or effects. Publisher identity is not necessarily issuing authority. No source_url, storage key or official-source flag.

### legal.names

The owner approved multilingual names, instrument types and classified hierarchy relationships, explicitly choosing legal.names. One row is a name of one instrument, not another instrument identity. This table initially targets instruments only; its short name does not authorize an unchecked polymorphic naming subsystem.

Candidate fields:

| Field | Meaning and target |
|---|---|
| instrument_id | Required FK to legal.instruments |
| language_id | Required FK to reference.languages, including und when no language is asserted |
| name | Exact attested name |
| kind_id | Reference name kind: formal title, short name, alternative, abbreviation or reviewed canonical classification |
| is_preferred | Preferred display name for that instrument in this language |
| existing validity convention | Historical applicability of the name, not download time |

Illustrative forms of the same instrument are Constitution of Kenya, 2010 (English formal-title candidate), Katiba ya Kenya (Kiswahili display/short-name candidate), and The Kenyan Constitution (English alternative candidate). These examples demonstrate storage and search, not verified assertions of official naming. Source citations support each name and classification.

All names resolve to one instrument. Select a preferred name in the requested language and applicable historical period. An explicitly designated canonical name without language attribution can use und. Do not infer English or positively assert mul simply because a name is canonical. The fallback policy must be explicit; never silently reattribute a fallback label to the requested language. The precise canonical selector (name kind versus a separate flag) and fallback ordering require field-level review.

Enforce valid name-kind scheme membership and prevent duplicate names. Preferred-name selection should allow at most one applicable preferred name per instrument/language, while preserving historical changes; do not impose a permanent unique pair that prevents valid successive preferred names. Document required selection behavior versus at-most-one enforcement and nullable end-date semantics. Search should use all attested forms, returning the same instrument rather than duplicate results.

Migrate existing instruments.title into an evidenced name record. Assign language only when supported; do not blanket-label existing titles English. Migrate seed headers, generated display queries and API consumers before removing the old column. Keep provision headings in their appropriate structure/wording model; this decision concerns instrument names.

### Instrument kinds, statuses and legal hierarchy

Keep instrument kind as a typed Reference value relationship and enforce the instrument-kind scheme. Constitution, Act, Bill and Regulation are examples. Reference value_labels supplies localized category labels independently of individual instrument names. These examples do not authorize seed additions.

Separate instrument kind from legislative/lifecycle status. Introduced, withdrawn or enacted describe progression; no bill becomes operative law simply by admission to the database. The precise status fields and whether history lives at instrument or edition scope need contract design.

Preserve bill and resulting Act as separately identifiable records connected through a reviewed enacted-as legal.relationships row. Retain their separate identifiers, wording and chronology; do not mutate the old Bill row into an Act and erase proposal history.

Do not add a mandatory parent_instrument_id for constitutional hierarchy. Use classified legal.relationships: subject-to, made-under, implements, amends, enacted-as and genuine part-of where established. Instruments may have several authority relationships. Provisions use their structural parent hierarchy; an Act is not automatically a chapter of the Constitution.

For the Kenya illustration, constitutional supremacy and legislative passage are different legal propositions. Article 2 and Article 109 respectively supply evidence to examine; do not bulk-generate all hierarchy links solely from country membership. Sources checked during discussion:

- [KLRC Article 2](https://klrc.go.ke/index.php/constitution-of-kenya/106-chapter-one-sovereignty-of-the-people-and-supremacy-of-this-constitution/167-article-2-supremacy-of-this-constitution)
- [KLRC Article 109](https://klrc.go.ke/index.php/constitution-of-kenya/121-chapter-eight-the-legislature/125-part-4-procedures-for-enacting-legislation/277-109-exercise-of-legislative-powers)

### legal.editions

One row is a meaningful legal state or consolidation of an instrument, not one PDF and not an engine run. Principal candidates are instrument_id, an edition designation, consolidation/commencement/cessation/repeal dates when applicable, observed_at and a reviewed supersession relationship.

A legal edition and a Source publication edition are different identities. Several Source publications may reproduce the same legal state; one publication may contain several instruments. Do not force a one-to-one mapping or define identity by a single downloaded document_id.

Use Source relationships/citations to connect legal editions to their supporting publications/artifacts. Existing document_id and evidence_id consumers must migrate into the approved Source model. Do not add a duplicate mandatory bundle of Source material inside Legal.

Dates must have declared meanings. Retrieval/observation time is distinct from legal validity. A consolidation date does not establish commencement. An instrument-level repeal need not mean every historical wording ceases to be relevant. Avoid blanket interval exclusivity until exceptions and partial commencement are understood.

Edition identity is unique within its instrument using a reviewed natural key. Supersession must stay within that instrument and reject self-links/cycles. Parallel, disputed or competing consolidations may require branch-aware handling; do not erase them through an assumed linear chain.

### legal.provisions

One row is a stable structured provision: chapter, part, article, section, clause, paragraph, schedule or other reviewed kind. Retain instrument_id, parent_id, kind, designation, title where meaningful and sibling ordering.

Parents must belong to the same instrument; hierarchy must be acyclic. Uniqueness/order rules must handle root provisions correctly: nullable parent_id in an ordinary unique key does not alone guarantee unique top-level positions. Preserve stable identities across wording changes. Renumbering, insertion and repeal must not overwrite historical content or cause old references to resolve incorrectly.

Whether structural placement itself changes across editions is a contract issue to resolve. A static parent tree must not silently represent historically different structures as one unchanging hierarchy. Do not add another table pre-emptively; first demonstrate the required representation using concrete instruments.

### legal.wordings

One row is exact authority-bearing provision text in a legal edition and language. Principal fields are provision_id, edition_id, language_id, text, supported legal standing and appropriate historical/review metadata. Ordinary translations are not mixed into this table. Legal.effects.wording_id points here, giving authority links stable, unambiguous meaning as translations accumulate.

Enforce that provision and edition belong to the same instrument with real supported composite relationships, not just independent FKs. Preserve exact legal wording, observation time, corrections and historical selection. Review interval rules without conflating retrieval time with legal validity. Remove free-text locator after converting it into exact Source citations.

If two language forms are independently authoritative, both may be wordings of the same provision/edition. Different language alone is not proof that a text is merely a translation, and official-source status does not establish legal authority. Preserve uncertain attestations as reviewable evidence without silently treating them as authority.

### legal.translations

One row is a translated representation of one exact authoritative wording. Required wording_id is a real FK to legal.wordings; language_id is a real FK to reference.languages. Many translations may reference the same wording, including several translations into the same language.

Principal fields: wording_id, language_id, text, translation method, produced_by, produced_at, review_status, reviewed_by, reviewed_at and notes. Use named typed producer/reviewer contracts and approved technical enums or Reference classifications. Preserve existing snapshots and review history; absence of a known producer/date is not permission to invent one. Exact nullability follows evidence and admission requirements.

Source I/O relationships and citations preserve translated-from/extracted-from inputs and multiple contributing sources. Engine run/events are not required. A translation does not become authoritative merely by being accepted by a reviewer. If evidence establishes independently authoritative text, record that standing in wordings through a reviewed decision, retaining provenance.

A new authoritative amendment/wording must not silently inherit translations of its predecessor. Existing translations remain tied to the exact old wording. Record new or revised translations explicitly. Legal effects and authority relationships continue referencing wordings, not translations.

### legal.references

One row is a textual mention of a target provision in a specific wording. Principal candidates identify an exact originating wording or translation (with explicit FK columns and exclusive origin checks), target_provision_id, mention/relation classification, span_start, span_end, span_text, extraction method and review status. A reviewed exact target wording/edition may also be needed for historically pinned references; specify its consistency with the target provision.

References identify mention, not automatic legal operation. A reference containing the word amends is not sufficient to assert an accepted substantive amendment. Extracted results remain proposed until reviewed.

Spans refer to exact text and a declared character-counting convention. Require 0 <= span_start < span_end <= text length and verify span_text against the selected wording. Current differs(start,end) is not an ordering/bounds check. Avoid span uniqueness that prevents one textual mention from referring to several targets or depends on nullable columns incorrectly.

A stable target provision does not mean current wording. Historical queries resolve against the relevant legal edition/time or a recorded exact target. Later changes must not rewrite what an earlier mention pointed to.

### legal.relationships

One row is a substantive legal connection such as amends, repeals, replaces or supplements. This extends amendments; it is not the generic Source lineage graph.

Record relation kind, legally relevant source/subject and target, exact authority wording and applicable period where known. Current amendments' authority_id, affected_id, resulting_version_id, kind_id, effective_on, explanation and citation must have explicit destinations. Where a relationship changes text, retain affected wording and optional resulting wording. An instrument-level repeal or supplement may require instrument/edition endpoints rather than pretending all operations affect a single provision.

Specify an endpoint-kind matrix with actual FK columns to the supported fixed Legal tables and checks for valid combinations. Do not publish an unconstrained generic id pair or proliferate separate tables before defining actual cases. Source citations/relationships supply evidence; Legal describes the legal operation.

Reject nonsensical self-amendments and inconsistent affected/resulting instrument/provision references where appropriate. Cycle rules are relation-specific; do not blindly forbid all reciprocal legal relationships. Keep a text's mention and an asserted legal operation separate, even where they share citations.

### legal.effects

One row is an asserted, reviewable legal effect on a domain record: establishes, authorizes, governs, limits, changes, abolishes or another reviewed kind.

Principal concepts are exact legal authority, affected domain target, effect kind, applicable period, explanation and supporting Source citations. A stable provision may be recorded for navigation, but legal force must be attributable to the relevant wording/edition when required. Current bases already inherits validity fields; review/reuse them rather than adding duplicate date columns.

The affected record can be a geographic feature, institution, office, project, classification or another permitted target. Use real foreign keys where the target is fixed. For genuinely cross-domain effects, use the approved registered table/record identity pattern with typed ID, target existence/access checks and defined deletion/correction behavior. Seed record_code is a lookup/resolution input, not proof that record_id exists. Resolve both consistently and keep managed identifiers out of manually authored CSVs.

Legal owns the relationship. A county remains a Geography feature; an institution remains an Official identity. The effect can state that a provision establishes or governs it without duplicating domain data. Effects do not automatically execute domain updates. Interpretation, source provenance, confidence/review and canonical acceptance remain attributable and separately meaningful.


#### Concrete effects-column proposal for discussion

The owner requested an explanation of effects after approving names/hierarchy. The following gives the implementation contract its semantic requirements. The owner separately approved the [SubjectReference standard](SUBJECT_REFERENCES.md), which is mandatory for effect subjects; complete exact field constraints within the authorized implementation.

| Column | Proposed rule | Meaning |
|---|---|---|
| id | Primary key, per reviewed identity convention | One asserted effect |
| code | Stable code where the seed/entity convention requires it | Importable identity, not legal classification |
| wording_id | Required FK to legal.wordings in this proposal | Exact authority text; provision/edition/instrument derived from it |
| subject_table | Required shared SubjectTable enum | Registered owner of affected record |
| subject_id | Required UUID through SubjectReference | Existing affected row; generic pointer is not a SQL FK |
| kind_id | Required FK to reference.values, effect-kind scheme | Establishes, authorizes, governs, limits, abolishes, etc. |
| effective_from | Optional legal date | Established start of the asserted effect |
| effective_until | Optional legal date | Established end under a documented interval convention |
| explanation | Descriptive text | What the authority does to this specific target; qualifications/conditions must not be erased |
| review_status | Named typed review state | Proposed/reviewed/accepted/rejected interpretation, separate from actual legal force |
| observed_at | Observation timestamp | When Mzizi recorded this interpretation, not when the law took effect |

The date column names are semantic candidates: reconcile them with existing bases validity fields rather than adding duplicate effective/valid pairs. Unknown dates must not be presented as verified perpetual validity. Decide interval boundaries and unknown/open-ended distinctions in the actual contract. Reviewer attribution and correction/supersession history follow the reviewed lifecycle/Source verification design; do not invent extra version fields.

Do not redundantly store instrument_id, edition_id and provision_id unless justified for constraints or indexing and enforced consistent with wording_id. A provision with several languages may support the same effect; several Source relationships/citations can support one effects row. Additional distinct authority wordings can support or co-authorize an effect via reviewed Legal relationships; if jointly necessary multiple authorities cannot be represented precisely this way, resolve that cardinality before making wording_id mandatory in the contract. Never create duplicate effects merely to attach several downloaded copies.

Source relationships/citations point to legal.effects and its exact supporting locations. No embedded source URLs, file paths or mandatory single-source column. subject_table/subject_id must use a registry and transactional validation; use direct FK columns for fixed target designs where suitable, with any table-layout changes reviewed explicitly.

One row expresses one kind of effect on one target for a stated legal scope/period. An authority that establishes three bodies normally yields three effects, each independently evidenced. Distinct establish/govern effects are separate rows. Repeated extraction or new source support does not create a new legal effect. Design natural uniqueness to preserve historical/conditional/disputed claims without accidental duplication.

Hypothetical examples (not verified legal assertions or seed data): provision wording W1 establishes Institution A; W2 authorizes Office B; W3 governs Geographic Feature C; W4 abolishes Institution A from a stated date. The establishment record remains historical; abolition does not delete the institution or its prior effects. Mere quotation or mention belongs in references, not effects; amendment of legal wording belongs in relationships.

## Distinctions that must survive implementation

1. Legal edition versus Source publication edition versus immutable artifact bytes.
2. Stable provision identity versus exact language wording.
3. Textual mention versus substantive legal relationship.
4. Substantive relationship between legal objects versus effect on another domain record.
5. Official/research source classification versus text's legal authority versus review status.
6. Legal effective time versus publication, observation and retrieval time.
7. Historical evidence versus current preferred display/accepted selection.
8. Source derivation versus engine execution; no mandatory engine events in the provenance model.

The language registry is already central. No free-text language tags or invented default-English attribution should be reintroduced. Source controls external addresses; Filesystem controls exact files. Reference classification membership must be enforced rather than inferred from any arbitrary value_id.

## Examples

### Constitution

One instrument has a legal edition describing particular wording. Articles/clauses are stable provisions. Their authoritative language forms are wordings; ordinary translations are separate translations linked to exact wording. Language, role, evidence and reviewed authority never imply automatically equal legal force. Copies from several websites are Source captures/artifacts connected to those records. A reference from an article to another article is references; an actual amendment is relationships; establishment of a county is effects.

### Amendment and historical reading

An amending instrument supplies authority wording. A relationship identifies affected wording and resulting wording, with effective time and citations. Earlier text remains preserved. A reference recorded in the earlier text does not silently resolve to a later consolidation merely because it is now preferred.

### Institution or place

An effects row connects exact authority to an Official institution or Geography feature with an establishes/governs kind and applicable period. Media mentioning the institution/feature stays in Filesystem; spatial assets point to mandatory feature FK and optional same-feature geometry FK. Legal carries neither their files nor acquisition URLs.

## Migration and implementation work

Before changing definitions, inventory every incoming FK, generated model/API consumer, seed header, seed generation script, loader target and query. Current Source Documents/Evidence/Citations are not yet the target Source tables; coordinate their migration rather than updating Legal to nonexistent generated contracts.

Create deterministic mappings from instrument_versions to editions; provision_versions to wordings and provision_translations to translations with exact wording linkage; provision_references to references; amendments to relationships; bases to effects. Preserve old identifiers through explicit maps where necessary. Do not assume record IDs survive a rename: current seed IDs depend on table and natural identity. Stable codes, seed aliases and all dependent record references need coordinated resolution.

Preserve original/translated text alignment, exact span offsets, review/producers, dates, source locators and historical chains. Resolve locators into exact citations before removing the old column. Preserve existing evidence support before removing Evidence/document coupling. Map official/unofficial translation categories carefully: do not infer source authority or legal force automatically from the old mixed kind.

Keep applied migrations immutable; determine actual deployed state before generating a new migration strategy. No live writes are authorized. Update owning guides and links when behavior changes. The owner explicitly authorized script-driven repair of all existing affected seed/data CSVs, including structural replacements, as detailed in the implementation handoff. Do not seek repeat per-file approval for those mechanical repairs. Manifest validation remains required; unrelated new curated data still follows the normal owner approval workflow.

## Required contract checks

Verify meaningful cases: multiple sources reproducing one legal state; multiple formats without artificial new legal editions; multiple authoritative language forms; competing translations; same-instrument provision/edition constraints; root ordering and hierarchy cycles; historical references; span bounds/substring agreement; amendment target/result consistency; reviewed effects on existing targets; no direct acquisition URLs; complete provenance and seed-ID migration.

Verify actual Dryv IR and selected SQL output for composite FKs, uniqueness, checks, exclusion constraints and nullable-key semantics. Do not invent unsupported fluent methods or claim TypeScript compilation proves database enforcement. Exact field definitions and unresolved semantics must be reviewed before implementation approval.

## Mandatory shared subject contract and latest authority

Use the [SubjectReference standard](SUBJECT_REFERENCES.md) for effects and every equivalent single-subject generic association. No mixed target_table/target_id, table_name/record_id or subject aliases remain for that meaning after the coordinated breaking migration. This does not replace fixed legal wording FKs or collapse distinct I/O endpoint roles.

The owner now authorizes implementation through the implementation handoff, including script-driven repair of existing affected seed CSVs and complete Dryv regeneration/consumer repair. Earlier discussion-only wording documents chronology and must not be treated as a requirement to seek the same approval again. Implementation must preserve exact texts, translations, authority links and historical evidence.

## Implementation record

Implemented on 17 November 2026 under task TSK-A41C603B94BE: the nine tables are authored in `dryv/contracts/schemas/postgres/legal.ts`, generated into the SQL snapshot and verified on a disposable database. Choices made within the approved design:

- `legal.names.language_id` is `und` for the migrated Constitution title because the old title asserted no language; preferred names are unique per instrument and language among current (open-ended) names.
- `legal.relationships` has two levels (`affected_wording_id` or the instrument pair) selected by a check; the preferred relationship kinds are Reference values (`leg.relationship.kind`), none of which is seeded yet.
- `legal.references` and `legal.relationships` carry codes so they can be seeded; spans are bounded by `span_start < span_end` and checked against the exact text by the conversion script.
- `legal.effects` names its wording and subject through `wording_id` and the shared subject keys; the converted legal bases are `proposed` because the old rows carried no review state.
- Old translation kinds (`official`, `unofficial`, `proposed-draft`, `machine-proposed`) are preserved in `notes`; only `method` (`human`/`machine`) is derived from them, and nothing marks a translation as authority.
- Each wording's free-text locator became an exact citation: a PDF page of the registered artifact or the KLRC address.

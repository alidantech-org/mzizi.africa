---
{id: DOC-LEGAL-COMPLIANCE,name: LEGALITY_SAFETY_AND_COMPLIANCE,type: documentation,tags: [legal,compliance,privacy,security,sourcing,data-engine,website],extra: {status: "policy baseline; jurisdictional legal review required", last_reviewed: "2026-11-02"}}
---

# Legality, safety and regulatory compliance

## Purpose

This document establishes Mzizi Africa's baseline for discovering, accessing, collecting, preserving, analysing and publishing information from government and other public-interest sources across the countries and regions it targets.

It applies to:
- human researchers and contributors;
- AI agents that discover sources or author website structures;
- the website registry and `mzizi.site/v1` structure bundles;
- the data and database engines;
- source documents, captures, extraction results, staging candidates and canonical records;
- public APIs, dashboards, exports and other publication surfaces;
- vendors and processors acting for Mzizi.

The policy is jurisdiction-aware. Kenya is the initial reference jurisdiction, not a substitute for checking the laws of every country in which a source, person, institution, data subject, server or Mzizi operation is located.

**This is an engineering and governance baseline, not a legal opinion or a declaration that a particular source or collection activity is lawful.** Before production collection in a new country, the applicable laws, current amendments, regulator guidance, source conditions and actual processing must be reviewed by qualified counsel or an appropriately authorised privacy/compliance professional.

## 1. Core rule: public visibility is not blanket permission

A page or document being reachable without a login does not, by itself, establish that:
- automated collection is authorised;
- every linked document may be copied or republished;
- personal information may be freely reused;
- the source has an open licence;
- access conditions or rate limits may be ignored;
- the collection is lawful in every jurisdiction involved.

Mzizi should prefer official APIs, open-data portals, bulk downloads and explicitly licensed datasets. Automated website extraction is a fallback when a suitable structured source is unavailable and the access conditions have been assessed.

A public-interest purpose is relevant context, but it does not automatically override privacy, copyright, cybercrime, confidentiality, database rights, contractual restrictions or other applicable laws.

## 2. Legal domains to assess

Each jurisdiction review must consider the following domains. The names and scope of laws differ by country; this list is a review checklist, not an assertion that every country has identical rules.

| Domain | Questions Mzizi must answer |
|---|---|
| Access to public information | What information must or may public bodies disclose? Are there exemptions for privacy, security, investigations, procurement, commercial confidence or other protected interests? Is an access-to-information request the appropriate route? |
| Cybercrime and computer access | Does the proposed method involve unauthorised access, defeating security measures, credential use, interference, disruption or access to restricted systems? |
| Data protection and privacy | Is personal data involved? Who is controller and processor? What lawful basis, purpose, notice, rights, safeguards, retention and transfer rules apply? |
| Copyright and related rights | Who owns the document, database, photograph, map, software or other expression? What licence or statutory permission applies to copying, transformation and republication? |
| Database and information rights | Does the jurisdiction recognise database rights, government information reuse rules or special restrictions on bulk extraction? |
| Confidentiality and sector rules | Does the material include protected procurement, tax, health, education, identity, security, court, electoral or other restricted information? |
| Contract and website conditions | Are terms of use, API terms, licence terms or other enforceable conditions applicable? What do they say about automated access and reuse? |
| Cross-border processing | Where are people, organisations, systems and processors located? What transfer, localisation, adequacy, contract or regulator requirements apply? |
| Consumer, defamation and publication risk | Could derived claims be misleading, defamatory, improperly attributed or presented without necessary context and corrections? |

The compliance review must assess the law in force at the time of collection and publication, including amendments, regulations, binding decisions and regulator guidance. Do not rely on an old summary or assume a law has not changed.

## 3. Kenya reference baseline

For collection from Kenyan public institutions and processing in or connected with Kenya, the initial legal review must include at least:

### 3.1 Constitution and access to information

- Constitution of Kenya, including Article 31 (privacy) and Article 35 (access to information).
- Access to Information Act, 2016 and applicable regulations, including the Access to Information (General) Regulations, 2023.

The constitutional right of access and statutory disclosure duties support access to public information. They do not create an unrestricted technical licence to automate every website or reuse every item found online. Use formal access-to-information procedures where material is not openly available or where the appropriate route is unclear.

### 3.2 Data protection

- Data Protection Act, 2019.
- Data Protection (General) Regulations, 2021.
- Data Protection (Registration of Data Controllers and Data Processors) Regulations, 2021.
- Data Protection (Complaints Handling and Enforcement) Regulations, 2021.
- Current Office of the Data Protection Commissioner (ODPC) guidance and decisions.

Treat personal data found on a public website as personal data. Public availability is not a blanket exemption from the Act. Identify and document a lawful basis, defined purpose, necessity, proportionality, data minimisation, transparency, accuracy, retention, security and data-subject rights. Assess registration obligations, processor arrangements, DPIA requirements and cross-border transfer rules against Mzizi's actual activities.

Do not assume that information about public officials, beneficiaries, voters, tender participants or residents is all treated identically. Assess the context, purpose and sensitivity of each category.

### 3.3 Computer access and cybercrime

Review the Computer Misuse and Cybercrimes Act, 2018, including applicable amendments, regulations and current interpretations. The Communications Authority / KE-CIRT and other competent authorities may publish relevant legal and cybersecurity material.

Mzizi must not access restricted systems or defeat authentication, CAPTCHAs, blocks or other technical controls without appropriate authority; must not use credentials without authority, exploit vulnerabilities or interfere with a site's operation. Approved testing, publisher-authorised research access and documented challenge-resolution workflows may use browser automation and specialised adapters within their express scope. A public URL alone is not permission to access a restricted system behind it.

### 3.4 Copyright and reuse

Review the Copyright Act, 2001, as amended, and any applicable public-sector information, open-data or dataset-specific licence.

A downloadable government report is not automatically public domain. Record the rights holder where known and the actual licence or legal basis for reuse. Distinguish extracting unprotected facts from copying protected expression, layouts, photographs, maps, tables or substantial database contents. Attribution alone does not replace permission where permission is required.

### 3.5 Kenya source references

Use authoritative, current texts rather than secondary summaries:

- [Kenya Law — legislation portal](https://new.kenyalaw.org/legislation/)
- [Office of the Data Protection Commissioner — regulatory framework](https://www.odpc.go.ke/data-protection-laws-kenya/)
- [Commission on Administrative Justice — Access to Information](https://ombudsman.go.ke/access-information-center)
- [KE-CIRT — law and regulations](https://ke-cirt.go.ke/law-regulations/)
- [National Computer and Cybercrimes Coordination Committee — legal and policy library](https://nc4.go.ke/regulations)

These links are starting points. Confirm the current consolidated text, commencement, amendments and applicability before relying on a provision.

## 4. African and other regional coverage

Mzizi's African scope does not mean there is one uniform African data-collection law. Each country has its own constitutional, privacy, cybercrime, copyright, access-to-information, public-records and sector-specific framework. Regional instruments can inform or bind participating states, but their legal effect depends on ratification, entry into force, domestic implementation and the particular country.

The African Union Convention on Cyber Security and Personal Data Protection (Malabo Convention) is an important regional reference. It is not a replacement for country-by-country legal review. Check the African Union's current treaty status list and the domestic implementation position for each target country.

For countries outside Africa, perform the same jurisdiction-specific analysis. For example, where relevant, assess EU/EEA GDPR and database rights, UK GDPR and copyright/database rules, or applicable United States federal and state privacy, computer-access and copyright laws. Do not apply these examples mechanically: determine the actual territorial and personal scope of each law.

Official regional starting points:
- [African Union — Convention on Cyber Security and Personal Data Protection](https://www.au.int/en/treaties/african-union-convention-cyber-security-and-personal-data-protection)
- [African Union — treaty status and instruments](https://www.au.int/en/treaties)

A jurisdiction dossier must record the local regulator, official legislation repository, applicable treaty status and the date each was checked.

## 5. Mzizi collection policy

### 5.1 Permitted collection posture

Subject to source-specific and jurisdiction-specific review, Mzizi may prioritise:
- official laws, gazettes, budgets, plans, public reports and public notices;
- aggregate statistics and non-personal public datasets;
- administrative boundaries and other appropriately licensed geospatial datasets;
- public institutional directories and official office-holder information where necessary and proportionate;
- public procurement notices and awards, subject to confidentiality, personal-data and licence review;
- documents and data supplied directly by a public body or released under an applicable open licence.

Prefer, in order:
1. official API or documented machine interface;
2. official bulk download or open-data portal;
3. an explicitly licensed data repository;
4. a public webpage or document with assessed access and reuse conditions;
5. a formal information request or direct permission where the above routes are unavailable or uncertain.

### 5.2 Source-authorised collection methods and prohibitions

Mzizi may develop standard and anti-bot-resilient browser adapters, configurable client identities, CAPTCHA/challenge handling and robots-policy modes. These capabilities are not automatically prohibited by their technical names. Their use against a particular source requires an approved assessment establishing the relevant access basis, scope, conditions and method; a source owner may authorise testing or enhanced automated access.

Without adequate authority, agents and operators must not:
- defeat authentication, authorisation, CAPTCHAs, paywalls or other technical access controls;
- use stolen or otherwise unauthorised credentials;
- exploit a vulnerability or access a non-public system;
- circumvent an explicit block or access restriction using identity, proxy or account rotation;
- impersonate another party or misrepresent authorisation.

Regardless of source approval, do not cause or knowingly risk material degradation or disruption, exceed approved request limits, collect from guessed private endpoints outside scope, or continue after a credible legal objection without review and documented resolution.

Record a site's `robots.txt` as an access-policy signal; it is not by itself a complete legal analysis, licence or permission. The default mode is `respect`. An `override` may be approved per source when supported by the documented access basis and review, with a rationale, bounded scope and auditable execution. Neither the existence of `robots.txt` nor its absence alone establishes legal permission.

### 5.3 Polite and bounded access

Every automated source must have:
- a documented client identity/profile strategy consistent with source approval, with a monitored contact channel for normal identified crawls;
- a documented request rate and concurrency ceiling;
- bounded retries with exponential backoff and jitter;
- caching and conditional requests where supported;
- request and response size limits;
- timeouts and circuit breakers;
- a clear stop-or-review condition for 401, 403, 429, repeated 5xx, explicit blocks or access challenges; approved challenge-handling workflows may resume only inside recorded authorisation and request budgets;
- no unbounded retry loop or attempts to defeat an unapproved restriction.

Use the most conservative of the source's published limits, the approved source policy and the engine's global safety limits. If no reliable limit is published, begin conservatively and obtain permission where the expected volume or impact is material.

## 6. Personal data and sensitive information

The default collection scope is public institutional, legal, geographic and aggregate statistical information. Personal data must not be collected merely because an agent can find it.

Before collecting personal data, document:
- the specific and legitimate purpose;
- the applicable lawful basis in each relevant jurisdiction;
- why identifiable data is necessary instead of aggregate or anonymised data;
- categories of people and data involved;
- whether sensitive or specially protected data is present;
- transparency and notice arrangements;
- access controls, retention period and deletion/correction process;
- recipients, processors, hosting locations and cross-border transfers;
- whether a DPIA, regulator consultation, registration or other prior step is required.

Default exclusions requiring specialist review and explicit approval include:
- national identity numbers and equivalent unique identifiers;
- biometric data;
- health and medical information;
- financial account credentials or detailed personal financial records;
- precise home addresses and personal contact details;
- information about children;
- political opinions, party membership, religious beliefs, ethnicity, union membership, sexual life or other specially protected attributes;
- criminal allegations, investigations and conviction records;
- beneficiary, voter or other person-level lists where the purpose and lawful basis are not established.

Do not infer sensitive attributes from unrelated public records. Do not create person profiles by combining unrelated sources without a documented necessity and legal review. Public-office information must remain contextualised to the official role and relevant period.

## 7. Copyright, licences and publication

For each source document or dataset, capture:
- rights holder or publisher, where known;
- licence name and version, or the specific statutory/public-sector reuse basis;
- licence URL or evidence of permission;
- attribution wording and required notices;
- commercial-use, adaptation, redistribution and share-alike conditions;
- exclusions, third-party materials and expiry or revocation conditions;
- the reviewer and date of the assessment.

If the licence is missing, ambiguous, incompatible with Mzizi's intended use or appears to prohibit the intended reuse:
- preserve only what is necessary for a lawful internal assessment, if permitted;
- do not publish the original or substantial protected content;
- seek permission, use an alternative source, or exclude it;
- record the decision and its rationale.

For public outputs, prefer factual values and short, necessary quotations with clear citations over reproducing whole reports. A source link and attribution are good provenance, but do not cure an otherwise unauthorised reproduction.

## 8. Approvals and AI agent boundaries

Updated by DEC-AUTO-APPROVAL: an AI agent or a person may approve, always as a named account and with the rule recorded. The lists below remain the limits of what an agent may conclude on its own judgement; trusted domain suffixes and the approval permissions are how approval is delegated.

AI agents may:
- discover candidate sources and official domains;
- classify source types and propose jurisdiction, publisher and authority;
- inspect public pages and propose structure bundles;
- suggest selectors, mappings, document types and drift expectations;
- identify possible personal data, licence terms, access restrictions and legal-review triggers;
- generate evidence-backed review summaries.

AI agents must not:
- declare a source legally approved solely from a page scan, except under a recorded trusted-domain rule;
- infer permission from public reachability;
- override a restriction or legal-review decision recorded against another account;
- decide that personal-data processing has a lawful basis without accountable review;
- bypass a block or security control outside a separately recorded, source-authorised workflow;
- publish uncertain licence conclusions as facts.

**Separate technical validation from legal/source approval.** A structure may pass JSON Schema, static checks and dry-run validation while its source remains legally unapproved. Structure publication must not activate collection unless the source's access policy and legal status permit it.

For each source, the approving account (a person, an AI agent, or the trusted-domain rule) should confirm identity and authority, jurisdiction, access route, terms, licence, data categories, purpose, request policy and publication scope. Sensitive or ambiguous cases require legal/privacy review.

Extracted records remain subject to Mzizi's existing candidate, validation, review and promotion lifecycle. Technical extraction success is not legal approval or proof that a record is accurate.

## 9. Required source registry controls

The source registry and website metadata should represent legal and operational status explicitly. The following is a logical requirement; it does not claim these fields or migrations are already implemented.

### 9.1 Source-level legal assessment

Each source should have a review record (or equivalent versioned metadata) containing:

| Field | Purpose |
|---|---|
| `jurisdiction_code` | Country or territory whose law and source authority are being assessed |
| `publisher_id` / authority evidence | Identifies the public body, institution or publisher and why it is considered authoritative |
| `source_type` | API, open-data portal, official website, document repository, third-party repository, etc. |
| `access_basis` | Open endpoint, published terms, open-data licence, written permission, access-to-information response, other documented basis |
| `access_conditions` | Relevant terms, robots signal, rate limits, authentication requirements and prohibited paths |
| `licence_name`, `licence_url`, `licence_version` | Reuse terms and evidence |
| `rights_holder` | Known owner or rights holder; unknown must remain explicit |
| `personal_data_categories` | Data categories expected or observed, including a clear none-known state |
| `processing_purpose` / `lawful_basis` | Purpose and jurisdiction-specific legal basis where personal data is involved |
| `legal_review_status` | `not_reviewed`, `in_review`, `approved`, `approved_with_conditions`, `restricted`, `rejected`, `expired` |
| `approved_scope` | What may be collected, how, at what frequency, and what may be published |
| `reviewed_by`, `reviewed_at`, `review_due_at` | Accountable reviewer and review lifecycle |
| `evidence_refs` | URLs, saved terms, written permission, legal advice reference or regulator guidance |
| `conditions` / `decision_rationale` | Restrictions and reason for the decision |

Keep review history. A material change in law, terms, ownership, domain, data category, collection method or publication purpose should trigger reassessment.

### 9.2 Structure-level execution policy

The `mzizi.site/v1` manifest or associated site policy should eventually express machine-enforceable operational constraints, such as:
- approved source and legal-review reference;
- allowed hosts, schemes and path scope;
- fetch modes and allowed endpoints;
- maximum request rate, concurrency, retries and response size;
- prohibited paths and data categories;
- authentication mode (v1 must remain unauthenticated unless a separately reviewed capability is introduced);
- robots observations and the approved `respect` or `override` mode with rationale;
- browser adapter, session and access-challenge handling permissions, when applicable;
- allowed collection and publication purposes;
- stop conditions and escalation route.

A structure is a technical recipe, not a licence or legal authorisation. Do not put secrets, passwords, cookies or access tokens in structure bundles.

### 9.3 Status gates

At minimum, use these semantics:

| Legal/source status | Collection behaviour |
|---|---|
| `not_reviewed` | Discovery and limited assessment only; no scheduled or bulk extraction |
| `in_review` | No production collection; reviewer may authorise a narrowly scoped assessment |
| `approved` | Collect only within the approved scope and current conditions |
| `approved_with_conditions` | Enforce the stated conditions; fail closed if they cannot be enforced |
| `restricted` | Pause the affected collection or publication scope pending resolution |
| `rejected` | Do not collect; retain only the minimum decision/audit evidence needed |
| `expired` | Pause production collection until review is renewed |

A source can be technically reachable and structurally healthy while legally restricted. Legal status must be an independent gate, not inferred from reachability or extraction success.

## 10. Drift, complaints and incident response

Legal and source conditions can change independently of page structure. Monitor:
- terms of use, licence and robots changes;
- domain ownership, publisher identity and redirects;
- new login walls, CAPTCHA, access challenges or explicit blocks;
- new personal-data fields or unexpected sensitive content;
- regulator notices, legal objections, takedown requests and rights-holder complaints;
- changes to applicable legislation and regulator guidance.

On a credible restriction, complaint, unexpected sensitive-data discovery or legal-status expiry:
1. stop the affected collection and prevent new scheduled jobs;
2. quarantine affected candidates and prevent promotion/publication;
3. preserve relevant evidence and logs with appropriate access restrictions;
4. notify the designated privacy/legal owner;
5. assess scope, affected data, recipients and any notification duties;
6. correct, restrict, remove or retain material only as legally directed;
7. document the decision and conditions for resumption.

A site structure drift check is not a substitute for legal monitoring. A technically healthy site may become legally restricted without any HTML or API change.

## 11. Cross-border hosting and processors

For each deployment and data flow, identify:
- where Mzizi's entity and operational teams are established;
- where data subjects and source institutions are located;
- where raw documents, extracted data, backups and logs are stored;
- which AI providers, cloud providers and subprocessors receive source material;
- whether any personal data is sent across borders;
- the applicable transfer mechanism, localisation requirement, contractual terms and security controls.

Do not send personal, confidential or restricted source content to an external AI provider until the provider's role, processing terms, data location, retention, training use, subprocessors and transfer basis have been assessed. Prefer redaction or minimisation before external processing.

## 12. Accountability and operational ownership

Before production collection, Mzizi should designate accountable owners for:
- legal and jurisdictional review;
- privacy/data protection;
- source approval and licensing;
- security and incident response;
- technical source structures and extractor operation;
- public corrections, complaints and takedown handling.

One person may hold multiple roles in an early-stage project, but each decision must have a named accountable reviewer and an auditable record. Agents are assistants, not accountable legal decision-makers.

Maintain a jurisdiction register with:
- target country/territory and planned product scope;
- official legislation repository and regulator;
- applicable privacy, cybercrime, copyright, access-to-information and reuse laws;
- treaty status where relevant;
- local counsel/reviewer and review date;
- open questions and conditions for launch.

No country should move from research to production collection solely because its domain patterns or website structures have been generated.

## 13. Launch checklist for each new jurisdiction

- [ ] Identify the legal entity and operational footprint relevant to the activity.
- [ ] Identify the official legislation repository, privacy regulator and competent cyber/security authority.
- [ ] Review current access-to-information, privacy, cybercrime, copyright, public-records and relevant sector laws.
- [ ] Check amendments, regulations, regulator guidance and relevant treaty status.
- [ ] Assess whether Mzizi must register, appoint a representative/DPO, conduct a DPIA or meet localisation/transfer conditions.
- [ ] Define allowed source categories, collection methods and prohibited material.
- [ ] Establish source terms, licence and reuse review.
- [ ] Approve request-rate, identification, caching, stop and complaint procedures.
- [ ] Define personal-data exclusions, lawful bases, notices, retention and rights handling.
- [ ] Review AI/cloud processors and cross-border transfers.
- [ ] Approve the first source inventory and a limited pilot.
- [ ] Confirm that technical structure activation is gated by source approval.
- [ ] Record reviewer, evidence, decision, conditions and next review date.

## 14. Implementation alignment with existing Mzizi architecture

This policy is intended to integrate with, not replace, existing design documents:

- `design/acquisition/WEBSITE_DESIGN.md`: site identity, domains, publishers, immutable structures, checks and family inheritance.
- `design/acquisition/SITE_STRUCTURE_SPEC.md`: declarative collection recipes, bounded fetch behaviour, notes, validation and drift expectations.
- `DATA_INTAKE_PLAN.md`: source registration, preservation, extraction, staging, review and controlled promotion.
- `design/architecture/DATA_LIFECYCLE.md`: evidence custody, provenance, review and version history.
- `design/data/SOURCING_DESIGN.md`: publisher and source authority.
- `rules/security.md`: system security and handling of untrusted agent output.

Implementation consequences:
1. Add source-level legal assessment and approval gates before enabling scheduled or bulk collection.
2. Keep technical structure validation distinct from legal approval.
3. Make the engine fail closed when legal status is missing, expired, restricted or outside the approved scope.
4. Record the legal-review version/reference on each capture so a later review can identify which approval governed collection.
5. Route unexpected personal data, sensitive content, licence ambiguity and access challenges to review rather than silently extracting or promoting.
6. Add legal-condition drift checks alongside technical website drift checks.
7. Keep source evidence, approval decisions and changes auditable and versioned.

These are design requirements, not a statement that the fields, gates or workflows are already implemented.

## 15. Review and disclaimer

Review this document at least annually and whenever Mzizi enters a new jurisdiction, changes its collection or publication purpose, introduces a new processor/AI provider, or receives a material legal or regulatory update.

The legal references above are an initial research map. They must be checked against authoritative current texts and applied to Mzizi's actual facts by qualified local counsel. Nothing in this document guarantees that a particular scraping activity, dataset, source, extraction method or publication is lawful.

---
id: DOC-9A8E56DB1C15
name: Person identity, media enrichment and community-assisted data refinement
type: documentation
tags: [improvements, person, identity, participation, media, avatars, provenance, privacy]
extra: {status: planning_only, implementation_approved: false, task_creation: user_directed_only, biometric_processing_approved: false}
---

# Person identity, media enrichment and community-assisted data refinement

**Status: planning only.** This document records the Mzizi direction discussed on 2026-11-07. It does not authorize a new schema, biometric processing, mass image collection, a new storage service, or changes to canonical person records.

## 1. Purpose

Mzizi needs a reliable way to maintain real-world person identities while collecting information from fragmented websites, historical records, institutional profiles, electoral sources and community knowledge.

Three connected capabilities are proposed:

1. **Person identity resolution:** detect possible duplicate people, distinguish people with similar names, preserve aliases and historical identity evidence, and make merges reversible.
2. **Person media enrichment:** discover official portraits wherever they occur in HTML/CSS or linked profile pages, download permitted images, preserve provenance, and maintain a well-attributed display portrait.
3. **Community and institutional refinement:** allow citizens, local watchers, verified officials and administrators to identify errors, submit evidence and resolve uncertain data through a reviewable workflow.

The product-facing participation concept may be called **Make Mzizi Better**, with a focused **Mzizi Swipe** experience for quick comparisons such as “same person”, “different people” and “not sure”.

## 2. Existing architecture to reuse

This proposal must build on the current designs rather than create parallel ownership:

- `person` represents a real individual independently of any current or former office. A person outlives their office, party membership and platform account.
- Mzizi accounts and people are different concepts. A contributor account may be linked to a person, but most people in the knowledge base will never have an account.
- `filesystem` owns file metadata and media relationships. The current people design places portraits and gallery images in `filesystem.attachments`, using a role such as `portrait`, rather than a portrait URL or binary column in `person`.
- The existing files service owns bytes and uses the already deployed S3-compatible object store. Do not introduce a second object store for portraits.
- `source` owns publisher/document/capture/method/provenance and claim attribution. An image's source URL and the page/capture that exposed it must remain traceable.
- The website legal/source assessment and site-structure policy remain the admission gate for collection. A structure file is not permission to fetch or republish content.
- `audit`, candidate/staging workflows and existing review patterns should be evaluated before introducing a new participation or identity-review schema.

See [People and identity design](../../design/data/PEOPLE_DESIGN.md), [Filesystem design](../../design/data/FILESYSTEM_SCHEMA.md), [Sourcing design](../../design/data/SOURCING_DESIGN.md), [Website design](../../design/acquisition/WEBSITE_DESIGN.md), and [Data lifecycle](../../design/architecture/DATA_LIFECYCLE.md).

## 3. Identity principles

### 3.1 Person identity is not a name, image or office

A name can be shared, abbreviated, transliterated, misspelled or reordered. A portrait can be old, miscaptioned, copied or attached to the wrong page. An office is a time-bounded relationship, not the person's identity.

Candidate matching should combine available evidence such as:

- stable official identifiers, where lawfully and appropriately available;
- names, aliases, honorifics, spelling variants and transliterations;
- source profile URLs and institutional identifiers;
- office, institution, jurisdiction and assembly/election term;
- dates and temporal overlap;
- source-document references and corroborating biographies;
- profile-page links and the context of the page block where a name and image occur;
- optional, separately governed image-comparison signals only if later approved.

Names alone, shared offices, common photographs, a single citizen vote or an AI similarity score must never trigger an irreversible merge.

### 3.2 Separate three outcomes

- **Same person:** two source records are believed to refer to one individual.
- **Different people:** the records are distinct individuals, even if names or other attributes overlap.
- **Unresolved:** the available evidence is insufficient or contradictory.

The system must preserve uncertainty. “Not sure” is a valid outcome, not a failed review.

### 3.3 Merge and split must be reversible

A confirmed merge should preserve original source identifiers, source attributions, prior record IDs, old relationships, merge reason, reviewer, timestamp and decision version. It should establish a traceable canonical identity and aliases/redirects without destroying the original evidence.

A later split must be able to restore distinct identities and reassign relationships without losing source history. A merge is a reviewed identity decision, not destructive deduplication of raw records.

## 4. Make Mzizi Better: contributor and reviewer roles

The same underlying contribution capability should be available to citizens and administrators, with different permissions and review responsibilities.

| Actor | What they can do | How their input is treated |
|---|---|---|
| Citizen | Report an incorrect record/photo, compare possible identities, suggest a correction, submit a public source, identify a missing person/profile | A useful lead or evidence submission; not automatically canonical |
| County/local watcher | Review records for selected counties, wards, institutions or topics; report omissions and local naming/context issues | Local knowledge helps prioritize and explain a review; corroboration remains important |
| Verified institutional official | Submit or attest information about their institution, officeholders, publications, dates and official portraits | High-authority, institutionally attested evidence within the verified official's actual mandate and scope |
| Mzizi administrator/data steward | See all submissions, inspect evidence and contributor history, resolve conflicts, approve/reject corrections, merge/split identities and record reasons | Authorized editorial decision with an attributable audit trail |
| Automated agent/model | Generate candidate matches, identify ambiguity, classify reports, find corroborating sources and summarize disagreements | Machine-generated recommendation; never silent canonical truth |

### 4.1 Official input and trust

The user's intended distinction is that verified officials' input should be trusted much more strongly than anonymous community feedback. The design should implement that through **verified authority and scope**, not a blanket rule that any account labelled “official” can change any fact.

Before institutional attestation is treated as official, verify the account's institutional affiliation, current authority, jurisdiction and permitted subject matter. Store the capacity in which the person submitted the information and the evidence supporting that authority.

For routine, low-risk, institution-owned facts, an approved policy may allow a verified official's direct attestation to be accepted or fast-tracked without the same queue as an anonymous suggestion. Conflicting claims, disputed historical facts, person merges/splits, high-impact corrections and claims outside the official's remit still require review and corroboration. An official account must not gain global authority over all Mzizi domains.

### 4.2 Administrator experience

Administrators should have the citizen contribution experience plus a dedicated review queue showing:

- the canonical record and proposed change side by side;
- the affected person, office, institution, geography, period and source;
- original source captures, profile pages, image files and evidence locators;
- citizen responses grouped by “same”, “different” and “not sure”;
- independent contributor count and relevant contribution history;
- verified official attestations and their scope;
- agent/model recommendations, uncertainty and explanation;
- conflicting sources and previous decisions;
- actions to accept, reject, request evidence, mark unresolved, merge, split, or supersede a previous decision.

The admin view should show what citizens said, not simply a popularity percentage. It should let an administrator distinguish many coordinated clicks from independent, evidence-backed contributions.

### 4.3 Mzizi Swipe

A focused swipe/card interaction can make repeated identity review approachable:

- compare two person records with names, aliases, offices, geography, dates, source links and permitted portraits;
- allow “same person”, “different people” and “not sure”;
- explain why, optionally attach a public source or correction;
- skip cases outside the contributor's knowledge;
- prevent the same contributor from repeatedly voting on the same pair to inflate a count;
- retain the exact pair/version presented, so a later change does not rewrite what the contributor saw.

Swipe results are triage signals. A majority vote alone does not establish identity.

## 5. Contribution lifecycle and quality controls

A proposed logical flow is:

```
citizen / official / agent identifies an issue
  -> create a scoped contribution against a record or candidate
  -> retain explanation, source/evidence and submission context
  -> deduplicate repeated reports without deleting independent attestations
  -> group related feedback for administrator review
  -> compare official sources, temporal facts and identity evidence
  -> accept / reject / request more evidence / leave unresolved
  -> apply an authorized, versioned correction or identity decision
  -> retain decision, prior value, new value and provenance
```

A contribution should conceptually retain: target entity and field; proposed value or relationship; contribution type; source artifact/URL; evidence locator; submitter/account and verified role; jurisdiction/topic scope; claimed valid time; submission time; explanation; status; review decision; and links to earlier or duplicate reports. These are logical information needs, **not approved columns or tables**.

Quality controls should include rate limits, abuse reporting, spam/brigading detection, duplicate-submission grouping, conflict visibility, appeal/reconsideration, privacy-preserving contributor reputation, and audit logs. Do not publish contributor rankings that encourage volume over accuracy. Do not expose private reviewer or contributor details unnecessarily.

Community feedback can become training data only after a decision is independently reviewed and labelled with its evidence and outcome. Raw votes, rejected reports and unresolved cases must not silently become ground-truth labels.

## 6. Person portrait and avatar enrichment

### 6.1 Coverage goal

For public people modeled by Mzizi—especially elected representatives, public officeholders, institutional leaders and other well-documented figures—the research system should actively look for an attributable official or otherwise appropriately licensed portrait rather than silently leaving an empty avatar.

This is a research/coverage goal, not a requirement to find or publish an image for every person. A person may have no suitable public portrait; a historical image may be uncertain; a private individual or child may require a stricter policy. Missing is better than a misidentified face.

### 6.2 Image discovery surfaces

The generic website/media extractor should recognize image references in:

| Source | Discovery method |
|---|---|
| `img[src]` | Standard image URL |
| `img[srcset]`, `picture/source[srcset]` | Responsive image variants and candidate sizes |
| Lazy-loading attributes | Common `data-src`, `data-srcset`, `data-lazy-src` and equivalent attributes |
| Inline `style` | Parse CSS declarations such as `background-image: url(...)` |
| Linked/external stylesheets | Parse CSS `url(...)` references and preserve stylesheet provenance |
| CSS pseudo-elements | Optional rendered-browser/computed-style inspection for `::before` and `::after` |
| Open Graph/Twitter metadata | `og:image`, `twitter:image` and related metadata |
| JSON-LD | Image fields on structured Person/Article/Organization records |
| SVG | Relevant `image` references and embedded assets |
| JavaScript-rendered DOM | Optional browser fallback only where static HTML/CSS cannot reveal the actual image |

Resolve relative URLs against the correct base: an image path inside an external stylesheet is relative to the stylesheet URL, not automatically the page URL. Preserve the original reference and the resolved URL. Do not treat every CSS background as a portrait: logos, decorative textures, banners, flags and icons are different asset classes.

### 6.3 Associate an image with a person using context first

A useful example is a repeated assembly member card where one DOM container holds a member name, ward, profile link and CSS background portrait. The extractor should preserve that shared container as a content block and associate its image candidate with the same person candidate and profile link.

Preferred evidence order:

1. explicit image on the person's official profile page;
2. image within a clearly identified person/member card that links to that profile;
3. structured metadata on an official person profile;
4. another authorized institutional source that clearly identifies the person;
5. other sources only after provenance and rights checks.

A site logo, image filename, nearby text alone or a visual similarity result is not sufficient to establish who is depicted. Keep the association as a candidate until it meets the applicable verification policy.

### 6.4 Download and store through the existing file system

The media workflow should:

1. pass the source/site collection assessment and allowed fetch scope;
2. record the page capture, CSS file or metadata location that exposed the image;
3. fetch the asset with bounded size/time, redirect and SSRF protections;
4. validate actual MIME type, file signature, dimensions and decode safety;
5. compute an exact content hash and check existing objects;
6. store bytes through the existing files service and S3-compatible backend;
7. create/reuse the existing filesystem file/version and attachment relationship;
8. retain original URL, referring page/capture, stylesheet URL where applicable, retrieval time, rights/licence evidence, media type, dimensions, checksum and discovery method;
9. associate the attachment with the person only after evidence review;
10. select a display portrait under an explicit current/dated image policy.

The existing `filesystem.attachments` concept with `target_kind`, `target_id`, `file_id`, `role` and `position` is the first place to evaluate. A person's portrait should use the existing portrait role. Do not add `person.avatar_url`, duplicate image-byte columns, or a new media schema by default.

### 6.5 Deduplication and refresh

- SHA-256 identifies exactly identical bytes; keep every source sighting/attribution even when the physical object is reused.
- Perceptual image hashes may suggest that two files are resized/recompressed versions of the same picture. They are a review/deduplication signal, not proof that two photos depict the same person.
- Different photographs of the same person are separate media artifacts, not duplicates.
- Re-fetch/refresh should use existing URL validators, source freshness policy and content hashes. If the source replaces a portrait, retain the prior version and its dates rather than overwriting it.
- Track image coverage states conceptually: missing, discovered, fetch pending, stored, person association pending, verified, rejected, outdated, or unavailable. These may be engine/candidate statuses or derived coverage, not necessarily new person columns.
- An avatar selection should retain why it was chosen, who reviewed it, its valid/observed dates and source evidence.

### 6.6 Rights and security

A publicly reachable image URL does not automatically grant a licence to republish it. Apply source terms, copyright/licence, attribution, publication scope, privacy and retention rules. Do not bypass authentication, CAPTCHAs or access restrictions. Restrict image dimensions/bytes, validate redirects and content types, scan or sandbox risky decoders, and avoid exposing private object keys.

## 7. Facial recognition: optional, separate and legally gated

Facial technology has different tasks:

- **Face detection:** locate a face in an image.
- **1:1 face verification:** compare two selected images and estimate whether they may depict the same person.
- **1:N face identification:** search a face against a collection of people/images.

These are not interchangeable. The first can support image quality checks; 1:1 verification may be considered as a restricted reviewer aid; broad 1:N identification creates a much larger biometric database and risk.

Candidate tools for controlled technical research include [CompreFace](https://github.com/exadel-inc/CompreFace), [DeepFace](https://github.com/serengil/deepface) and [InsightFace](https://github.com/deepinsight/insightface). They are not selected or approved. Review the licence for both software and each pretrained model/weight, commercial-use terms, model provenance, bias/performance across African populations, security and operational requirements before any experiment.

**Default decision: do not generate, store or search facial embeddings for Mzizi people at this stage.** Start with source-context association, exact/perceptual image deduplication and human review. Do not put facial embeddings into the general-purpose vector database.

Any future biometric proposal requires a separate legal, privacy and security approval before a pilot. Kenya's Data Protection Act defines biometric data by specific technical processing of physical, physiological or behavioural characteristics and includes biometric data in sensitive personal data. ODPC materials also explain that photographs and recordings are personal data, and its 2025 biometric guidance describes controller/processor registration and transparency obligations. See the [Data Protection Act](https://new.kenyalaw.org/akn/ke/act/2019/24/eng@2019-11-15/source), [ODPC FAQ](https://odpc.go.ke/faqs/index.html), [ODPC Guidance Note on Biometric Data (2025)](https://www.odpc.go.ke/wp-content/uploads/2025/11/ODPC-%E2%80%93-Guidance-Note-on-Biometric-Data.pdf), and [ODPC DPIA guidance](https://www.odpc.go.ke/odpc-guidance-note-on-data-protection-impact-assessment/).

Before any biometric processing, obtain qualified Kenyan legal/privacy review; determine and document an appropriate lawful basis for sensitive data; complete the required DPIA and ODPC registration/notification steps where applicable; define purpose limitation, data-subject transparency and rights, access restrictions, security, retention/deletion, processor and cross-border controls; and test error rates and disparate performance. Public availability of a portrait is not by itself permission to create a biometric template.

A face score is never proof of identity. No automatic identity merge, adverse public label or canonical correction may be based on facial similarity.

## 8. Review metrics and acceptance questions

Future evaluation should measure:

- precision of accepted person merges and splits;
- false-merge rate (especially harmful) and false-split rate;
- proportion of proposed identities with independent evidence;
- portrait discovery coverage for eligible public-person cohorts;
- correct person-to-portrait association precision, not merely download count;
- share of portraits with complete source, rights and capture provenance;
- stale/replaced portrait detection and successful refresh;
- contribution usefulness, independent corroboration, resolution time and appeal outcomes;
- abuse/brigading detection and privacy incidents;
- accessibility and usability of swipe and administrator review.

A high avatar coverage percentage is not success if portraits are assigned to the wrong people. A high vote count is not success if the feedback is coordinated or unsupported.

## 9. Open decisions — no implementation approved

1. Which person cohorts are eligible for active portrait enrichment, and what exceptions apply?
2. Which source/rights classes allow download, storage and public display?
3. What qualifies as an institutionally verified official, and how is their mandate verified and time-bounded?
4. Which routine official attestations may be fast-tracked or accepted automatically?
5. Which identity changes require one reviewer, dual review or a specialist?
6. How are contributor privacy, reputation, abuse, appeals and public transparency handled?
7. Which existing staging/audit structures can support participation without a new schema?
8. Is any biometric use necessary after non-biometric methods are evaluated, and can it be justified lawfully?

**No new `participation`, `biometric`, `person_media` or other schema is approved by this document.** Review existing `person`, `identity`, `filesystem`, `source`, `audit`, staging and candidate contracts first.

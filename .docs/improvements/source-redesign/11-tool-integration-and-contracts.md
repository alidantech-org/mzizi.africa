---
id: DOC-9A8E56DB1C12
name: Tool connection contracts and source extraction pipeline adapters
type: documentation
tags: [improvements, source-redesign, tools, integration, contracts]
extra: {status: planning_only, implementation_approved: false}
---

# 11 — How to connect the tools without duplicating services

**Candidate integration contract; not implemented.** Reuse current Mzizi service boundaries. In particular, extraction belongs to the data engine, classification to intelligence, raw/derived file persistence to filesystem and the already deployed S3-compatible service, and validation/promotion to database engine and review. The future NestJS product API is downstream of canonical data.

## Logical pipeline and ownership

~~~text
verified institution / research question / candidate site
  -> registered source identity + legal policy / crawl scope
  -> one engine-owned scheduler, budgets, host politeness and idempotent jobs
  -> HTTP fetch adapter (current engine or evaluated Scrapy/Crawlee)
        -> optional Playwright/rendered fetch ONLY where required
  -> immutable source capture through filesystem -> existing S3
  -> persist URL, redirects, links, anchors, visits/observations and status
  -> DOM regions / optional Trafilatura or Crawl4AI text extraction
  -> immutable Markdown, DOM blocks, tables and PDF derivatives
  -> domain vocabulary + lexical/BM25/site and link-graph ranking
  -> optional vector index + specialist ML rerank
  -> LLM on small selected evidence/target schema only when needed
  -> attributable extraction proposal and review/staging
  -> database engine validation + controlled canonical promotion
  -> hash/validator-based refresh + selective replay/index update
~~~

This is a **logical** sequence, not one microservice per box. The source/website physical schema boundary remains open. Do not introduce a second independent job runner merely because a library includes a queue.

## Suggested adapter contracts (not final field names)

| Adapter/output | Required input/context | Output that downstream stages may trust |
|---|---|---|
| Policy/admission decision | Registered site or candidate URL, purpose, allowed hosts, assessment, limits | Allowed/deferred/denied reason, scope, version, policy decision ID |
| Fetch request/result | Job ID, exact URL+method+meaningful query, selected HTTP validators, max bytes/time, policy | Requested/final URL, redirects, HTTP status, headers, retrieval time, request fingerprint, capture ID **or explicit no-body/error reason** |
| Discovery/link observation | Parent page/capture, DOM path/region, link, text, nearest heading, page context | Resolved and original href, occurrence, internal/associated/related/external classification + reason/version, queue eligibility |
| File persistence | Validated bytes, type, capture/run IDs, intended visibility, checksum | Existing filesystem object/file/version reference + S3 integrity metadata |
| Content transform | Immutable capture/file reference + pinned parser and configuration | Linked Markdown/DOM/table/OCR artifact, byte/text hashes, language, node/PDF-page offsets and producer versions |
| Search index adapter | Stable page/block ID, approved text artifact hash, language, geo/site scope, access level, model version | Replaceable point/index ID + reproducible indexing metadata; never source of truth |
| Classifier/LLM proposal | Retrieved block locators, target schema subset, jurisdiction/time context | Scores, explicit candidates/abstentions, exact supporting spans/paths, model/prompt version |
| Data candidate and review | Input source capture, evidence, type/temporal constraints, validation | Staging proposal, review decision and an auditable promotion or rejection |

### Invariants

- **One original evidence source; many derivations.** Rerun parsers/embedders on stored captures rather than refetching whenever possible.
- **One host admission/budget policy** across independent pipelines; link classification as related-external does not authorize crawling.
- **Do not canonicalize away meaningful state.** URL fragments, query parameters, POST bodies or headers may affect page identity. A fiscal-year parameter must not be discarded as tracking noise.
- **304 means no new body.** Record the observation with validator context and reuse a prior matching capture only when valid.
- **Exact hashes deduplicate bytes, not facts.** Similar budget PDFs can represent different years.
- **Every output pin** includes input artifact references, producer name/version, config or model hash, created time, legal/access scope, status and errors.
- **No library writes canonical records.** All AI/external vendor outputs enter versioned candidate/validation paths. A high similarity score is not verification.
- **No silent drift repair.** Newly proposed selector/YAML strategy must pass retained regression examples, and activation needs an approved review policy.
- **No independent duplicate scheduler.** Current engine owns leases/retries/rate budgets even when Scrapy/Crawlee supplies crawling primitives; reconcile built-in scheduling features before integration.
- **Secure boundary.** SSRF checks, DNS/redirect allowlisting, robots/legal terms, content-type/size limits, sandboxed parsers, token/secret isolation and third-party disclosure rules are explicit.

## Example: one county budget source

The site homepage links to a budget PDF at two URLs and to the Treasury website. Mzizi records all **three link occurrences**, but fetching the Treasury site requires separate permission. Two different observations can resolve to the same exact PDF bytes; the files service stores one S3 blob and the source model retains both attributions. A PDF parser emits text/table artifacts with page-number evidence. Lexical retrieval first finds the relevant fiscal-year table. Optional ML/LLM proposes field values; the database engine validates year, institution, numeric constraints and evidence, then a reviewer/policy accepts or rejects. Updating the PDF parser creates **a new derivative from stored raw PDF**, not a new web capture.

## Tool-selection procedure

1. **Measure existing data engine** before adopting a crawler. Compare it with exactly one alternative (Scrapy first candidate, Crawlee alternative), on identical legally approved sites and limits.
2. Add **browser fallback** only for proven JS-dependent pages. Preserve HTTP vs rendered origin and environment.
3. Evaluate **Trafilatura vs current extraction**, then optional Crawl4AI, over the same stored HTML. Keep navigation/link memory independent of main-text output.
4. Establish **lexical/fuzzy government vocabulary and BM25**. Add dense/hybrid retrieval only if it improves judged results beyond site/link context; avoid vector-service deployment without measured lift.
5. Train **one task-specific classifier** after reviewed labels exist. Hold out entire websites and CMS families.
6. Let LLMs see **pruned content blocks** and pertinent schema fragments to propose reusable extraction logic; validate/abstain, never grant direct canonical write authority.
7. Reconcile refresh, index invalidation and review history through stable capture and derivative IDs, not vendor-specific records.

Implementation would need an approved DTO/version schema, test fixtures, failure taxonomy, retries, outbox or reconciliation strategy, and capability registry. Avoid coupling the engine to named Kenyan ministries/agencies; manifests and domain adapters should carry source-specific assumptions.

See [09 pipelines](09-pipelines-autonomy-and-decisions.md), [12 artifacts](12-artifact-lifecycle-and-lineage.md), [13 tests](13-benchmarks-and-research-questions.md), and [existing architecture](../../docs/ARCHITECTURE.md). **No runtime integration, vendor selection or new service authorized.**

## Additional candidate contracts: media and human refinement

The image/media adapter should emit a candidate asset descriptor containing the original/resolved URL, referring page/capture, stylesheet URL/hash when relevant, DOM/CSS locator, discovery method, MIME/size/hash after fetch, rights/policy decision, file-version reference and any person/profile block context. It should not itself decide that an image depicts a named person.

The association stage should emit a reviewable person-to-portrait proposal with source locators, profile/card context, temporal suitability and uncertainty. On approval, use the existing `filesystem.attachments` portrait relationship and existing S3-backed file service; do not create a duplicate media store.

A participation/review adapter may receive a proposed correction or identity pair, the relevant source evidence, contributor type/verified institutional scope, community feedback summary and agent recommendations. It returns an attributable decision or unresolved status. It must not grant the crawler, LLM or contributor direct write access to canonical person records. See [person identity, media and community refinement](../person-identity-media-and-community-refinement.md).

## Manifest-driven input contracts (2026-11-08)

The user requires source-neutral API/site acquisition via versioned api.structure.yaml and website manifests under root seed/, backed by DB source identities and approved release bindings. All system input-artifact schemas (seed/folder manifests, site/API structures, mappings, patterns and consumed JSON/YAML/CSV shapes) belong under source/schema/. Generic runtime packages stay under source/backend; publisher/country specifics belong in manifest/DB data. Dryv database/API authoring remains under dryv/ with explicit export ownership where contracts overlap. Follow [the detailed source requirements](https://github.com/alidantech-org/mzizi.africa/blob/develop/.docs/improvements/schema-redesign/phase-01/source.md#2026-11-08--manifest-driven-api-and-website-sources-user-direction) for conflict-safe DB/YAML editing, pinned releases, learning/review and legacy extractor retirement. This documents future source/pipeline work, not a claim that manifest-driven runtime support is complete.

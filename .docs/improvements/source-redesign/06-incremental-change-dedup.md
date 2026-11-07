---
id: DOC-9A8E56DB1C07
name: Layered change detection and incremental processing
type: documentation
tags: [improvements, source-redesign, hashing, changes, caching]
extra: {status: planning_only, implementation_approved: false, task_creation: user_directed_only}
---

# 06 — Change detection, deduplication, reprocessing and recovery

## Principle

Changes to a government website should be expected and normally recoverable using site memory, fuzzy matching, known templates and agent-assisted repair. **A changed layout is not necessarily new data, and an unchanged file is not necessarily a correct old extraction.** Avoid repeated downloading and reprocessing without missing meaningful facts.

## Independent identities and hashes

| Level | Why it exists | Suggested hash / version input |
|---|---|---|
| URL identity | Avoid redundant fetch scheduling | Versioned normalization policy + meaningful query params |
| Raw object | Reuse identical bytes, preserving source sightings | SHA-256 of raw response bytes |
| Rendered/normalized page | Ignore purely superficial markup differences *for comparison* | Content-preserving DOM normalization version + digest |
| Shared template | Identify repeated header/nav/footer/sidebars | Canonical DOM structural shape + version |
| Semantic section/subtree | Reprocess only changed paragraphs/tables/listings | Locator, normalized meaningful content and Merkle-like child hashes |
| Human-readable Markdown | Cache validated derivative | Input content hash + renderer/extractor/template version + output digest |
| Embedding | Avoid paying twice for same text/model | Text/block hash + embedding model/version/tokenization |
| Mapping/candidate | Detect changed extracted meaning | Target contract and mapping version + normalized payload/natural key |
| Derived domain output | Recompute affected information only | Input record versions + formula/tool version |

Each hash has its own purpose. Do **not** substitute `website.fingerprints`' structural features for semantic subtree change tracking or use embedding similarity as exact dedup.

## Refresh decision flow

1. Determine due date/priority from resource policy, prior updates, institutional importance and recent errors.
2. When supported, issue `If-None-Match` / `If-Modified-Since` conditional requests; a valid `304` can avoid body transfer. Headers are hints; unreliable validators require periodic full verification.
3. On fetched content, save the response evidence and compare raw digest. Identical content can reuse immutable stored bytes and compatible extraction.
4. On changed bytes, compare DOM/template and semantic blocks. Header-only changes may update navigation graph without remapping unchanged tenders; a budget table change needs value-level reevaluation.
5. Compare Markdown/extractor version: rerun even when raw content is identical if extraction rules or model contracts changed.
6. Invalidate only dependent embedding/index, mapping, candidate validation and derived outputs. Preserve older versions and human reviews.
7. Record successful/failed/skipped visits, reason, expiry/recheck schedule, cost, and provenance of accepted changes.

## Reuse and duplicate semantics

- Same URL repeated on hundreds of pages: one normalized resource, many dated link occurrences (possibly grouped safely).
- Two URLs with exact same PDF: one object, two source sightings, possibly one logical publication after evidence-based identity matching.
- Redirected pages: preserve old and new URLs, redirection chain, dates and source authority.
- Two semantically similar news articles: **do not** auto-merge evidence; compare source/issuer/date/claimed events.
- One webpage with repeated footer: reuse template, but preserve all observed outgoing links.
- Repeated scan: skip compatible work, not forever skip all previously seen URLs.

## Detecting meaningful changes

Use DOM subtree/section identity rather than comparing every line of HTML. Preserve headings, dates, monetary values, legislative references and ordered table rows even if styling differs. Volatile content suppression requires tests; an automatically updated tender deadline or current officer can be important even when contained inside a widget.

Track additions, deletions, reordering, movement to a new path, changes in pagination and loss of formerly present material. Use negative evidence cautiously: a temporarily unavailable page is not proof a government office ceased to exist.

## Drift and repair response

When a validated selector fails, rank alternate pages by navigation/link graph, institution context and semantic terms; classify changed template; test candidate selectors/mappings against saved examples and field expectations; write a repair proposal and diagnostics. Never silently replace canonical data on a guess.

For page/structure versioning, preserve both **time observed** and **period claims apply to**. The old extraction remains auditable, even if corrected later. Log why a model or operator overrode an earlier interpretation.

## Limits, operations and budgets

Bound refresh cadence, request concurrency, retry attempts, browser rendering, storage and indexing. Record why jobs abstained (gated, rate-limited, unmodified, blocked, parse gap, no quality threshold). Workers need leases and idempotency keys; per-host politeness should be shared across independent pipelines.

## Tests to specify before implementation

`304` with intact index; unreliable `ETag`; pages with timestamp-only changes; tender deadline mutation inside shared layout; path redirect after county CMS migration; HTML same but extractor upgraded; PDF identical at two hosts; query-param calendar trap; link deleted then restored; partial pipeline failure; page blocked after source assessment expiry.

**Open:** refresh budgets, content normalization policy, stable section identity, reprocessing contract, retention and cost targets, sync/repair thresholds. No implementation or new tables approved.

## Research-to-design: versions and live-site testing

[RFC 9110](https://www.rfc-editor.org/info/rfc9110/) supports ETag/Last-Modified conditional requests; [changedetection.io](https://github.com/dgtlmoon/changedetection.io) is a comparator; [LiveWeb-IE](https://proceedings.iclr.cc/paper_files/paper/2026/hash/3184497246703156104b3ceb1e379dc5-Abstract-Conference.html) highlights the static-vs-live evaluation gap. Track observation/status separately from raw capture; 304 can reuse matching prior bytes without a new body. Maintain raw, DOM/template/block, main-content and result hashes **plus parser/model/rule versions**: new tools can warrant reprocessing unchanged bytes. Semantic similarity never authorizes destructive merges. Test changed deadlines and fiscal years, not merely CSS drift; candidate repairs require regression and review. See [12 artifacts](12-artifact-lifecycle-and-lineage.md), [13 experiments](13-benchmarks-and-research-questions.md).

---
id: DOC-PATTERN-MATCHING-20261113
name: PATTERN_MATCHING
type: documentation
tags: [patterns, manifests, vector, proposal]
---

# Pattern matching: manifest rules, safe string matching and a semantic index

**Status: proposal, 13 November 2026.** Nothing here is implemented. The binding rules are in [typed-code.md](../../rules/typed-code.md); this guide explains the design they point to.

## Goal

No Python, Rust or TypeScript module hard-codes site, language, domain or classification knowledge, and no module compiles its own regex. Knowledge lives in versioned manifests. One safe string matcher and one semantic matcher apply those manifests for scraping, extraction, mapping and the engine.

## Three layers, tried in order

| Layer | What it does | Typical use |
|---|---|---|
| 1. Rule matcher (`patterns` package) | Applies typed, schema-validated rules from manifests: literal and alias sets, URL/path templates, linear-time regexes, normalisation pipelines (case, Unicode, transliteration), fuzzy lexical distance, and structural selectors. | Exact and near-exact work: headers, codes, URLs, challenge markers, personal-data field names, name aliases. |
| 2. Semantic matcher (`meaning` package) | Embeds text and looks up the nearest known meanings in a vector index built from our own reference data, aliases and past review decisions. Returns candidates with score, matched entry and rule provenance. | Fuzzy and multilingual: "Nairobi City County" versus "Nairobi County", column header classification, document-type classification, mapping free text to a code. |
| 3. Agent or human review | Resolves what layers 1 and 2 cannot decide. | Low-confidence or conflicting matches; the result feeds back as labelled data. |

Cheap, exact and explainable layers run first. A vector match never silently becomes canonical: it is a reviewable proposal carrying score, model version, index version and the manifest rule that asked for it.

## Manifest rules

Rules are data: a typed `RuleSet` with an id, version, target code set, rule kind, parameters, thresholds and optional examples and hard negatives. Schemas live under `source/schema/`, validated by `manifest`. Each package registers the rule kinds it understands (see the section-schema registry task); only the matcher packages interpret pattern text. Adding a site, country or language means adding a manifest, not code.

## The string matcher

- A linear-time regex engine (RE2 or the Rust `regex` crate) with length and time bounds, so manifest-supplied patterns cannot cause catastrophic backtracking. Manifest text is never evaluated as code.
- Fuzzy lexical measures (edit distance, token-set ratio) as named, parameterised rules.
- Typed results: matched span, rule id, rule version, confidence.
- If TypeScript, Rust and Python all need identical behavior, a Rust crate with Python bindings is the natural shared core. Start with a Python package; do not duplicate matching logic in three languages.

## The semantic index

- **Contents:** embeddings of canonical labels and aliases from reference data (counties, offices, parties, document types, field names), in each language we hold, plus accepted and rejected pairs from review.
- **Index:** behind a `VectorIndex` port with an in-memory adapter for tests and the CLI. Candidate stores: pgvector in the operations database, or a dedicated vector store. This is an open decision (see below).
- **Query flow:** embed the text, fetch the top-k, apply the per-rule threshold and margin, return candidates with provenance.
- **Provenance:** every match records the embedding model version and index version. Changing the model re-embeds and re-versions the index, so results stay reproducible.

### What "baked and fine-tuned" can honestly mean

- **Possible and recommended first:** a strong general multilingual embedding model, plus our curated data: aliases, hard negatives (similar names that are different entities, such as Kiambu and Kiambaa), and per-domain thresholds calibrated on reviewed decisions.
- **Possible later:** contrastive fine-tuning of a small embedding model on accepted and rejected pairs from the review workflow, once enough labelled pairs exist. The model and index are versioned artifacts.
- **Not suitable for vectors:** exact identifiers, numbers, dates, amounts and legal wording. Near neighbours in embedding space can be different entities, so those stay with exact and rule-based layers.

## Where it runs

The engine owns both matchers and their ports, runs embedding in the CPU/worker pool, and offers matching as job steps. The agent can propose new rules, aliases and thresholds as manifest patches, validated by `manifest` schemas before use.

## Open decisions

- Vector store: pgvector (operations database) versus a dedicated vector database.
- Embedding model: hosted API versus local model, and licensing/size constraints for offline CLI use.
- Whether the shared string-matcher core is Python-only at first or a Rust crate from the start.
- Rule schema details and how the `meaning` index is built from seed data.

# mzizi-translation

Tiered, engine-neutral translation of stored text. One orchestrator, `TranslationOrchestrator(store, engines)`; no database, language or model is named in this package.

- **Ports.** `TextStore` reads pending text and writes drafts (the engine implements it over PostgreSQL); `TranslationEngine` is anything that translates, or returns `None` for text it cannot.
- **Tiers, in order of trust.** `curated` (lookup tables from curated sources), `glossary` (whole-text matches from a glossary built from translations that already exist), `machine`. A text takes the first tier that can translate it.
- **Engines.** `LookupEngine` (curated or glossary tables), `CTranslate2Engine` (a local model directory and SentencePiece file the caller supplies; loads lazily, nothing is downloaded), `HttpEngine` (LibreTranslate-compatible servers and Google Cloud Translation v2; the caller supplies URL, key and language codes). Any other engine is an object with `name`, `version`, `tier`, `supports` and `translate`.
- **Names.** `MarkerEngine` translates the marker words of place and body names (a kind of place, a direction, an office title) from a data file of phrases, heads and markers for one language pair, and keeps the proper noun. It returns nothing for a name that is only a proper noun. Rules are proposals for a reviewer.
- **Protection.** Numbers, designations (`(1)`, `(a)`), placeholders and glossary terms are masked before machine translation and restored after; text whose tokens were lost is retried unmasked and flagged.
- **Quality flags.** Empty, untranslated, length, truncated, numbers changed, placeholder lost, glossary term missed, masks lost, and an optional back-translation mismatch. Flags triage review; they are not a verdict.
- **Glossary.** `build_glossary(pairs, max_words=…)` takes short aligned pairs as terms. Entries carry a context (a dotted code) and apply to that context and below; a term that differs by context gets no context-free entry and is listed as a conflict; a draft from a wider context is flagged `context-fallback`.
- **Provenance.** An optional `ProvenanceSink` is called after drafts are saved; the engine supplies a JSON-lines ledger now and `source.evidence` later.

Language codes are strings chosen by the caller (the engine passes identity codes such as `ref.lng.xx`, and each engine maps them to its own codes). Machine output is a proposal (see the gaps in the design): the engine stores it as `proposed` or `draft` where the table has a review status.

Tests: `uv run pytest source/packages/translation`. The engine's operations (`translation.plan`, `translation.glossary`, `translation.run`) and the PostgreSQL store are in [the engine](../../backend/engine/README.md); design, data flow, gaps and improvements in [TRANSLATION_PIPELINE](../../../.docs/design/data/TRANSLATION_PIPELINE.md).

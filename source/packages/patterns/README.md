# mzizi-patterns

Tokenisation, term matching, evidence ranking and near-duplicate detection, driven entirely by data. It knows no publisher, language or database. Every term, alias, stop-word, weight and threshold comes from term lists (`source/schema/engine/terms.schema.json`) and a profile.

One public class, `PatternOrchestrator(profile, term_lists)`:

- `score_corpus(documents)` returns, for each `DocumentText` (file name, title, headings, body), a document **kind** (what it is), its **subjects** (what it is about), an **impact** level and the matched terms behind each tag. Each match adds `field_weight x idf x c / (c + k)`; confidence is `1 - exp(-score / scale)`. These are ranking scores, not calibrated probabilities.
- `near_duplicates(documents, threshold)` finds near-identical documents with 3-word shingles, MinHash signatures and Jaccard similarity. Documents with no text are skipped.

Layout: `orchestrator/` the class, `shared/` typed contracts, `features/tokenise`, `features/terms`, `features/score`, `features/dedupe`.

Calibrate `scale` and `threshold` on reviewed decisions before trusting a level. A proposal for the ORPP terms and profile is in `seed/drafts/orpp-sources/`. Reproduce the first ranking with `uv run python source/packages/patterns/benchmarks/score_orpp.py`. Run the tests with `uv run pytest source/packages/patterns`. Design background: `.docs/design/architecture/PATTERN_MATCHING.md`.

# mzizi-patterns

Tokenisation, term matching, evidence ranking and near-duplicate detection, driven entirely by data. It knows no publisher, language or database. Every term, alias, stop-word, weight and threshold comes from term lists (`source/schema/engine/terms.schema.json`) and a profile.

One public class, `PatternOrchestrator(profile, term_lists)`:

- `score_corpus(documents)` returns, for each `DocumentText` (file name, title, headings, body), a document **kind** (what it is), its **subjects** (what it is about), an **impact** level and the matched terms behind each tag. Each match adds `field_weight x idf x c / (c + k)`; confidence is `1 - exp(-score / scale)`. These are ranking scores, not calibrated probabilities.
- `near_duplicates(documents, threshold)` finds near-identical documents with 3-word shingles, MinHash signatures and Jaccard similarity. Documents with no text are skipped.

Layout: `orchestrator/` the class, `shared/` typed contracts, `features/tokenise`, `features/terms`, `features/score`, `features/dedupe`.

Calibrate `scale` and `threshold` on reviewed decisions before trusting a level. A proposal for the ORPP terms and profile is in `seed/drafts/orpp-sources/`. Reproduce the first ranking with `uv run python source/packages/patterns/benchmarks/score_orpp.py`. Run the tests with `uv run pytest source/packages/patterns`. Design background: `.docs/design/architecture/PATTERN_MATCHING.md`.

## Reading cells and columns

- `CellEngine` and `Vocabulary` run the **patterns**, **heading rules** and **splits** of term lists. A pattern is an ordered list of parts (a word group, a literal, digits, letters, punctuation, a number, alternatives) matched over word, number and punctuation tokens, not a regular expression, so a pattern in data cannot cause catastrophic backtracking. Every pattern carries examples and counterexamples that run as tests (`CellEngine.check_examples`).
- `propose_columns(probes, term_lists, dictionaries, scopes)` matches the columns of a source table to database columns through the column dictionaries (`sys.col.<scope>.<domain>`). It reads headings such as `Amount (ksh)` as a base and a unit, tells row counters from data, classifies cells (person, organisation, address), notices a column that holds two things in brackets, and ranks candidates. `mzizi-engine propose-mapping <csv>` prints the proposal as JSON.
- Scopes layer by domain: the Kenya `money` list adds to the global `money` list, and a heading rule or pattern of a narrower scope replaces a wider one of the same key.

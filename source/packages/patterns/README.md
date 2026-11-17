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

## Codes, names and vectors

- **Code recipes.** A column dictionary's `tables.<table>.code` says how a code is proposed from source values (country scope, a slug of the name with kind words such as `county` or `limited` removed, the last segment of a linked code, a raw value). `build_code` follows it and names the missing value when it cannot. A code is a proposal: `disambiguate` keeps it unique within a run, and a person approves new codes.
- **Name index.** `NameIndex` finds known records by text in tiers: exact, key (kind words removed), trigram similarity (`pg_trgm`'s rule) and edit distance. A kind word read from the text (`Kiambu County`) selects the record of that kind and penalises one of another kind; a bare name that fits two records is ambiguous. `Vocabulary.kind_filler()` supplies the kind words from groups marked `kind_words`, and `Vocabulary.add_value_aliases()` gives each term that `represents` a reference value the labels that value carries.
- **Embedding.** `HashingEmbedder` is a dependency-free character-trigram embedder behind the `Embedder` protocol. It is not a language model: a real multilingual model replaces it behind the same protocol.

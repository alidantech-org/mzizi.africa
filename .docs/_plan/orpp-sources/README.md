---
{id: PLAN-ORPP-SOURCES,name: ORPP source terms and ranking profile,type: plan,tags: [seed,terms,orpp,proposal]}
---

# ORPP source, terms and ranking profile

Status: the three term lists (`global`, `ke`, `orpp`) were approved by the owner and now live in `seed/terms/src/doc/`. The source manifest (`sources/srs/ke/orpp/manifest.yml`, with a placeholder policy assessment and licence) and the ranking profile (`engine/docs/profile.yaml`) are still proposals in this folder, awaiting approval; moving them to `seed/` means the same relative paths.

## What is drafted

| File | Code | Purpose |
|---|---|---|
| `sources/srs/ke/orpp/manifest.yml` | `pg.src.srs.ke.orpp` | The source: host scope, rate, robots, stop rules, and which term lists it uses. The policy assessment reference and the licence are **placeholders to confirm**. |
| `seed/terms/src/doc/` (3 layered lists) | `sys.trm.src.doc.ke.<name>` | English and Swahili term lists: `law`, `register`, `funding`, `notice`, `procurement`, `audit-budget`, `court`, `report`, `people-places`, `form`, `news`, `noise`, plus `stopwords`. |
| `engine/docs/profile.yaml` | `sys.eng.docs.profile` | How term matches become a document **kind**, **subjects** and an impact level. |

No mapping is drafted yet. Mappings come after the first corpus is scored and reviewed (see "Next").

## How a document is judged: kind, subject, impact

Two questions are asked of every document, because they are different:

- **Kind**: what is it? `law`, `register`, `notice`, `court`, `procurement`, `report`, `form`, `news`, `noise`. The kind sets the impact level. A form or a news item stays low however many finance words it contains. Procurement documents (tenders, bidders, awards) and finance documents (funds, allocations, budgets, audits) are **high** because the project tracks them.
- **Subject**: what is it about? `funding`, `audit-budget`, `people-places`. Subjects do not set the level. They route the document to the right mapping and are kept for search.

The code that does this is the new `mzizi-patterns` package (`source/packages/patterns`). It holds no word lists: every term, alias, stop-word and weight is read from the files in this folder.

### Tokenising and ranking

1. **Tokenise.** Text is Unicode-normalised, lowercased and split into runs of letters or digits (`ppf3` becomes `ppf`, `3`). Stop-words come from the `stopwords` list. Phrases of one to four tokens are formed so `gazette notice` matches as a phrase.
2. **Match.** A term and each of its aliases are phrases that point to one canonical term. Matching is exact on tokens. In file names, a term is also found inside a joined word (`politicalpartiesact11of2011` contains `political parties act`).
3. **Weight.** Each match adds `field_weight x idf(term) x c / (c + k)`. The field weight puts a file name above a title above headings above body text. `idf` is computed over the whole corpus, so a word that appears in nearly every ORPP document (such as "political") adds almost nothing, while a rare word in a title adds a lot. `c / (c + k)` saturates repeats, so repeating a word ten times is not ten times the evidence. Body matches are discounted for long texts, which mention many things in passing.
4. **Confidence.** `1 - exp(-score / scale)` maps a tag's total to 0 to 1. These are ranking scores, not calibrated probabilities. `scale` and `threshold` should be calibrated on reviewed decisions.
5. **Explain.** Every tag keeps the terms, fields and counts behind it, so a reviewer sees why it was chosen.

This is the cheap, exact, explainable layer of `.docs/design/architecture/PATTERN_MATCHING.md`. A semantic (embedding) layer can later sit behind it for fuzzy and multilingual cases; it is not built.

### First result on the 277 ORPP PDFs

Scoring the filenames, first-line titles and extracted text (without OCR) gave: 123 high, 13 medium, 122 low and 19 noise. The political parties acts are `law`, the register editions are `register`, the Gazette issues and quarterly notices are `notice`, the tender documents and bidder lists are `procurement`, the funding schedules carry the `funding` subject, forms and FAQs are `form`, and the KBC interview is `news`. Scanned PDFs have no text without OCR, so some (for example the code of conduct) get no tag until they are extracted with OCR. Run `uv run python source/packages/patterns/benchmarks/score_orpp.py` to reproduce.

## Duplicates and near-duplicates

ORPP republishes the same content under several names (the Political Parties Act appears five times, the registers are reissued monthly, notices repeat by quarter, many have Swahili twins). The package finds near-duplicate documents by comparing 3-word shingles with Jaccard similarity, using a MinHash signature to skip clearly different pairs. On the corpus it found the Act editions, code-of-conduct copies, the agents' guide pair and the register editions. Documents without text are skipped, not matched. Duplicates are **linked, not discarded**: the group keeps one preferred document and records the others as additional sources of the same content.

## Identifying the same thing across lists (planned)

When a register row or a notice names a party, person or place, identification should try these in order and keep the evidence of each:

1. **Exact identifier**: certificate number, abbreviation, or an existing code (`official.identifiers` holds namespaced identifiers such as a certificate serial).
2. **Normalised name key**: case, punctuation, leading "The", "Party", "Kenya" and `&`/`and` folded; Swahili and English aliases from the term and alias data.
3. **Token-set similarity** on names, with hard negatives for look-alikes (Kiambu and Kiambaa), accepted only above a margin.
4. **Attribute agreement**: abbreviation, registration date, symbol and head office agreeing raises confidence; disagreeing blocks an automatic merge.
5. **Review**: anything below the threshold, or in conflict, becomes a reviewable proposal. Model or fuzzy matches are never silently canonical.

## New data improves existing data, even when it adds nothing

A new CSV that describes rows we already have is never discarded. For each matched row the comparison has three outcomes, all recorded:

- **Adds**: a new field or value fills a gap. The value is proposed with its source.
- **Agrees**: nothing new, but the source confirms the existing value. The row gains a **corroboration**: another source, with its date, that independently states the same thing.
- **Disagrees**: the difference is kept as a dispute with both sources, not overwritten.

The database already has the places for this: `source.provenance` (which table, column, record, document and line a value came from), `source.citations` (a locator and a hash of the quoted text), `source.evidence` and `source.verifications` (an outcome, a confidence and the method that produced it). A republished register that agrees with the stored one therefore becomes a verification with `outcome` confirmed and a new citation, which raises trust in the row and is itself a new source. A new party in a notice becomes a new proposed row.

## Why the ORPP data does not map straight onto the database

Most ORPP documents describe entities and events (a party registered, renamed, merged, funded) in the publisher's own words and layout. The database holds linked, coded rows (`politics.parties`, `official.entities`, `official.names`, `finance.flows`, `civic.procurements`, `governance.holders`). Between them sit extraction, classification, identification, coding and review. That is why this draft stops at sources, terms and a ranking profile. Mappings are written once the high-value documents are chosen and a reviewer has checked a sample.

## Next, in order

1. You review these files (add, change or reject any).
2. Approved files move into `seed/`, and `uv run mzizi-manifest refs seed` and `data seed` are run.
3. The high and medium documents are extracted with OCR and tables, and scored again with headings and table columns as evidence.
4. A reviewer labels a sample; `scale`, `threshold` and weights are calibrated on it.
5. Mappings are drafted one table at a time, starting with `politics.parties` from the register and `civic.procurements` and `finance.flows` from the tenders, bidder lists and fund schedules.

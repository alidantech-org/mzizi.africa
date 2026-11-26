---
id: DOC-DESIGN-DATA-TRANSLATION-PIPELINE
name: Translation pipeline
type: documentation
---

# Translation pipeline

Status: implemented in part. Package [`mzizi-translation`](../../../source/packages/translation/README.md) holds the logic and knows no database, language or model. The engine connects it to PostgreSQL and exposes three operations. No machine model is installed or chosen; an engine is selected per request. Nothing machine-made has been written to the database. The gaps are listed at the end.

## What is translatable, and what is not

| Text | Table | A translation is | Policy |
|---|---|---|---|
| Country, language, currency, time-zone city names | `identity.names` | a sibling row with the target `language_id` | tier 1: CLDR, loaded for Swahili, Somali and French |
| People's names | `identity.names` | nothing | never translated |
| Place and body names | `identity.names` (`feature`, `entity`, `office`, `position`) | a sibling row | marker words only (a kind of place, a direction, an office title); the proper noun is kept |
| Indicator and unit names | `identity.names` | a sibling row | glossary, then machine |
| Vocabulary labels | `vocabulary.labels` | a sibling label with the same owner and `kind` | curated, glossary, machine |
| Official texts | `legal.wordings` | a `legal.translations` row (`machine`, `proposed`) | glossary, machine; the Constitution already has a human Swahili text |
| App and site strings | `product.keys`, `product.messages` | a message (`machine`, `draft`) | glossary, machine; placeholders protected |
| Notes, source labels, evidence | `source.*`, `legal.effects.note` | nothing | not translated |

## Tiers and engines

A text takes the first tier that can translate it; a higher tier is never overwritten by a lower one.

1. **Curated** (`LookupEngine`): exact, case-insensitive whole-text tables from curated data. CLDR gives `en-<locale>.cldr.json` for any locale.
2. **Glossary**: whole-text matches against terms learned from translations that already exist (`translation.glossary`), plus the `MarkerEngine` for names.
3. **Machine**: any `TranslationEngine`: `CTranslate2Engine` (a local model directory and SentencePiece file the caller supplies, loaded lazily), `HttpEngine` (LibreTranslate-compatible servers and Google Cloud Translation v2; the key is read from a named environment variable, never from a request), or any object with `name`, `version`, `tier`, `supports`, `translate`. Engines can be mixed in one request and are tried in order.

### Glossary and context

An entry is `(source text, target text, count, context)`. The context is a dotted code (a vocabulary term or scheme, an identity kind, a message key) and an entry applies to texts in that context or below it; the most specific entry wins. A term that has the same translation in every context also gets a context-free entry. A term that does not (`Absent`, `Abstained`, `None`) gets none, is listed under `conflicts` (28 today) and is applied only where a context settled it. Several translations in one context: the most frequent wins and the rest are listed. A draft that used an entry from a wider context than its own is flagged `context-fallback`. Limitation: terms are whole short texts (up to a caller-chosen word count), so the glossary does not align words inside sentences.

### Names

`MarkerEngine` reads a data file per language pair (`MarkerRules`: `phrases` for whole segments between commas, `heads` for a leading phrase before a name, `markers` with their position, placement and linker word). `Kiambu County` becomes `Kaunti ya Kiambu`, `Seme East` becomes `Seme mashariki`, `Member of County Assembly, Burumba` becomes `Mjumbe wa Bunge la Kaunti, Burumba`. A name that is only a proper noun returns nothing and stays as it is. The Swahili file `.dev/seed/translation/en-sw.markers.json` was written for review and is not authoritative.

### Protection and quality

Numbers, words with digits, designations such as `(1)` and `(a)`, placeholders (`{x}`, `%s`) and glossary terms are masked before machine translation and restored after; a text whose tokens were lost is retried unmasked and flagged `masks-lost`. Flags: `empty`, `untranslated`, `length`, `truncated`, `numbers-changed`, `placeholder-lost`, `glossary-missed`, `masks-lost`, `context-fallback` and, when `back_check_threshold` is set, `back-mismatch` (word-overlap between the source and the back-translation). Flags triage review; they are not a verdict. Flagged drafts are still returned and saved.

## How the engine reads and writes

```text
operation (translation.run)
  -> opens one PostgreSQL connection (DATABASE_WRITE_URL)
  -> PostgresTextStore.pending(stream, source, target, limit)   rows with no translation yet
  -> TranslationOrchestrator.run: curated -> glossary -> machine, quality flags
  -> PostgresTextStore.save(drafts)                              only when apply is true
  -> LedgerProvenance.record(drafts)                             only when apply is true and a ledger path is given
  -> the connection closes and commits
```

`PostgresTextStore` (`persistence/postgres/translation.py`) holds one SQL binding per stream. Languages are identity codes (`ref.lng.xx`) resolved to ids, and an unknown stream or language is refused.

| Stream | Pending means | Saved as |
|---|---|---|
| `vocabulary.labels` | a source-language label with no label of the same owner and `kind` in the target language | `vocabulary.labels` copy with the new text |
| `identity.names/<kind>` | a default name of that identity kind with no target-language name of the same name kind | `identity.names`, `is_default` false |
| `legal.wordings` | a wording with no `legal.translations` row in the target language | `legal.translations`, `method` machine, `review` proposed, the tier, engine and flags in `notes` |
| `product.messages` | a message with no message for the same key (and country) in the target language | `product.messages`, `origin` machine, `status` draft, the engine in `translator` |

Rows get deterministic ids (uuid5 of stream, key and target language) and every insert is `ON CONFLICT DO NOTHING`, so a rerun adds nothing and a stopped run can be restarted. The store never commits; the operation owns the transaction. Nothing is written unless `apply` is true, and `legal.translations` and `product.messages` are the only streams that should be applied before provenance exists (labels and names carry no status).

### Operations

| Operation | Does |
|---|---|
| `translation.plan` | lists the texts waiting in a stream |
| `translation.glossary` | builds a glossary from existing aligned pairs of a stream |
| `translation.run` | translates a stream's waiting text; a dry run unless `apply` is true; returns counts per tier, the flagged and untranslated counts and a sample |

Lookup and marker files, and the ledger, must sit under `ENGINE_INPUT_ROOT`. Run one from Python with `build_default_registry().get("translation.run").handler({...})` or through the engine's job endpoint. Example request: `{"stream": "vocabulary.labels", "source_language": "ref.lng.en", "target_language": "ref.lng.sw", "limit": 1194, "glossary_from": ["product.messages"], "engines": [{"kind": "lookup", "name": "cldr-sw", "version": "cldr-json", "tier": "curated", "path": "translation/en-sw.cldr.json"}]}`.

## Seeding curated names

`.dev/seed/rebuild/translate_cldr.py <locale>…` reads CLDR JSON from `.dev/scratch/translation/cldr-<locale>/`, writes `identity.names.cldr-<locale>.csv` (loaded by `batches.py`) and `.dev/seed/translation/en-<locale>.cldr.json`. Loaded: Swahili 456 names, Somali 642, French 625 (countries, languages, currencies, time-zone cities that differ from English). A second language needs no package change, which is how the package was checked for neutrality.

## Provenance

Labels, names and similar rows carry no provenance columns, and provenance belongs in `source`. Until the source catalogue is seeded, `LedgerProvenance` appends one JSON line per saved draft (stream, key, tier, engine, version, flags, languages, time). The target logic, through the `ProvenanceSink` port so the package does not change:

1. Seed a `source.sources` entry per engine and version (and one for CLDR) with a `source.citations` row each, since `source.evidence` needs a citation.
2. Write a `source.evidence` row in the same transaction as each translated row: subject table and id, the citation, method (`modelled` machine, `matched` glossary, `extracted` curated), confidence from the flags, field `text`, role `origin`.
3. A reviewer's decision is a `source.verifications` row on the same subject; a translation without one is unreviewed machine output.
4. Apps join evidence and verifications to label or hide unreviewed rows, and saves without evidence are refused.

## Tests

Package: `uv run pytest source/packages/translation` (tiers, masking, glossary and context, markers, flags, provenance; fake store and engines, no model, no network). Store: `source/backend/engine/tests/persistence/test_translation_store.py` runs against `mzizix` through `DATABASE_WRITE_URL`, writes drafts for each stream and rolls back; it never creates another database.

## Gaps and what was left out

- **No machine model.** None is chosen, installed or tested: `CTranslate2Engine` and `HttpEngine` are written but unrun, and neither has a live test. Quality and speed are unmeasured (this machine has no GPU, so a local model on the Acts will take hours). Model choice is open: NLLB-200 is strongest but CC-BY-NC, MADLAD-400 is Apache 2.0, a hosted service sends text to a third party.
- **No provenance in `source`.** Blocked on seeding the source catalogue. Until then labels and names are not applied; only the ledger records origin.
- **Nothing applied.** No machine or glossary translation has been saved. Only CLDR names (curated) are loaded.
- **Headings.** `legal.wordings.heading` has no translation column; only `text` is translated.
- **Citations in translated text.** Citations are not re-found in the Swahili text, so translated Acts have no `legal.references` of their own.
- **Placeholders in messages.** `product.keys.placeholders` is passed as protected tokens as stored; its format has not been checked against real data.
- **Glossary.** Whole short texts only; no word alignment inside sentences; contexts of labels (`voc.…`) and messages (`app.…`) share no prefix, so message terms apply to labels only when unambiguous. Conflicts need a person.
- **Marker rules.** Swahili marker and phrase rules were written without a reviewer, with fixed linker words per marker; agreement beyond that (noun classes, plurals) is not modelled. Only English to Swahili exists.
- **Back-check.** Word-overlap between source and back-translation is crude and needs a second engine direction; it is off by default.
- **Review workflow.** Nothing lists drafts for a reviewer or accepts them; `legal.translations.review` and `product.messages.status` are written as `proposed` and `draft` and stay so.
- **Wikidata labels.** A curated source for place and entity names was planned (needs entity ids first) and is not built.
- **Other languages.** Only names have been run for Somali and French; no glossary or markers exist for them.
- **Throughput.** One connection and one thread; no queueing, resumable checkpoints or concurrency.
- **Ledger path.** It is written under the engine input root, which is a read location; a dedicated output root would be cleaner.

## Improvements

Seed the source catalogue and implement the evidence sink; add a reviewer queue and accept or reject operations; run a small model (NLLB-200 600M or MADLAD-400) on 200 sampled wordings and measure quality and time before choosing; align words to grow the glossary from the Constitution's Swahili text; translate headings by a `heading` stream into a new column or table; re-find citations in translated text with the citation finder in a Swahili profile; add `resume` checkpoints for long runs; add language packs (markers, phrases) as manifests under `source/schema/`; show translation status in the web app.

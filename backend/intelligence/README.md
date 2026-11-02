# Mzizi Intelligence Layer

**Status:** architecture scaffold; implementation follows evidence/extraction contract definition.

## Purpose

The intelligence layer exposes explicit AI/tool-assisted operations that help transform extracted evidence into high-quality candidate knowledge.

## Initial tool families

- document/segment classification;
- entity extraction;
- entity-resolution suggestions;
- OCR-cleaning suggestions;
- relationship suggestions;
- contradiction detection;
- source comparison;
- extraction-quality evaluation;
- candidate-record evaluation;
- evidence summarization;
- research-gap identification.

## Core rule

```text
AI result != canonical truth
```

Every intelligent operation must be attributable and versionable.

Minimum lineage includes:

- operation name;
- input references;
- model/tool/provider identity;
- model/tool version where available;
- prompt/policy/config version where applicable;
- structured output;
- confidence/evaluation metadata;
- warnings/errors;
- timestamps;
- source/extraction lineage.

## Does not own

- raw file custody;
- deterministic document extraction;
- canonical promotion;
- database migrations/seeds;
- public product endpoints.

Intelligence results enter candidate/review workflows and are persisted so they can be inspected, compared and superseded.

See `../../.docs/ARCHITECTURE.md` and `../../.docs/DATA_LIFECYCLE.md`.

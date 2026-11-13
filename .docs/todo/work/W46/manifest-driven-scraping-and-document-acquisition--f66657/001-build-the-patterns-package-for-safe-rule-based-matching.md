---
{id: TSK-D2BC6AE00DFF,name: Build the patterns package for safe rule-based matching,type: task,status: planned,priority: medium,created_at: 2026-11-13T10:12:17.138Z,updated_at: 2026-11-13T10:12:17.138Z,order: 1024}
---

# Build the patterns package for safe rule-based matching

## Goal

Create the `patterns` package that is the only place in the repository where regular expressions, glob and URL patterns, string normalisation and fuzzy lexical matching are implemented. Callers supply typed rules from manifests and receive typed results; they never compile a regex themselves.

## Context

See `.docs/design/architecture/PATTERN_MATCHING.md` and `.docs/rules/typed-code.md`. Matching must be safe on untrusted input: a linear-time regex engine (RE2 or equivalent), length and time bounds, and no evaluation of manifest text as code. Existing scattered patterns to absorb: the placeholder-contact and user-agent checks in `fetch`, personal-data field and value patterns in the engine policy module, challenge markers in `scraping`, selector and JSONPath string handling, and the section path regexes with named slots from `SITE_STRUCTURE_SPEC.md`. Rule sets are versioned manifest data validated against schemas.

## Acceptance checklist

- [ ] Typed `Rule` and `RuleSet` contracts exist for alias sets, URL and path templates with named slots, regexes, normalisation pipelines and fuzzy distance, each with id, version and thresholds.
- [ ] A `Matcher` applies a rule set with enforced length and time bounds and returns typed matches (span, rule id, rule version, confidence); catastrophic-backtracking inputs are tested.
- [ ] Existing hard-coded patterns in `fetch`, `scraping` and the engine policy module are replaced by calls into this package, with their data moved to manifests or seed inputs.
- [ ] The package passes `mypy --strict`, has no untyped dicts outside its parse module, and has tests for each rule kind.

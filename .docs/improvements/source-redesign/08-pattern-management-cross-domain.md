---
id: DOC-9A8E56DB1C09
name: Central shared pattern schema alternative across domains
type: documentation
tags: [improvements, source-redesign, patterns, schemas, lineage]
extra: {status: planning_only, implementation_approved: false, task_creation: user_directed_only}
---

# 08 — Shared pattern management as a candidate schema

## Latest user clarification

Re-evaluate Mzizi's **entire** pattern-management design. It may be wrong to give each eligible domain/schema its own self-contained pattern subsystem. Consider a dedicated `pattern` schema for common pattern identity, authoring, versioning, evaluation, generation and synchronization, with generated data stored as **normal records** in the target domain.

**Important:** This is a newly emphasized **candidate architecture**, not approval to create `pattern` or migrate existing rules. Compare the option with a shared `engine` pattern registry and domain-owned patterns before deciding.

## Four acquisition classes (cross-cutting)

- **1A curated seed:** known researched input inserted as static/curated records with attribution and correction.
- **1B pattern-generated seed:** repeatable expected structures from validated rules and inputs; never implies observed real-world existence of an officer, site or business.
- **2A external collection:** web/API/document evidence processed into candidates for review/verification.
- **2B internal derivation:** formulas/computations from versioned, already-known data with dependency lineage.

Table eligibility and actual record origin differ. Pattern lineage must identify **which specific records** were generated, their input/version/scope and later human edits, not only tag a schema as pattern capable.

## Example pattern families and important differences

| Example | Input | Expected outcome | Caution |
|---|---|---|---|
| County governorship | Valid geo units + legal/administrative rule + time | Expected offices in `governance` | Does not produce actual officeholder |
| County assembly seats | Legal/electoral structure + applicable geo hierarchy | Expected seats in `electoral` | Seats vary with law/time; elections verify holders |
| Geo hierarchy | Verified admin levels/relations and applicable rules | Expected structures in `geography` | Historical scopes and county codes are not universal |
| Finance reporting schedule | Institution, period, applicable legal reporting rule | Expected obligation or reporting window | Not proof report was published |
| Statistical coverage | Indicator, geo levels, vintage, methodology | Expected series/observations | Not observed statistical values |
| County site hostname | Geo unit + proposed domain template | Candidate URL/site in source/website | Pattern is hypothesis; DNS/fetch confirms reality |
| Site extraction profile | Family/site layout rule + observed examples | Versioned extraction instructions | Technical recipe, not collection authority |
| Derived population statistic | Input observations + formula/version | Computed value with traceable inputs | Distinguish extrapolation from direct data |

These share **management and lineage**, not identical execution semantics. Do not force all kinds into one opaque executable SQL/JSON string or a single unconstrained target UUID.

## Alternatives to test

| Approach | Benefits | Risks / follow-up |
|---|---|---|
| A. Domain-owned pattern managers | Tight domain semantics | Repeated versioning, runs, UI, correction policy across schemas |
| B. Shared registry and run management in `engine` | Fewer top-level schemas, close to job execution | Mixes long-lived rule authority with operational job state |
| C. Dedicated `pattern` schema + `engine` runtime | Clear cross-domain registry, rule approvals and lineage; engine retains execution orchestration | Additional schema/foreign keys and governance; worth only if real use cases support it |
| D. Hybrid shared pattern definitions and selectively domain-specific rules | Shared lifecycle and specialized semantics | Must prevent redundant definition/version ownership |

Assistant's **provisional** preference: C or D if complexity measurements justify them; domain-specific logic stays in its domain code and validators, and `engine` owns workers, retries and resource budgets. User has not approved any option or schema count.

## Candidate logical capabilities — **not approved tables**

1. **Definition identity**: purpose, output domain, rule kind, scope, input contract, authority/evidence, owner, allowed generation behavior.
2. **Immutable version**: semantic/effective dates, validated parameters, code/file/JSON/SQL reference, hash and supersession; big YAML/CSV/Markdown bodies in `filesystem`.
3. **Preview/apply generation**: dry-run, human approval where required, input hashes, idempotency key, comparison against existing records and expected coverage.
4. **Outputs and lineage**: actual target records created/adopted/unchanged/conflicting/retired, relationship to pattern version, output hashes, independent verification, corrections and exceptions.
5. **Synchronization and dependency invalidation**: new geo unit, amended law, fixed rule, changed reporting period -> regenerate **affected** records only; preserve historical truth and reviewed overrides.
6. **Admin interface**: list, inspect, edit, compare, preview, approve, generate/sync, see failed/conflicting outputs and rerun safely.

Exact choices `pattern.definitions`/`versions`/`runs`/`outputs` are *conceptual words*; do not generate DDL or adopt names from this list. Compare against existing `engine.jobs`, `staging.runs/candidates`, `engine.gaps/claims` and source lineage.

## Pattern outputs are normal data

A rule generating expected governor offices writes candidates/approved normal `governance` records, not a duplicate canonical `pattern.offices` table. A rule generating website host candidates should not mark the host reachable. Attach generation version/run and input evidence while avoiding one `pattern_id` column on every domain table if a better FK-backed lineage mechanism exists.

Generic `target_kind + target_id` pairs are **not real FKs**. Evaluate (i) typed output-association tables, (ii) a constrained record identity registry plus explicit links, and (iii) domain-specific FK associations. Test insert/delete/rollback and cross-schema constraints, not just conceptual diagrams.

## Scope and legal applicability

A nationwide ministry or election commission can be legally scoped to Kenya's root geo unit while physically located in Nairobi; a county office scopes to its county. A pattern may refer to a dated legal provision/rule, but every generated row need not redundantly copy the same law ID if lineage to the rule can explain it. Where law or jurisdiction differs across African states, reuse management mechanics without imposing Kenyan legal assumptions.

Expected cardinality must be versioned and validated. Some structures have zero, one or multiple valid instances per scope, including exceptions and historically differing legal rules. Do not blindly generate 47 records merely because there are 47 contemporary counties.

## Preview, reconcile and conflict safety

Propose a diff: new, adopted, unchanged, missing, superseded expectation, conflicting with verified data, awaiting evidence. The human can understand **why each output exists**. Corrections to pattern assumptions must not overwrite verified real-world holders, budgets, published documents or historical periods; trigger quality issues and reviewed correction.

## Open approval questions

1. Should a `pattern` schema exist physically, or does a shared `engine` registry sufficiently simplify Mzizi?
2. Which current `domain_patterns`, office patterns, seed scripts, derived formulas and website profiles qualify?
3. What rule languages are allowed (safe SQL functions, Python, versioned declarative YAML/JSON), with resource/permission sandboxing?
4. Which management records genuinely need standalone tables rather than filesystem manifests or current jobs?
5. How to enforce generated-row references with real FKs across arbitrary target domains?
6. What human/agent approvals and different risk levels govern version creation and apply?
7. How should domain changes, legal changes and pattern fixes alter historical records?
8. How will pattern registry UI and future Taskcode implementation be sequenced under user direction?

**No pattern schema/table/runtime is approved.**

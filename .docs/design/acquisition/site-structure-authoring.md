---
{id: GUIDE-SITE-STRUCTURE-AUTHORING,name: Site structure authoring guide for agents,type: guidance,tags: [website,data-engine,agents]}
---

# Site structure authoring

Define websites and APIs with the [source schema](../../../source/schema/sources/source.schema.json) and define discovery and extraction with [modules](../../../source/schema/sources/module.schema.json). Put source-specific selectors, pagination and expectations in module data. Use the [mapping schema](../../../source/schema/engine/mapping.schema.json) for field mappings and [term lists](../../../source/schema/engine/terms.schema.json) for reusable names. The [schema map](../../../source/schema/README.md) describes ownership and validation. Its [example bundle](../../../source/schema/sources/_example/website-bundle/) is authoring material.

A source recipe describes how to collect. The engine's collection gate determines whether and how collection may proceed. Follow the [collection policy](../policy/LEGALITY_SAFETY_AND_COMPLIANCE.md), the source assessment and approved scope. Keep credentials in runtime configuration. Preserve the source hash, retrieval context, mapping, and evidence locators.

Use `uv run mzizi-manifest refs` to check codes and references. Check seed CSVs with `uv run mzizi-manifest data`. The [runtime guide](WEB_ACQUISITION_RUNTIME.md) lists the available commands and the seed guide (seed now lives in the git-ignored `.dev/seed/`, [decision](../../decisions/DEC-SEED-OUTSIDE-GIT-20261125.md)) describes owner approval. Record unsupported fields, unresolved references and ambiguous structure as review findings.

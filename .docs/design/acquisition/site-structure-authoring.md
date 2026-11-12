---
{id: GUIDE-SITE-STRUCTURE-AUTHORING,name: Site structure authoring guide for agents,type: guidance,tags: [website,data-engine,agents]}
---

# Site structure authoring

Site/API acquisition inputs are source-neutral, versioned manifests under root `seed/`; their consumed shapes belong under `source/schema/`. Read the [acquisition design index](README.md) and [source requirements](../../_plan/schema-redesign/phase-01/source.md) before authoring. Publisher and country specifics belong in manifest or database data, not generic runtime packages.

A structure is a versioned extraction recipe, not permission to collect. Collection must pass the approved source identity and release binding, documented access/legal assessment, scope limits and security controls. Preserve the exact source artifact, retrieval time, structure release, mapping and candidate lineage. Reject credentials, authenticated-only collection, access-control evasion and unreviewed canonical writes.

Validate bundles against the active schema and command documented by the owning package README. Do not rely on archived `mzizi-data` commands or claim that a draft manifest is active collection support. Record unknown licensing, unsupported fields and unresolved structure behavior as review findings.

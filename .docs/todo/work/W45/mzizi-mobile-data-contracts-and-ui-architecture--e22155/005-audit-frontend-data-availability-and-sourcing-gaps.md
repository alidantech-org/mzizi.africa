---
{id: TSK-A6FEA3D3AA36,name: Audit frontend data availability and sourcing gaps,type: task,status: planned,priority: medium,created_at: 2026-11-04T15:55:46.313Z,updated_at: 2026-11-04T15:55:46.313Z,order: 5120}
---

# Goal

Determine which mobile features can be built using existing persisted data, which require safe aggregation or API shaping, and which depend on missing source datasets, research workflows, or governance decisions. The matrix should prevent the app from treating unknown or historical values as current and allow work to be prioritized by verified feasibility rather than appearance alone.

## Context

The repo includes both approved architecture and migration material, so an implemented table does not imply that a public API or complete dataset exists. MZIZI will eventually cover election results, public officials, fiscal institutions, demographic observations, administrative boundaries, and historical changes. Some datasets may come from KNBS, IEBC, official government registers, legal notices, or other organizations, each with different granularity and reuse constraints. No external source should be marked integrated without evidence.

## Acceptance checklist

- [ ] Cross-reference each planned mobile field and visual component against a verified schema, fixture, migration, or existing API implementation.
- [ ] Classify data readiness as available, computable, requiring API work, requiring external sourcing, or unverified.
- [ ] Capture source organization, coverage geography, time range, update cadence, provenance, licensing, and quality limitations where known.
- [ ] Identify necessary rollups, derived metrics, historical joins, geographic normalization, and boundary compatibility checks.
- [ ] Rank missing datasets and engineering gaps by user value, dependency, reliability, and implementation cost without invented estimates.
- [ ] Recommend a minimal, evidence-supported first mobile slice and flag any features that must show unavailable-data states.

## Deliverables

A source-traceable availability matrix, data acquisition backlog, aggregation/API gap list, and prioritized minimum viable data slice. Do not initiate scraping or change data pipelines in this planning task.

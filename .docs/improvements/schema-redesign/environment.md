---
id: DOC-EXP-ENVIRONMENT-20261111
name: Environment domain expansion brief
type: documentation
tags: [system-expansion, hypothetical, schema-design, environment]
extra: {status: hypothetical, approval: not_approved, implementation: not_authorized, recorded_on: 2026-11-11}
---

# Environment — observations, monitoring and environmental products

> **Status: HYPOTHETICAL DOMAIN BRIEF.** No Environment SQL is approved. This proposal is subordinate to the [system-expansion proposal](../advancement-and-system-expansion.md).

## 1. Purpose and exploration areas

Environment preserves monitored environmental conditions and model products, supporting Geography and Nature, History, Statistical analysis and Civic risk/service exploration.

## 2. Domain ownership

Candidate ownership: environmental monitoring stations/sensors, raw readings, calibration/deployment facts, environmental surveys and model/scenario metadata tied to original datasets.

## 3. Exclusions

Geography owns station place and geometry. Filesystem owns source and derived bytes. Statistical owns published/derived comparable series and indicators. Civic owns constructed infrastructure identity. Biology owns taxa and occurrences.

## 4. Existing schema and table inventory

No Environment schema is present in active SQL migrations or current listed Dryv domain contracts. This is a new hypothetical domain. Existing Statistical design owns datasets and observations but needs reconciliation to distinguish raw readings from aggregated series.

## 5. Candidate tables

| Candidate | Responsibility |
|---|---|
| `stations` | Monitoring site identity, operator and station history. |
| `sensors` | Instrument identity, measurement capability and deployment/calibration intervals. |
| `readings` | Original timestamped measurement with quantity, unit, status/quality and sensor FK. |
| `surveys` | Structured sampling campaign for environmental conditions. |
| `models` | Model/method identity, version, scenario and configuration references. |
| `products` | Dataset releases or model outputs with temporal/spatial coverage and file-version linkage. |

High-volume gridded products may remain filesystem assets indexed by metadata rather than row-per-cell database records.

## 6. Primary and foreign-key relationships

Readings should FK to sensor and, through a deployment, station; sensor deployment must be time-consistent. Stations link to Geography places. Products pin filesystem file versions, source evidence, model version and explicit coverage. Statistical derivations link back to Environment inputs through typed relationships.

## 7. Cross-domain relationships

Raw sensor readings belong only to Environment. Statistical may contain a summarized series derived from readings, with method and input lineage, but must not duplicate the raw stream. Environmental assets can link to Biology surveys, Civic infrastructure, Agriculture fields and Geography features.

## 8. Geographic responsibilities

Retain sensor coordinates/geometry through Geography place identity or a sourced deployment representation. Gridded products specify CRS, bounds, resolution, coordinate axes, nodata and spatial coverage. Uncertain locations remain uncertain.

## 9. Temporal responsibilities

A reading's observation instant/interval, sensor deployment interval, calibration period, model run period and dataset validity are different facts. Preserve source publication and Mzizi retrieval times separately. Avoid a universal `valid_from/to` pair.

## 10. Evidence and provenance

Preserve raw readings/files where available, source release, station/instrument identifiers, calibration, transformation, quality flags, model/version, inputs and uncertainty. Distinguish measured, interpolated, reanalysis, forecast and scenario values.

## 11. Acquisition categories

Static seed: measurement vocabularies. Pattern seed: only approved expected monitoring inventories. Collected: station feeds and published environmental files. Derived: aggregates, interpolations and indices with reproducible recipes. Record actual row lineage.

## 12. Derived data

Environment can host source-native transformations and model outputs. Statistical owns comparable time series and indicators; Geography owns spatial representations. Derivation records pin exact inputs, method, software/config and output asset.

## 13. Example queries

- What rainfall was observed at this station during a period, with quality flags?
- Which temperature grids cover this historical boundary edition?
- What sensor and method support the drought exposure shown for this place?

## 14. UI/API requirements

Expose time-series, station maps and raster/vector layer capabilities only when resolution, coverage, licensing and data quality are known. Provide missing-data and uncertainty states.

## 15. Integrity constraints to investigate

Unit compatibility, timestamp/calendar semantics, sensor deployment overlap, calibration validity, duplicate source readings, station identifier changes, null/nodata meaning, model input pinning and temporal coverage consistency.

## 16. Technical standards to evaluate

NetCDF/Zarr and CF conventions; OGC SensorThings and EDR; STAC; GeoTIFF/Cloud Optimized GeoTIFF; PostGIS for curated vectors. Evaluate interoperability per product rather than requiring one format for all data.

## 17. Open questions

Which observations belong in domain tables versus immutable data assets? How to model telemetry volume? Are sensor and model records separate domains? Which environmental products are valuable first? What access controls protect sensitive monitoring locations?

## 18. Review and approval status

Hypothetical; not reviewed or approved. Reconcile with Statistical, Geography, Biology, files and data-engine contracts before schema planning.

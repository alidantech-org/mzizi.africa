---
{id: TSK-BF88B31E115A,name: "Reinforcement framework: coverage, gap queue and refill jobs",type: task,status: in-progress,priority: medium,created_at: 2026-11-02T20:02:42.756Z,updated_at: 2026-11-03T01:26:56.098Z,order: 3072,extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-02T22:01:58.649Z},{from: in-progress,to: completed,at: 2026-11-03T01:26:29.976Z},{from: completed,to: in-progress,at: 2026-11-03T01:26:56.098Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-BF88B31E115A/1793656918651-start,started_at: 2026-11-02T22:01:59.158Z,end_ref: refs/tracking/TSK-BF88B31E115A/1793669189978-end,ended_at: 2026-11-03T01:26:29.976Z,summary: {files: 651,insertions: 35145,deletions: 1365}},{base_ref: refs/tracking/TSK-BF88B31E115A/1793669216100-start,started_at: 2026-11-03T01:26:56.611Z}]}}}
---

# Reinforcement framework: coverage, gap queue and refill jobs

## Goal

Give the platform a general way to find what is missing, queue work to find it, and refill it when a source is found, so that nullable data becomes a managed backlog rather than silent gaps.

## Context

Because the schema accepts missing data almost everywhere, completeness is a measured property. A coverage report counts, per entity kind and per field, how many records have a value, how many are known absent, and how many are unknown, for example counties without a flag, parties without a registration date, constituencies without a population figure, institutions without a confirmed site, people without a portrait. Each unknown becomes a gap item with the entity, the field and the sources worth trying, and a refill job runs a search (Wikidata, the ORPP, KNBS, the IEBC, site probes) and records the attempt and result, whether found, not found or ambiguous, so the same search is not repeated without reason. Found values go through the normal staging, validation and review path; they are never written directly. This task builds the coverage queries, the gap table, the refill job type in the existing job runner and a status report.

## Acceptance checklist

- [x] Define coverage rules for the main entity kinds and fields and write the queries.
- [x] Add the gap queue table and attempt log in the engine schema.
- [x] Add a refill job type to the job runner with a handler per source.
- [x] Route found values through staging and review rather than writing them directly.
- [ ] Publish a coverage report in the status document and the review workbench.
- [x] Add tests for gap creation, an attempt that finds nothing, and a refill that goes through review.

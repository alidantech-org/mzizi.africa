---
{id: TSK-BF88B31E115A,name: "Reinforcement framework: coverage, gap queue and refill jobs",type: task,status: planned,priority: medium,created_at: 2026-11-02T20:02:42.756Z,updated_at: 2026-11-02T20:02:42.756Z,order: 3072}
---

# Reinforcement framework: coverage, gap queue and refill jobs

## Goal

Give the platform a general way to find what is missing, queue work to find it, and refill it when a source is found, so that nullable data becomes a managed backlog rather than silent gaps.

## Context

Because the schema accepts missing data almost everywhere, completeness is a measured property. A coverage report counts, per entity kind and per field, how many records have a value, how many are known absent, and how many are unknown, for example counties without a flag, parties without a registration date, constituencies without a population figure, institutions without a confirmed site, people without a portrait. Each unknown becomes a gap item with the entity, the field and the sources worth trying, and a refill job runs a search (Wikidata, the ORPP, KNBS, the IEBC, site probes) and records the attempt and result, whether found, not found or ambiguous, so the same search is not repeated without reason. Found values go through the normal staging, validation and review path; they are never written directly. This task builds the coverage queries, the gap table, the refill job type in the existing job runner and a status report.

## Acceptance checklist

- [ ] Define coverage rules for the main entity kinds and fields and write the queries.
- [ ] Add the gap queue table and attempt log in the engine schema.
- [ ] Add a refill job type to the job runner with a handler per source.
- [ ] Route found values through staging and review rather than writing them directly.
- [ ] Publish a coverage report in the status document and the review workbench.
- [ ] Add tests for gap creation, an attempt that finds nothing, and a refill that goes through review.

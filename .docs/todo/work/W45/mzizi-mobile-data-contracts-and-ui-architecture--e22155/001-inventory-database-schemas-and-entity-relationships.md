---
{id: TSK-022968890CDE,name: Inventory database schemas and entity relationships,type: task,status: planned,priority: medium,created_at: 2026-11-04T15:55:45.410Z,updated_at: 2026-11-04T15:55:45.410Z,order: 1024}
---

# Goal

Produce a complete, source-linked inventory of database entities that can inform the MZIZI mobile experience. Capture the structures currently implemented in the database management engine and those retained as migration source material in the legacy FastAPI service. The inventory must distinguish deployed or migrated structures, checked-in designs, and merely proposed domains; it is not permission to treat every legacy table as an approved long-term API contract.

## Context

MZIZI is an evidence-first African geography, governance, history, culture, and political intelligence platform. The repository contract requires separate ownership for extraction, intelligence, canonical storage, and the eventual NestJS API. Political offices, elections, geographic units, names, and boundaries are time-dependent. Provenance and data versioning cannot be postponed. Review the architectural and data lifecycle documents before categorizing models, and cite the exact schema, migration, or service path for every claim.

## Acceptance checklist

- [ ] Inspect current and legacy schema definitions, ORM models, migrations, constraints, indexes, and seed structures without changing them.
- [ ] Produce a domain-organized entity catalog with primary identifiers, attributes, data types, nullability, enums, and unique constraints.
- [ ] Diagram or tabulate foreign keys, join entities, cardinalities, ownership, and geographic parent-child relationships.
- [ ] Identify temporal validity, aliases, boundary history, source attribution, review state, and record-versioning fields or gaps.
- [ ] Label each entity and relationship as implemented, legacy, proposed, or unverified, with repository path evidence.
- [ ] Record omissions, inconsistencies, and high-impact questions for later JSON contracts and UI planning.

## Deliverables

One searchable entity catalog, relationship inventory, domain coverage summary, and gap register stored under the existing Task-managed documentation conventions. Do not make schema changes in this task.

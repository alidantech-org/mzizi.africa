---
{id: GRP-B03916E22155,name: MZIZI Mobile — Data Contracts and UI Architecture,type: documentation,extra: {created_at: 2026-11-04T15:55:45.217Z}}
---

# Plan

Start with a read-only inventory of implemented and legacy models, migrations, enums, indexes, and references; compare these against the current architecture documentation and note unimplemented proposals. Next specify versionable read contracts for mobile use, then map field semantics to reusable visual components. Produce screen specifications and navigational journeys from those contracts rather than guessing what the API already returns. Audit each proposed screen against data availability and prepare realistic, explicitly synthetic or source-verified mock JSON fixtures for independent frontend work.

## Sequencing and safeguards

Follow the six tasks in order while allowing the data availability review to begin once the inventory exists. Never treat AI-assisted text or mock records as canonical evidence. Preserve source, observation date, historical validity intervals, place identity and boundaries, and disputed or unknown status. Do not add workflows or change production code as part of this planning group. Maintain links among task outputs and document blocking gaps or assumptions instead of hiding them. Review findings before substantial app or backend changes; all work remains on develop.

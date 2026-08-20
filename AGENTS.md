# AGENTS.md — Mzizi Africa Repository Contract

This file defines how coding agents and contributors should reason about the Mzizi Africa repository.

## 1. Start with the purpose

Before changing architecture or domain behavior, read:

1. `.docs/WHY.md`
2. `.docs/STORY.md`
3. `.docs/ARCHITECTURE.md`
4. `.docs/DATA_LIFECYCLE.md`
5. `.docs/DOMAINS.md`
6. `.docs/MIGRATION.md`

Mzizi is an **evidence-first African heritage, history, geography, culture, linguistics, governance and political intelligence platform**. The goal is to research public/historical material and structure it cleanly while preserving provenance, time, place, uncertainty and version history.

## 2. Do not collapse the architecture

The system has intentionally separate responsibilities:

- public application
- research/dashboard application
- file management service
- data extraction engine
- intelligence/AI layer
- database management engine
- canonical database
- NestJS API

Do not place a responsibility in the nearest convenient service merely because code already exists there.

### Hard boundaries

- **Data extraction is not the API.**
- **AI classification is not data extraction.**
- **AI output is not canonical truth.**
- **Database migrations/seeding are not API responsibilities.**
- **File storage is not database record storage.**
- **The current Python FastAPI service is not the target API.**
- **The future product API is NestJS.**

## 3. Treat the current Python API as migration source material

`services/api` contains valuable domain design, schema work, migrations, seeds and extraction-related code inherited from the previous political-governance project.

Do not deepen it as the long-term public API unless explicitly instructed.

When replacing it:

1. inventory useful models and behavior;
2. extract domain concepts and constraints;
3. move migration/seeding concerns into the database management engine;
4. move extraction concerns into the data engine;
5. move file concerns into the file service;
6. move intelligence concerns into the intelligence layer;
7. expose approved domain contracts through the NestJS API;
8. only remove old code after equivalent responsibilities are accounted for.

See `.docs/MIGRATION.md`.

## 4. Evidence is part of the data model

Every meaningful historical or political claim should be able to answer:

- Where did this come from?
- What source artifact supports it?
- When was the source obtained?
- What location/time period does the claim describe?
- Was it directly extracted, inferred, manually curated or AI-assisted?
- How confident are we?
- Is the claim disputed?
- Which version is current?
- What changed from the previous version?

Never design domain records as if provenance can be added later as an optional afterthought.

## 5. Preserve raw evidence

The system must distinguish:

```text
raw source
  -> extracted representation
  -> normalized candidate data
  -> classified/linked/evaluated staging data
  -> reviewed/versioned canonical data
```

Do not overwrite raw source artifacts with cleaned text or normalized records.

## 6. Time and place are first-class

Historical truth changes by context.

Whenever applicable, designs should represent:

- `valid_from` / `valid_to` or equivalent historical validity;
- observation/retrieval time separately from historical validity;
- changing names and aliases;
- changing boundaries;
- changing parent/child geography;
- historical polities that do not map neatly to current states;
- uncertain or approximate dates;
- source-specific claims and disagreements.

Do not force pre-colonial or colonial history into today's national borders when the historical evidence does not support that model.

## 7. AI must be attributable and reviewable

The intelligence layer may assist with:

- classification;
- entity extraction;
- normalization;
- deduplication;
- entity resolution;
- relation suggestions;
- source comparison;
- contradiction detection;
- quality evaluation;
- confidence suggestions;
- summaries for reviewers;
- enrichment proposals.

AI-produced data must retain enough metadata to identify the method/model/tool invocation and inputs that produced it. AI must not silently mutate canonical records.

## 8. Domain naming should explain why it exists

Mzizi domains are not arbitrary database modules. Each should support the wider story:

- heritage/culture preserves identity and material/intangible history;
- history establishes chronology and change;
- geography establishes place and boundary evolution;
- linguistics reveals language relationships and movement;
- migration explains population movement and settlement;
- colonial influence links historical disruption/administration to modern institutions;
- governance explains formal authority;
- politics explains competition and organization around power;
- law explains the legal basis of authority;
- finance/debt/procurement reveal how public power uses resources;
- evidence/provenance makes the whole system trustworthy.

Read `.docs/DOMAINS.md` before introducing new top-level domains.

## 9. Documentation is part of implementation

If a change alters architecture, data lifecycle, domain ownership or product purpose, update the corresponding `.docs` file in the same work.

Do not leave architectural truth only in code or chat history.

## 10. Prefer explicit contracts between layers

Services should communicate through documented, versionable contracts rather than importing each other's internals.

Examples:

- file artifact descriptor;
- extraction job/result;
- candidate record;
- intelligence evaluation;
- provenance/evidence link;
- canonical record version;
- API DTO/event.

These contracts should eventually live in shared packages or schemas once implementation begins.

## 11. Applications consume knowledge; they do not define it

`apps/www` and `apps/dashboard` should consume stable domain contracts.

Avoid putting canonical domain rules only in React components or frontend-specific types.

## 12. Repository hygiene

- Work on the branch explicitly requested by the user; do not create branches unless requested.
- Do not add or modify `.github/**` unless explicitly requested.
- Keep generated files, local databases, build outputs, virtual environments and dependency directories out of source control.
- Prefer small, meaningful commits when making repository changes.
- Preserve working functionality while migrating responsibilities.

## 13. Decision test

Before adding a feature, ask:

> Does this help Mzizi research, preserve, structure, verify, connect, version or explain African historical and present-day knowledge?

If the answer is unclear, document the reason before expanding the platform.

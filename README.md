# Mzizi Africa

**Mzizi Africa is an evidence-first African heritage, history, geography, culture, linguistics, governance and political intelligence platform.**

The project researches public and historical material, preserves the original evidence, extracts and cleans structured facts, records uncertainty and provenance, versions changes over time, and exposes the resulting knowledge through maps, timelines, research tools, public experiences and APIs.

Mzizi is not only a news site, museum, political dashboard, database, or AI application. It is the shared knowledge infrastructure beneath all of those experiences.

## Why Mzizi exists

Africa's history and present-day political reality are deeply connected, but the underlying information is usually fragmented across books, archives, government websites, PDFs, maps, colonial records, oral-history projects, datasets, election portals, legal documents and modern reporting.

That fragmentation makes it difficult to answer connected questions such as:

- What polity, kingdom, community or administration existed in this place at a given time?
- How did borders, names and administrative divisions change?
- Which languages and cultural communities moved through or shaped a region?
- How did migration, trade and colonial rule alter institutions and identities?
- Which constitution or law created a modern office, and who held it?
- How did a historical institution evolve into a current political structure?
- What promises, elections, budgets, debts, tenders or public actions followed?
- Which sources support each claim, and how confident should we be in it?

Mzizi exists to research and structure this information cleanly so that history, heritage and the current world can be explored as one connected, evidence-backed system.

Read [.docs/WHY.md](.docs/WHY.md), [.docs/GOALS.md](.docs/GOALS.md) and [.docs/STORY.md](.docs/STORY.md) first.

## Product surfaces

```text
mzizi.africa/
├── apps/
│   ├── www/            Public atlas, heritage museum and exploration experience
│   └── dashboard/      Research, curation, review and data-stewardship workspace
│
├── services/
│   └── api/            Current Python code; source material during architecture migration
│
└── .docs/              Product, system and research documentation
```

The current repository is consolidated, but the target service architecture is intentionally broader than the code that exists today.

## Target repository shape

```text
mzizi.africa/
├── apps/
│   ├── www/
│   └── dashboard/
├── services/
│   ├── files/          Evidence artifact lifecycle
│   ├── data-engine/    Discovery, extraction and parsing
│   ├── intelligence/   AI/tool classification, cleaning and evaluation
│   ├── db-engine/      Migrations, seeds, validation and promotion
│   └── api/            Future NestJS product API
├── packages/           Shared contracts/taxonomies when justified
└── .docs/
```

## Target system layers

Mzizi will separate responsibilities instead of treating one API as the whole backend.

```text
Sources / Archives / Government / Web / Datasets
                    │
                    ▼
             File Management
                    │
                    ▼
              Data Engine
      discovery • extraction • parsing
                    │
                    ▼
          Intelligence Layer / AI Tools
 classification • cleaning • linking • evaluation
                    │
                    ▼
       Versioned Evidence + Staging Records
                    │
                    ▼
       Database Management Engine
 migrations • schema • seeds • promotion • repair
                    │
                    ▼
            Canonical Mzizi Database
                    │
                    ▼
             NestJS API Layer
                    │
          ┌─────────┴─────────┐
          ▼                   ▼
      apps/www          apps/dashboard
```

### 1. File management layer

Owns source files and their identity: PDFs, scans, images, maps, datasets, exports and other evidence artifacts. It records hashes, metadata, provenance and immutable/raw versions so structured data can always be traced back to evidence.

### 2. Data engine

A separate extraction and ingestion engine. It discovers sources, fetches permitted material, extracts text/tables/metadata, parses documents, normalizes basic representations and emits structured extraction results. Python is a natural fit for this layer because of its document, OCR, geospatial and data-processing ecosystem.

### 3. Intelligence layer

AI is an explicit tool-assisted intelligence layer, not the database itself. It helps classify, clean, reconcile, link, deduplicate, evaluate and enrich extracted material. Every AI-derived result must preserve evidence, confidence, method/model metadata and version history before promotion into canonical data.

### 4. Database management engine

A dedicated engine owns database lifecycle operations: schemas, migrations, seeds, reference data, validation, import/export, repair and controlled promotion of reviewed data. Database management must not be hidden inside the public API.

### 5. API layer

The long-term application API will be built in **NestJS**. It exposes stable product contracts over approved canonical data. The existing Python FastAPI service is not the target API architecture; its useful domain models, migrations, seed logic and research work should be extracted and migrated into the new system deliberately.

### 6. Applications

- **`apps/www`** — public-facing African atlas, heritage museum, historical explorer and evidence-backed knowledge experience.
- **`apps/dashboard`** — internal/research workspace for source review, extraction review, curation, classification, corrections, publishing and governance intelligence.

## Knowledge domains

Mzizi connects historical and contemporary layers rather than isolating them:

- African heritage and culture
- History and historical periods
- Geography and changing boundaries
- Pre-colonial polities, kingdoms, states and communities
- Linguistics, languages and language families
- Human migration, settlement and mobility
- Trade routes, resources and economic networks
- Colonial influence and administrative transformation
- Independence, post-colonial state formation and institutional change
- Constitutions, laws and legal authority
- Governance structures, offices and institutions
- Political parties, movements and ideologies
- People, leaders, office holders and historical actors
- Elections, representation, candidates, results and manifestos
- Public finance, budgets, expenditure and revenue
- Public debt
- Procurement, tenders and contracts
- Diplomacy, conflict, alliances and major events
- Statistics and development indicators
- Sources, evidence, provenance, uncertainty and scholarly disagreement

See [.docs/DOMAINS.md](.docs/DOMAINS.md) for the reason each domain belongs in the same platform.

## Core principles

1. **Evidence first** — a claim should be traceable to one or more sources.
2. **Time is first-class** — borders, names, offices, laws, identities and relationships change.
3. **Place is first-class** — historical and modern information must be geographically contextualized.
4. **Uncertainty is preserved** — disputed, estimated or weakly evidenced claims must not be presented as unquestioned fact.
5. **Raw evidence is preserved** — extraction never replaces the source artifact.
6. **AI assists; it does not silently author truth** — AI output is evaluated, versioned and attributable.
7. **Canonical data is curated** — extraction/staging and published knowledge are separate states.
8. **History connects to the present** — heritage and pre-colonial history should explain, contextualize and challenge modern political/geographic assumptions.
9. **Africa is not modeled as timeless modern borders** — historical geography and changing political entities must be representable on their own terms.
10. **The system should be reusable** — public products, researchers and future tools should consume the same structured knowledge base.

## Documentation

Start with:

- [.docs/README.md](.docs/README.md) — documentation map
- [.docs/WHY.md](.docs/WHY.md) — common purpose and reasons
- [.docs/GOALS.md](.docs/GOALS.md) — goals, success conditions and non-goals
- [.docs/STORY.md](.docs/STORY.md) — product story and user journey
- [.docs/DOMAINS.md](.docs/DOMAINS.md) — knowledge domains and why they matter
- [.docs/SYSTEM.md](.docs/SYSTEM.md) — system responsibilities and invariants
- [.docs/ARCHITECTURE.md](.docs/ARCHITECTURE.md) — target technical architecture
- [.docs/DATA_LIFECYCLE.md](.docs/DATA_LIFECYCLE.md) — evidence-to-canonical-data pipeline
- [.docs/MIGRATION.md](.docs/MIGRATION.md) — transition from the consolidated legacy code
- [.docs/ROADMAP.md](.docs/ROADMAP.md) — build sequence

## Current state

The repository contains valuable code from earlier projects, especially the public Mzizi experience, the dashboard and the Python political/governance backend. Consolidation is complete at the repository level; architectural consolidation is now the work.

Existing code should be treated as source material to preserve, understand and migrate — not as proof that the current boundaries are the final system design.

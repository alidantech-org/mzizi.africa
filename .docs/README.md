# Mzizi Africa Documentation

This directory is the durable system and product memory for Mzizi Africa.

The documentation should answer four questions in order:

1. **Why does Mzizi exist?**
2. **What story and user value does the platform create?**
3. **What knowledge must Mzizi represent?**
4. **How should the system be built to preserve evidence and trust?**

## Read order

### 1. [WHY.md](WHY.md)

The common purpose behind the whole platform. Read this before debating features, technologies or database models.

### 2. [STORY.md](STORY.md)

The Mzizi product story: from fragmented African evidence to an explorable, connected historical and present-day knowledge system.

### 3. [DOMAINS.md](DOMAINS.md)

The knowledge domains Mzizi must represent and the reason each domain belongs in the platform.

### 4. [ARCHITECTURE.md](ARCHITECTURE.md)

The target technical architecture and hard boundaries between applications, file management, extraction, intelligence, database management and the NestJS API.

### 5. [DATA_LIFECYCLE.md](DATA_LIFECYCLE.md)

How a source moves from discovery to immutable evidence, extraction, AI-assisted processing, review, versioning and canonical publication.

### 6. [MIGRATION.md](MIGRATION.md)

How the current consolidated code should be decomposed without losing useful work from the previous Python political-governance service and dashboard.

### 7. [ROADMAP.md](ROADMAP.md)

A build sequence that prioritizes platform foundations before product surface expansion.

## Documentation principles

### Purpose before implementation

A feature should have a documented reason tied to Mzizi's purpose. A database table or service is not justified merely because data exists for it.

### Architecture before convenience

Current code placement does not define the final architecture. Consolidation brought the code into one repository; the next stage is to create clean internal system boundaries.

### Evidence before claims

If the system cannot explain where information came from, the record is incomplete.

### Historical context before modern assumptions

Modern borders and administrative categories are useful, but they cannot be allowed to flatten older African political, cultural, linguistic and geographic realities.

### Uncertainty before false precision

Approximate dates, disputed boundaries, conflicting source claims and scholarly disagreement must be representable explicitly.

### Documentation evolves with the system

When an architectural boundary, domain responsibility or core data-lifecycle rule changes, update the documentation in the same work that changes the implementation.

## Target documentation expansion

As implementation grows, this directory should gain focused specifications for:

```text
.docs/
├── README.md
├── WHY.md
├── STORY.md
├── DOMAINS.md
├── ARCHITECTURE.md
├── DATA_LIFECYCLE.md
├── MIGRATION.md
├── ROADMAP.md
│
├── architecture/
│   ├── contracts.md
│   ├── deployment.md
│   ├── observability.md
│   └── security.md
│
├── data/
│   ├── provenance.md
│   ├── versioning.md
│   ├── temporal-model.md
│   ├── geography.md
│   └── quality.md
│
├── services/
│   ├── data-engine.md
│   ├── database-engine.md
│   ├── file-service.md
│   ├── intelligence-layer.md
│   └── api.md
│
└── product/
    ├── public-atlas.md
    ├── heritage-museum.md
    ├── research-dashboard.md
    └── governance-intelligence.md
```

Those documents should be added when their corresponding implementation begins rather than creating empty specifications prematurely.

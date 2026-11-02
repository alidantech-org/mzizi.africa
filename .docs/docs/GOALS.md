# GOALS — What Mzizi Must Achieve

## North-star goal

Build a trustworthy, explorable and reusable structured knowledge system for African heritage, history, geography, culture, linguistics, governance and politics — one that preserves evidence and connects historical change to the present.

## Goal 1 — Research before presentation

Mzizi must support serious source-driven research, not only attractive pages.

### Why

A beautiful historical map or political profile is weak if the platform cannot explain where its claims came from.

### Success looks like

- sources can be registered and preserved;
- extraction is reproducible;
- claims point to evidence;
- disputed/uncertain material is visible;
- reviewers can inspect lineage;
- published content can be corrected through versioning.

## Goal 2 — Preserve Africa's historical depth

Represent African societies and political systems before, during and after colonial rule without making modern state boundaries the default explanation for every period.

### Why

Modern borders and institutions are historically recent. Flattening earlier history into modern countries loses political, cultural and geographic meaning.

### Success looks like

- historical polities exist as first-class entities;
- approximate/disputed boundaries are possible;
- names and geography change over time;
- colonial and post-colonial transformations are explicit;
- users can navigate a place through multiple historical periods.

## Goal 3 — Build a digital heritage museum

Create a public experience where heritage, culture, language, places and stories can be explored visually and contextually.

### Why

Heritage makes structured history understandable and personally meaningful. It also provides an accessible entry point for students, diaspora communities and the general public.

### Success looks like

- heritage objects/stories connect to place/time/people/language;
- curated collections exist alongside data exploration;
- source evidence remains visible;
- the museum experience links naturally into deeper historical and political context.

## Goal 4 — Connect history to current governance and politics

Allow users to follow institutional and geographic change from historical systems into current political reality where evidence supports the connection.

### Why

Mzizi is most valuable when it helps users understand why current institutions, borders and political relationships look the way they do.

### Success looks like

- constitutions/laws connect to offices;
- offices connect to people and appointments/elections;
- political parties/candidates connect to elections;
- governments connect to budgets, debt and procurement;
- historical institutional lineage is explorable.

## Goal 5 — Make language and migration explorable

Structure linguistic and migration evidence as temporal/geographic relationships.

### Why

Language and movement reveal historical contact, settlement, identity and cultural exchange that political records alone cannot explain.

### Success looks like

- language families and variants are modeled;
- names/endonyms/exonyms are preserved;
- language/place relationships can change through time;
- migration claims retain source/confidence status;
- competing historical hypotheses can coexist.

## Goal 6 — Make provenance unavoidable

Evidence, uncertainty and transformation history must be part of normal data operations.

### Why

Historical and political data is often contested. Trust requires inspectable lineage.

### Success looks like

- raw artifacts are preserved;
- extracted/cleaned/AI-derived values remain distinguishable;
- canonical records preserve evidence links;
- every major transformation is attributable;
- important changes create versions rather than silent overwrites.

## Goal 7 — Use AI to scale research safely

Provide AI as a controlled intelligence/tool layer for classification, cleaning, linking and evaluation.

### Why

Mzizi's source universe is too large and messy for purely manual processing, but uncited AI generation would undermine the platform's purpose.

### Success looks like

- AI operations are explicit jobs/tools;
- model/tool/config identity is recorded;
- outputs are structured;
- confidence/evaluations are stored;
- AI output enters staging/review rather than directly rewriting canonical truth.

## Goal 8 — Separate system responsibilities cleanly

Build dedicated file, extraction, intelligence, database-management and API layers.

### Why

The current consolidated code inherited unrelated concerns inside a Python backend. Keeping that shape would make extraction, data lifecycle and public API development tightly coupled.

### Success looks like

- file service owns artifacts;
- data engine owns extraction;
- intelligence layer owns reasoning/classification/evaluation;
- DB engine owns migrations/seeding/promotion;
- NestJS API owns product contracts;
- apps consume stable contracts.

## Goal 9 — Create reusable African knowledge infrastructure

Mzizi should support more than its own website.

### Why

A well-structured evidence-backed knowledge base can support researchers, journalists, educators, civil-society organizations, policy teams and future applications.

### Success looks like

- stable APIs/contracts;
- exportable records with provenance;
- reusable geographic/time/entity identifiers;
- research and public views consume the same canonical knowledge.

## Goal 10 — Build incrementally without losing previous work

Reuse valuable models, migrations, seed concepts, UI work and research from consolidated repositories while replacing incorrect architecture deliberately.

### Why

Rewriting everything at once wastes useful work and increases the risk of silently losing domain knowledge.

### Success looks like

- legacy responsibilities are inventoried;
- each is assigned a target owner;
- migrations happen domain by domain;
- equivalent behavior is verified before old code is removed.

---

# Product feature families and their reason

| Feature family | Main reason |
| --- | --- |
| Historical map | Show changing place/boundaries over time |
| Timeline | Make chronology and institutional change navigable |
| Heritage museum | Make culture/history accessible and contextual |
| Place/polity profiles | Give durable homes to geographic/historical entities |
| Language explorer | Connect linguistic evidence to place and movement |
| Migration explorer | Show movement/settlement as sourced historical relationships |
| Colonial transformation views | Connect pre-colonial structures to colonial and modern change |
| Constitution/law explorer | Explain formal legal authority through time |
| Governance directory/history | Explain offices, institutions and office-holder lineage |
| Election explorer | Connect political competition to representation and power |
| Manifesto tracking | Connect promises to later governance actions |
| Finance/debt/procurement | Show how public authority uses resources |
| Source/evidence views | Make claims inspectable and trustworthy |
| Research dashboard | Turn evidence into reviewed structured knowledge |
| Data engine | Scale repeatable source extraction |
| Intelligence tools | Scale classification/cleaning/evaluation safely |
| DB management engine | Protect schema/data lifecycle from API concerns |
| NestJS API | Expose stable product/integration contracts |
| File service | Preserve source evidence and derivative artifacts |

---

# Non-goals

Mzizi is not trying to become:

- an uncited AI answer engine;
- a general-purpose social network;
- a breaking-news publisher competing on speed alone;
- a generic cloud file drive;
- a single monolithic backend;
- a system where every historical claim is forced into a single unquestioned interpretation;
- a database that treats current national borders as the only valid geography;
- a replacement for archives, museums or scholars.

Mzizi should instead make archives, scholarship and public records more connected, inspectable and explorable.

# Decision rule

A major feature is aligned when it improves one or more of:

```text
research quality
source preservation
historical fidelity
geographic/temporal understanding
cultural/linguistic understanding
governance transparency
political understanding
provenance/trust
structured reuse
```

Features that cannot show a clear contribution to these goals should not become platform priorities.

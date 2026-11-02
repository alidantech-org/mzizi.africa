# Mzizi Research & Stewardship Dashboard

`apps/dashboard` is the internal/research application for Mzizi Africa.

The current codebase was inherited from the earlier **Katiba Book / Political Finance & Risk Intelligence** project. That work is still valuable, especially for governance, elections, political finance and geographic analysis, but it no longer defines the full product scope.

The target role of this app is a **research, curation, review and data-stewardship workbench** for all Mzizi domains.

## Target responsibilities

The dashboard should eventually support:

- source registration and discovery review;
- evidence artifact inspection;
- extraction job monitoring;
- extracted text/table review;
- AI classification review;
- OCR-cleaning review;
- entity resolution and alias matching;
- historical geography/boundary review;
- relationship suggestions;
- contradiction/disagreement review;
- candidate-record queues;
- data-quality evaluation;
- confidence/dispute management;
- canonical approval/publishing;
- correction and supersession workflows;
- version/history inspection;
- research coverage and gap analysis;
- governance/election/finance research views.

## What the dashboard is not

It is not only a CRUD admin panel and it is not only a political-finance dashboard.

Its central purpose is to support the controlled transformation:

```text
source evidence
  -> extraction
  -> AI/tool suggestions
  -> candidate records
  -> validation/review
  -> canonical versioned knowledge
```

## Valuable inherited capabilities

The existing Katiba Book work provides useful starting material for:

- political campaign finance;
- government budgets and tenders;
- politicians and political parties;
- elections and elective positions;
- demographic/geographic analysis;
- charts, search and filters;
- operational dashboard patterns.

These should be preserved selectively and integrated into the wider Mzizi research model rather than discarded.

## Architecture boundary

The dashboard consumes service/API contracts. It must not become the hidden owner of:

- canonical domain rules;
- database migrations;
- source scraping;
- file storage;
- AI execution lineage;
- direct uncontrolled canonical DB writes.

Research actions should go through explicit workflows and the future NestJS API.

## Current stack

The inherited application is a Next.js/TypeScript dashboard using Tailwind/shadcn-style components. Existing package/configuration files remain authoritative for the current implementation until the dashboard is modernized.

## Migration direction

The recommended sequence is:

1. preserve working inherited screens;
2. inventory which data/API dependencies they use;
3. introduce source/evidence and candidate-review workflows;
4. connect those workflows to the new service contracts;
5. migrate governance/political-finance views to the future NestJS API;
6. remove stale Katiba Book naming and assumptions as corresponding functionality is migrated.

Do not rewrite the whole dashboard before the underlying evidence/data contracts exist.

## Read first

- [`../../.docs/WHY.md`](../../.docs/WHY.md)
- [`../../.docs/GOALS.md`](../../.docs/GOALS.md)
- [`../../.docs/STORY.md`](../../.docs/STORY.md)
- [`../../.docs/SYSTEM.md`](../../.docs/SYSTEM.md)
- [`../../.docs/DATA_LIFECYCLE.md`](../../.docs/DATA_LIFECYCLE.md)
- [`../../.docs/MIGRATION.md`](../../.docs/MIGRATION.md)

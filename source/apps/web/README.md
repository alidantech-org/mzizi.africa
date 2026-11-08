# Mzizi Research & Stewardship Dashboard

`source/apps/web` (the research dashboard) is the internal/research application for Mzizi Africa.

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

## Review workbench (`/review`)

The reviewer workbench runs on the **Bun** runtime on port 3100. It reads and acts through the NestJS API (reviewer-only `/v1/pipeline/*` endpoints and the audit decisions endpoint); it never touches the database directly.

Local development stack (needs the PostGIS container: `docker start postgis`):

```bash
cd source/apps/web && bun install && bun run dev:env          # creates .local/secure/dev-auth keys (git-ignored; or fetch the stored pair with `uv run mzizi-filesystem secure-get dev-auth/private.pem`)
cd ../../backend/engine/database
export DATABASE_URL=postgres://postgres@localhost:5432/mzizi_dev
bun src/cli.ts migrate && bun src/cli.ts seed dev-accounts     # dev reviewer and dev admin accounts
bun src/cli.ts grants-reviewer mzizi_reviewer                   # after creating that login role
```

Then put the values in the repository-root `.env` (database URLs for the read, write, reviewer and promote roles, `AUTH_ISSUER=https://dev.mzizi.local`, `AUTH_PUBLIC_KEY` from `.local/secure/dev-auth/public.pem`) and start `bun src/main.ts` in `source/backend/api` and `bun run dev` here, then open http://localhost:3100/review. Sign-in is development only and refuses any host other than localhost; real single sign-on later replaces the minted token with the identity provider's, through the same API verifier (`AUTH_JWKS_URL`).

Permissions, not role names, gate actions: `pipeline.read`, `review.decide`, `candidate.promote` and `assessment.approve` (the last two held by admin for now). An AI agent or a person may approve and promote; every decision is recorded against the approving account.

Checks: `bun run typecheck`, `bun test` (catalog, components), and with the stack running `bun scripts/smoke.ts` (loads every review page as reviewer and admin). Regenerate the data browser catalog after the API gains list routes with `bun scripts/data-catalog.ts`. The inherited `/admin` pages need `SERVER_URL` (the file and scraper service) to build and to show data; without it they fail soft.

Single sign-on: run any OpenID Connect provider that supports authorization code with PKCE (the repository no longer ships a local identity-provider setup), export `AUTH_ISSUER` and `AUTH_JWKS_URL` for the API and `OIDC_ISSUER=<issuer URL> OIDC_CLIENT_ID=<public client id>` for this app; the login page then offers single sign-on (identities must be linked to accounts in the `auth` schema). Without `OIDC_ISSUER` the localhost dev sign-in is used, and `scripts/smoke.ts` only works in that mode.

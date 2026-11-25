---
{id: RULE-API-MODULES,name: API module names and boundaries,type: rule,tags: [api,nestjs,dryv,modules,agent-guidance]}
---

# API module names and boundaries

**Required for every API module, contract and generated NestJS module (owner decision, 25 November 2026).**

## Modules are named after schemas

Each API module carries the name of the database schema whose data it owns: `reference`, `identity`, `vocabulary`, `geography`, `official`, `source`, `legal`, `governance`, `legislature`, `politics`, `election`, `civic`, `finance`, `economy`, `statistics`, `event`, `history`, `media`, `filesystem`, `community`, `product`, `auth`. A reader who knows the schema map knows where an operation lives.

- A module's submodules are named after that schema's tables or clear groups of them (for example `governance` → `institutions`, `offices`, `holders`, `powers`).
- An operation lives in the module of the schema that owns the rows it reads or writes first.

## No vague or overlapping modules

Names that describe an action or a screen rather than an owner are not allowed: for example `explorer`, `insights`, `experience`, `locality`, `structure`, `ledger`, `interactions`. They grow into several modules doing the same thing (today `explorer`, `locality` and `geography` all read places).

- Two modules must never serve the same rows for the same purpose.
- Before adding a module, check the schema map; if a schema already owns the data, add a submodule or action there.

## One module for shaping data for the frontend

Screens often need data from several schemas at once (a place page: geography, statistics, governance and finance). That composition happens in **one** clearly bounded module whose only job is to map system data into clean, typed, frontend-ready shapes: the `LocalizedText` texts, place summaries, trees and chart series the screens consume. It reads through the owning modules' actions; it owns no tables and duplicates no domain rules. Its name and boundary are fixed in the app contracts task (TSK-70669AC571AA) and recorded in this rule when chosen.

## Applying the rule

- Every module, query, input, output and type is declared in the Dryv app contracts (`dryv/contracts/apps/api`) before generation.
- When a module is renamed or removed, update its contracts, the generated SDK, every caller and the related docs in the same work.

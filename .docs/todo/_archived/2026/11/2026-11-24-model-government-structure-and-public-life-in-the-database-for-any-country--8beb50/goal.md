---
{id: GOAL-GRP-F3C7A28BEB50,name: Model government structure and public life in the database for any country goal,type: documentation,extra: {created_at: 2026-11-19T09:51:25.462Z,group: GRP-F3C7A28BEB50}}
---

# Goal

Make the single PostgreSQL database able to hold, for any country and any government, everything the "Mzizi design fixes" screens show: where a person lives and which offices serve that place, how every public office is filled (elected, nominated, appointed or seated by right of another office), who sits above whom, which body answers to which, which level of government handles which public function, how places compare on statistics and rankings, and when the next election and its milestones fall. Kenya is the first and most demanding proof, but the model must not contain Kenya. A reader should be able to load South Africa, Nigeria, Ghana, Ethiopia, Uganda or any other country by adding seed rows and wording, with no change to a contract, a package or a screen.

This work comes before any further screen, API read or seed load. The design pages cannot be built honestly until the database can hold their facts. The stored facts must keep the project's evidence rules: every meaningful claim cites a source citation, historical validity is separate from retrieval time, uncertainty and disagreement are recorded, and nothing a model proposes becomes canonical without review.

## How success is measured

1. Every screen in the design PDF (home, leadership tree, family tree, matrix, radial, "your place" ladder and two-government view, institutions, three arms, hierarchy map, "who handles what") has a written requirements-to-contract map showing which authored Dryv table and column supplies each element, or which new table supplies it.
2. The new and changed contracts are authored in `dryv/contracts/schemas/postgres/`, reviewed by the owner, generated into `source/backend/database/sql/schema.sql` and the engine row models, and the generation check passes.
3. A paper test loads Kenya and at least two structurally different countries (a federal state with an indirectly elected chamber, and a system with party-list seats or customary authorities) through the model without a new column.
4. `grep` for Kenyan place names, office names and legal article numbers in `dryv/contracts/`, `source/packages/`, `source/backend/` and `source/apps/` returns nothing outside manifests, seed rows, copy rows and tests.
5. Every new vocabulary, and every Kenya seed row, has been shown to the owner and approved before it is added.

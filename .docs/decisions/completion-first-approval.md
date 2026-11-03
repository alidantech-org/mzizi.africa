---
{id: DEC-COMPLETION-FIRST,name: "Decision - chase completion, promote with open validation instead of blocking",type: decision,tags: [data-engine,approval,validation,people]}
---

# Decision: completion first

Date: 3 November 2026. Set by the product owner: "it is not that serious yet; allow data that still needs validation; chase completion, not perfection".

**Rule.** The agent account (DEC-AUTO-APPROVAL) approves and promotes a candidate even when soft validation checks warn, as long as no hard check fails. The promoted record is marked `unverified` (or `under_review` where a check warned) in the verification ledger, keeps its attribution with a confidence, and carries its warnings in the rationale so reinforcement can improve it later.

**Hard checks that still block:** schema or key violations, missing required fields, the personal-data scan (phone, email, ID numbers, ethnicity/disability of individuals), a request that the gate refused, and licence rules for media. Everything else is a soft warning: sum mismatches within tolerance, fuzzy matches below the auto-link threshold (they stay unlinked but the record is still created), single-source claims, missing optional fields, unresolved names.

**People.** Public-office facts only (name, office, term, party, constituency, how they came to hold the seat: elected, nominated, appointed). A name alone never merges two people (DEC-ENTITY-MATCHING); a new person record is created and a duplicate flag is raised. Locations of election results and seats are linked when geography matches by score, otherwise left unlinked and reported.

**Quarantine** is for personal-data hits only. Do not hold back whole batches for a handful of bad rows; reject or quarantine the rows and promote the rest.

---
{id: GRP-EE243999D0C8,name: "Contract-first frontends, context and interactions: design",type: documentation,extra: {created_at: 2026-11-18T17:51:42.341Z}}
---

# Plan

Approach: documentation first, one document per concern, each reviewed by the owner before the next phase starts. No contract, pack, schema, API or app code is changed by this group, except the removal of the deferred admin and old mobile apps and the clean-up of every reference to them.

Milestones: (1) task record and decision records; (2) UI information architecture with a page-by-page mapping of every current screen to its new address and template; (3) user interactions and trust model with its privacy and abuse analysis; (4) context and localisation design; (5) contract authoring model for frontends; (6) Dryv capability plan with a proving slice; (7) blast-radius inventory method and migration order with estimates; (8) review workbench behaviour recorded, then admin and old mobile removed and references rewritten.

Risks: fingerprinting and precise location are personal data in every country served, so consent, minimisation and retention must be settled before any build; the Dryv engine changes are large and untested; the UI map may reveal pages that should merge or disappear. Each risk has an open question in the relevant document. Implementation groups are created only after this group is accepted.

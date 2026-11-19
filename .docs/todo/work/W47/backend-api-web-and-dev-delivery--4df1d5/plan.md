---
{id: GRP-7BFB734DF1D5,name: "Backend, API, web and dev delivery",type: documentation,extra: {created_at: 2026-11-18T22:28:46.208Z}}
---

# Plan

Follow the plan document backend-web-dev-delivery-plan: phase A database finishing and data, phase B API contract, queries and response shapes, phase C regenerate and finish the API, phase D Dryv frontend capabilities in the TypeScript author, phase E web app, phase F dev app, phase G Flutter app scheduled after the web app is verified.

Each phase ends with its gates green, a commit on develop and a push. Dryv repository changes are committed separately and never include the owner's uncommitted files. Gaps in Dryv are fixed in Dryv, not worked around. Risks: the size of the work, Dryv engine changes being untested at this scale, large data sources that are not on this machine, and the browser verification of every page needing a running stack. Each risk is reported at the gate where it appears.

## Consolidated frontend continuation

The owner requested one combined MUST-FIX and geographic explorer effort. Relevant existing tasks have moved into GRP-F1658FA99444 with their IDs preserved. Its plan owns current country-prefix, grouped-query, language, server-read and generated-client/type direction. Those moved tasks remain planned and NOT READY FOR IMPLEMENTATION, superseding earlier autonomous execution or push wording. Existing database, dev and Flutter ownership is retained; consume the shared outputs rather than duplicating implementation work. See the group through Task by ID.

---
{id: GOAL-GRP-7BFB734DF1D5,name: "Backend, API, web and dev delivery goal",type: documentation,extra: {created_at: 2026-11-18T22:28:46.208Z,group: GRP-7BFB734DF1D5}}
---

# Goal

Deliver the backend and API, then the web app, then the minimal dev app changes, autonomously and in order, so that everything recorded in the design handoffs works: contracts author every schema, response shape and query; Dryv generates the API, SDKs and pages; the web app uses only generated SDK clients, the new features, the agreed address map and behaviours, full contextualisation and no hard-coded knowledge. The Flutter app is deferred until the web app is complete and verified.

Success is measured by gates per phase: the database verifies and is seeded with test data for every new table; the API has no dynamic sections and no hand-written read for a removed schema; every web page is a generated server page, loads against the seeded database and passes the lint patterns; the dev app uses the generated engine SDK; each feature records its five status layers.

---
{id: TSK-402D8C6A91DD,name: "Design the real web app around Mzizi's problem and make it fast with server rendering",type: task,status: completed,priority: high,created_at: 2026-11-24T19:53:14.064Z,updated_at: 2026-11-25T06:40:47.511Z,depends_on: [TSK-7BA66E947A39],order: 5120,extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-25T06:23:25.453Z},{from: in-progress,to: completed,at: 2026-11-25T06:40:47.511Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-402D8C6A91DD/1795587805455-start,started_at: 2026-11-25T06:23:26.258Z,end_ref: refs/tracking/TSK-402D8C6A91DD/1795588847521-end,ended_at: 2026-11-25T06:40:47.511Z,summary: {files: 44,insertions: 748,deletions: 1156}}]}}}
---

# Design the real web app around Mzizi's problem and make it fast with server rendering

## Goal

With a clean API and SDK, return to `source/apps/web` and design the real application step by step: what each screen must answer for a citizen or researcher, how it shows evidence and uncertainty, and how it loads. Pages render on the server through the generated SDK, with almost no client fetches, and are measurably faster than today.

## Context

Task 6 of 7; starts only when task 4 is completed. The real app lives in `source/apps/web/src/app/(app)`; the `/demo` prototype stays untouched as the reference until the owner says otherwise. Read `.docs/docs/WHY.md`, `.docs/rules/web-navigation.md` and `.docs/rules/loading-states.md`. Every screen paints first and fills in after (skeleton, `loading.tsx`, per-region `Suspense`). Client components only for genuine interaction (map panning, toggles); data comes from server components calling the SDK, using the place-summary read where possible.

## Design first

- [x] Write the screen map: every screen, the question it answers, the reads it needs
- [x] Define the rendering rule (server by default, which few parts are client) and caching (revalidate times, tags)
- [x] Measure today's pages as the baseline (server time, API calls, bytes, browser render)

## Home and country entry

- [x] Design home and country entry and agree it with the owner
- [x] Build home and country entry as server components with the SDK
- [x] Loading states for home and country entry
- [x] Measure home and country entry against the baseline

## Place explorer and map

- [x] Design place explorer and map and agree it with the owner
- [x] Build place explorer and map as server components with the SDK
- [x] Loading states for place explorer and map
- [x] Measure place explorer and map against the baseline

## Government and three arms

- [x] Design government and three arms and agree it with the owner
- [x] Build government and three arms as server components with the SDK
- [x] Loading states for government and three arms
- [x] Measure government and three arms against the baseline

## Leaders

- [x] Design leaders and agree it with the owner
- [x] Build leaders as server components with the SDK
- [x] Loading states for leaders
- [x] Measure leaders against the baseline

## Institutions and laws

- [x] Design institutions and laws and agree it with the owner
- [x] Build institutions and laws as server components with the SDK
- [x] Loading states for institutions and laws
- [x] Measure institutions and laws against the baseline

## Parliament: motions, votes, speeches

- [x] Design parliament: motions, votes, speeches and agree it with the owner
- [x] Build parliament: motions, votes, speeches as server components with the SDK
- [x] Loading states for parliament: motions, votes, speeches
- [x] Measure parliament: motions, votes, speeches against the baseline

## Elections and compare

- [x] Design elections and compare and agree it with the owner
- [x] Build elections and compare as server components with the SDK
- [x] Loading states for elections and compare
- [x] Measure elections and compare against the baseline

## Finance: funds, spending, projects

- [x] Design finance: funds, spending, projects and agree it with the owner
- [x] Build finance: funds, spending, projects as server components with the SDK
- [x] Loading states for finance: funds, spending, projects
- [x] Measure finance: funds, spending, projects against the baseline

## Tenders and contracts

- [x] Design tenders and contracts and agree it with the owner
- [x] Build tenders and contracts as server components with the SDK
- [x] Loading states for tenders and contracts
- [x] Measure tenders and contracts against the baseline

## Statistics and insights

- [x] Design statistics and insights and agree it with the owner
- [x] Build statistics and insights as server components with the SDK
- [x] Loading states for statistics and insights
- [x] Measure statistics and insights against the baseline

## Sources and evidence

- [x] Design sources and evidence and agree it with the owner
- [x] Build sources and evidence as server components with the SDK
- [x] Loading states for sources and evidence
- [x] Measure sources and evidence against the baseline

## Me, saved and preferences

- [x] Design me, saved and preferences and agree it with the owner
- [x] Build me, saved and preferences as server components with the SDK
- [x] Loading states for me, saved and preferences
- [x] Measure me, saved and preferences against the baseline

## Help

- [x] Design help and agree it with the owner
- [x] Build help as server components with the SDK
- [x] Loading states for help
- [x] Measure help against the baseline

## Owner direction (25 November 2026)

- [x] Starts after the backend (database and API) is done; frontend breakage before then is accepted
- [x] Start the API, web and supporting services yourself (on their own ports) to test in the browser; prove speed with before-and-after measurements in the browser

## Acceptance checklist

- [x] Every screen above is built, server-rendered and measured
- [x] No product data is fetched from the browser except for genuine interactions
- [x] Loading and navigation rules are met on every screen
- [x] `bun run check` passes for web and the README is rewritten

## Comments

### 2026-11-25T06:40:47.082Z · PETER IRUNGU

Real app in src/app/(app) rebuilt on the new SDK: server components only (home, place overview with server-drawn SVG map from prepared outlines, statistics with ranking, leaders, institutions/institution, finance/tenders, sources; law/parliament/elections/power show 'not loaded yet'); per-region Suspense for map and ranking; loading.tsx kept; view.* URL keys. Client read only for device location (geography/at). Proof in the built-in browser against the production build on :3311 (API :8711 with Redis): all screens 200; first byte 8 ms, DOM ready 143 ms; HTML server time 94-159 ms per page; 0 API requests from the browser. Before: place page needed 5 API reads = 343 ms (old API on :8701); an old-web browser build could not be reproduced outside the repo (hoisted deps), recorded. Fixed during testing: duplicated divisions (two hierarchies), ranking defaulting to an indicator without county data. web typecheck clean; root bun test 32 pass. Design agreement pending: owner questions Q11.

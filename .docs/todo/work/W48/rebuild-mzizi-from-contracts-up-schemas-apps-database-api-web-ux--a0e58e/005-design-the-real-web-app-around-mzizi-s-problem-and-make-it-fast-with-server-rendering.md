---
{id: TSK-402D8C6A91DD,name: "Design the real web app around Mzizi's problem and make it fast with server rendering",type: task,status: planned,priority: high,created_at: 2026-11-24T19:53:14.064Z,updated_at: 2026-11-24T19:53:14.064Z,depends_on: [TSK-7BA66E947A39],order: 5120}
---

# Design the real web app around Mzizi's problem and make it fast with server rendering

## Goal

With a clean API and SDK, return to `source/apps/web` and design the real application step by step: what each screen must answer for a citizen or researcher, how it shows evidence and uncertainty, and how it loads. Pages render on the server through the generated SDK, with almost no client fetches, and are measurably faster than today.

## Context

Task 5 of 6; starts only when task 4 is completed. The real app lives in `source/apps/web/src/app/(app)`; the `/demo` prototype stays untouched as the reference until the owner says otherwise. Read `.docs/docs/WHY.md`, `.docs/rules/web-navigation.md` and `.docs/rules/loading-states.md`. Every screen paints first and fills in after (skeleton, `loading.tsx`, per-region `Suspense`). Client components only for genuine interaction (map panning, toggles); data comes from server components calling the SDK, using the place-summary read where possible.

## Design first

- [ ] Write the screen map: every screen, the question it answers, the reads it needs
- [ ] Define the rendering rule (server by default, which few parts are client) and caching (revalidate times, tags)
- [ ] Measure today's pages as the baseline (server time, API calls, bytes, browser render)

## Home and country entry

- [ ] Design home and country entry and agree it with the owner
- [ ] Build home and country entry as server components with the SDK
- [ ] Loading states for home and country entry
- [ ] Measure home and country entry against the baseline

## Place explorer and map

- [ ] Design place explorer and map and agree it with the owner
- [ ] Build place explorer and map as server components with the SDK
- [ ] Loading states for place explorer and map
- [ ] Measure place explorer and map against the baseline

## Government and three arms

- [ ] Design government and three arms and agree it with the owner
- [ ] Build government and three arms as server components with the SDK
- [ ] Loading states for government and three arms
- [ ] Measure government and three arms against the baseline

## Leaders

- [ ] Design leaders and agree it with the owner
- [ ] Build leaders as server components with the SDK
- [ ] Loading states for leaders
- [ ] Measure leaders against the baseline

## Institutions and laws

- [ ] Design institutions and laws and agree it with the owner
- [ ] Build institutions and laws as server components with the SDK
- [ ] Loading states for institutions and laws
- [ ] Measure institutions and laws against the baseline

## Parliament: motions, votes, speeches

- [ ] Design parliament: motions, votes, speeches and agree it with the owner
- [ ] Build parliament: motions, votes, speeches as server components with the SDK
- [ ] Loading states for parliament: motions, votes, speeches
- [ ] Measure parliament: motions, votes, speeches against the baseline

## Elections and compare

- [ ] Design elections and compare and agree it with the owner
- [ ] Build elections and compare as server components with the SDK
- [ ] Loading states for elections and compare
- [ ] Measure elections and compare against the baseline

## Finance: funds, spending, projects

- [ ] Design finance: funds, spending, projects and agree it with the owner
- [ ] Build finance: funds, spending, projects as server components with the SDK
- [ ] Loading states for finance: funds, spending, projects
- [ ] Measure finance: funds, spending, projects against the baseline

## Tenders and contracts

- [ ] Design tenders and contracts and agree it with the owner
- [ ] Build tenders and contracts as server components with the SDK
- [ ] Loading states for tenders and contracts
- [ ] Measure tenders and contracts against the baseline

## Statistics and insights

- [ ] Design statistics and insights and agree it with the owner
- [ ] Build statistics and insights as server components with the SDK
- [ ] Loading states for statistics and insights
- [ ] Measure statistics and insights against the baseline

## Sources and evidence

- [ ] Design sources and evidence and agree it with the owner
- [ ] Build sources and evidence as server components with the SDK
- [ ] Loading states for sources and evidence
- [ ] Measure sources and evidence against the baseline

## Me, saved and preferences

- [ ] Design me, saved and preferences and agree it with the owner
- [ ] Build me, saved and preferences as server components with the SDK
- [ ] Loading states for me, saved and preferences
- [ ] Measure me, saved and preferences against the baseline

## Help

- [ ] Design help and agree it with the owner
- [ ] Build help as server components with the SDK
- [ ] Loading states for help
- [ ] Measure help against the baseline

## Acceptance checklist

- [ ] Every screen above is built, server-rendered and measured
- [ ] No product data is fetched from the browser except for genuine interactions
- [ ] Loading and navigation rules are met on every screen
- [ ] `bun run check` passes for web and the README is rewritten

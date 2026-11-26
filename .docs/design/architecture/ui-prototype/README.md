---
{id: DOC-UI-PROTOTYPE-WORKBENCH,name: UI prototype (browser mock),type: documentation,tags: [web,prototype,design]}
---

# UI prototype (browser mock)

A static, no-build mock of the Mzizi web app, to try the layout, navigation, maps, graphs and flows before they are built against the generated API. **Sample and fictional data only. It is design reference, not implementation: nothing here proves a screen's data or rules are ready.** The real application lives in `source/apps/web` and reads through `@mzizi/api-client`.

## Open it

Use the bundled server: it serves files and falls back to `index.html` for place paths, so the documented URLs work.

```bash
python3 .docs/design/architecture/ui-prototype/serve.py 5599
```

Then open `http://127.0.0.1:5599/ke/nairobi?view=atlas`. Opening `index.html` directly, or through a server with no path fallback (VS Code Live Server), uses a fallback `?at=ke/nairobi` key instead of the path.

## Shell and navigation (mirrors `source/apps/web`)

| Part | Behaviour |
| --- | --- |
| Sidebar | Groups Place, Politics, Government, Money, Data; groups collapse (cookie `mzizi-proto-groups`); expanded, rail or hidden (cookie `mzizi-proto-side`); mobile drawer. |
| Disabled links | Never removed. A view that does not reach the current level is greyed, locked and explains why on hover, focus or tap (`P.whyUnavailable`, from `whyUnavailable` in `route.ts`). |
| App bar | Location switcher with breadcrumb, search (Ctrl K), language (en/sw), saved places, alerts, settings. |
| Location capture | Device location or a click on the map, then county, constituency and ward. Constituency and ward are marked approximate until real boundaries load. Opens by itself on the first visit. |
| URL | As documented in `web-navigation.md`: the place is the path (`/ke/nairobi/westlands`), the subject and selections are query namespaces (`view`, `view.*`, `filters.*`, `sort.*`, `page.*`, `display.*`, `lang`), the hash is the section. Changing subject drops keys the new view does not own. |
| Scroll | Changing place, filter, sort or tab inside one view keeps the scroll and hash; a new subject starts at the top or at its `#section`. The hash follows the reader by `replaceState`. |
| Loading | The frame paints at once, the page shows a skeleton, and slow regions (maps, galleries) stream in on their own with a placeholder of the same height. |
| Preferences | One cookie per topic (`mzizi-proto-theme`, `-side`, `-groups`, `-place`, `-a11y`, `-saved`), applied before first paint. |

## Screens and the tables behind them

| Screen | Schemas and tables it is designed around |
| --- | --- |
| Overview | `geography.areas`, `statistics.observations`, `governance.holders`, `event.occurrences`, `community.posts` |
| Atlas | `geography.areas`, `geography.outlines` (zoom bands 0-3, tolerance), `geography.changes`, layers from `civic.facilities`, `civic.projects`, `election.stations`, `community.posts` |
| History | `history.eras`, `history.occurrences`, `identity.names` (names over time), `geography.changes` |
| Media | `media.articles`, `media.assets` (provider, availability, start and end seconds), `media.captions`, `media.uses` |
| Community | `community.posts`, `replies`, `reactions`, `proofs`, `places`, `cases`, `subscriptions`, `notifications` |
| Elections | `election.elections`, `contests`, `candidates`, `results` (status, basis, revision, supersedes), `turnouts`, `forms`, `stations` |
| Parliament | `legislature.bills`, `stages`, `motions`, `votes`, `hansards`, `speeches` |
| Promises | `politics.commitments`, `politics.fulfilments`, linked to `civic.projects`, `civic.contracts`, `finance.appropriations`, `legislature.bills` |
| Leadership | `governance.holders`, `offices`, `terms`, `official.individuals`, `politics.memberships` |
| Institutions | `governance.institutions`, `offices`, `relationships` |
| Power model | `governance.powers`, `governance.procedures`, `governance.relationships` |
| Laws | `legal.*` |
| Finance | `finance.budgets`, `revisions`, `appropriations`, `flows`, `debts`, `findings` |
| Suppliers | `civic.procurements`, `bids`, `contracts`, `variations`, `deliveries` |
| Statistics, Compare | `statistics.indicators`, `observations`, `breakdowns`, `collections`, `priorities` |
| Sources | `source.*` and the raw artifact, extracted, candidate, review, accepted path |

## Files

`index.html` frame; `shell.css`, `views.css` styling with the web app's palette tokens; `data.js` seeded sample data shaped like the tables; `core.js` URL state, rules, rendering; `viz.js` charts, canvas atlas and power graph; `shell.js` sidebar, app bar, location capture; `views-*.js` the screens; `boot.js` start-up.

## Known gaps

- The atlas draws schematic territories (nearest-centroid cells inside a rough outline), not real boundaries.
- Only Kenya has sample data; other countries are not offered.
- Counts, names and results are fictional; party names and candidates are invented.

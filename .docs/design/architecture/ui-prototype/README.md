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

## Interface behaviour

- **Icons:** one duotone set on a 24 grid (`icons.js`): a soft fill under a 1.65 stroke, accent-tinted when active, sized by tokens (`--ic`).
- **Scrollbars:** thin, quiet, widen on hover, with standards properties for Firefox and a stable gutter (`polish.css`). The sidebar, popovers, tables and drawers all use them.
- **Sizing:** control heights are tokens (`--ctl`, `--ctl-sm`); coarse pointers get 44 px targets.
- **Popovers:** anchored with flip and clamp, arrow-key navigation, Home and End, Tab loop, Escape closes and returns focus, `aria-expanded` on the trigger.
- **Place picker:** search across counties, constituencies and wards, or drill down level by level with a breadcrumb, without leaving the page.
- **Switchers:** language popover (translation limits stated), quick light and dark toggle, sidebar modes.
- **Reading aids:** a reading-progress line under the app bar and an "on this page" rail on wide screens that follows the section hash.

## Parliament

A chamber drawn as a hemicycle you can filter by party and hover seat by seat, an order paper, a bill board (columns are legislature stages), a bill page with a committee-amendment redline, a division drawn on the seats (every dot is a member coloured by how they voted), a Hansard reader with speaking time, and a members table. Bills link to the law they change. Code: `views-parliament.js`.

## Maps and graphs

Maps are plain SVG: each area is a real shape you can hover (tooltip), focus with the keyboard and click (go to that place). There is no zoom, pan or canvas. The power graph is SVG too: hover an arrow to see what it is, click a box or arrow for detail. Code: `V.map` and `V.graph` in `viz.js`.

## Laws

A reader for acts and constitutions (`views-legal.js`):

- **Structure:** chapters or parts with a contents tree, provisions with numbered subsections, a sticky breadcrumb that follows the reader (instrument, chapter, article), and previous and next links.
- **Reference following:** every cross-reference is underlined. Click one and it opens in a side pane beside what you are reading, so the place is kept; follow it onwards and a trail records the path, with Back to walk it. Hover shows a preview. Ctrl or Cmd click opens it in the reader. The state is `view.ref` and `view.trail`.
- **Reference map:** for the pane's provision, what it refers to and what cites it, each clickable. A library view shows how the instruments cite each other and the most cited provisions.
- **Defined terms:** underlined; hover for the definition and where it is defined.
- **As at a date:** pick any date, or "if pending changes pass", and read that version with word-level redlines against the previous one. Pending changes link to the bill in parliament.
- **Powers:** provisions that give powers link to the power model.
- **Also:** in-instrument search with a match count, copy link, cite, and the source page as an evidence figure.

Provision wording is a sample paraphrase, not the official text.

## Evidence-first figures

Every marked figure (overview, elections, finance, statistics, leader profiles) is a link that opens an evidence drawer. The open figure is the `view.fig` query key, so it is shareable, Back closes it, and scroll is kept. The drawer shows:

- status (verified, provisional, revised, estimate, disputed) with a glyph as well as a colour;
- the evidence path (raw artifact, extracted, candidate, reviewed, versioned data) at the figure's real position;
- each source with where in it, retrieved time, robots signal and checksum, plus the original text with the figure highlighted;
- the revision history, where a correction supersedes rather than overwrites;
- where collections disagree and which one is shown (`statistics.priorities`);
- who approved it, a person or an approved automatic rule;
- copy citation, copy link, follow changes and report a problem.

Code: `evidence.js` (record, drawer), `P.fig()` and `P.stat(..., key)` in `core.js`.

## Atlas through time

The Atlas has a second mode, **Through time** (`?view=atlas&view.mode=time&view.year=1975`). One scrubber, with play and era-jump buttons, redraws for the chosen year:

- the administrative units of that era (illustrative zones, one protectorate, colony plus coastal strip, 8 provinces, 47 counties) beside a "today" map, so the past is never forced onto present borders;
- the name the selected place was known by, the unit it belonged to, who governed and who headed the unit;
- the nearby moments that changed the map. The unit count is an evidence figure that opens the drawer.

The year is the `view.year` query key. Dragging updates it with `replaceState`; the jump buttons add history entries. Code: `views-time.js`, era data in `data.js` (`D.ERAS`, `D.eraUnits`, `D.shifts`). Eras and facts are simplified sample data.

## Screens and the tables behind them

| Screen | Schemas and tables it is designed around |
| --- | --- |
| Overview | `geography.areas`, `statistics.observations`, `governance.holders`, `event.occurrences`, `community.posts` |
| Atlas | `geography.areas`, `geography.outlines` (prepared outlines drawn as shapes), `geography.changes`, layers from `civic.facilities`, `civic.projects`, `election.stations`, `community.posts` |
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

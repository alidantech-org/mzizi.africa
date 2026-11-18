# Mzizi Flutter app

The public app lives here; `source/apps/mobile` is the separate earlier geography client. Dryv generates the API client and reference screens. The router assembles the hand-written presentation screens through `mzizi_api`; it does not write canonical domain data.

## Run and verify

Run from the repository root:

```bash
bun run sync --only app
bun run typecheck --only app
bun run test --only app
bun run build --only app
bun run dev:stack -- flutter
bash scripts/dev/android.sh dev install
bash scripts/dev/android.sh dev shot
```

Android development uses `config/development.json` and `adb reverse tcp:8700 tcp:8700`. Install requires an authorised connected device; the script preserves saved app preferences. Production configuration is separate in `config/production.json`. See [development commands](../../../scripts/README.md).

## Current experience

The five bottom destinations are Home, Explore, a textless stationary trophy for Rankings, Search and Profile. A `BottomAppBar` with a circular notch surrounds the docked trophy. Its laurel and sparkle decoration stays still. Home places the logo at the left and region picker at the right. Profile holds language, theme and saved region preferences. Android platform splash resources precede the short Flutter reveal.

Explore links to the existing statistics, elections, parliamentary activity, parties, projects, procurement and source screens, plus these API-backed destinations:

| Route | Experience |
| --- | --- |
| `/leaders-tree`, `/leaders` | Backend-defined appointment categories, institution switcher, connected graph, level focus and leader/body details. `?institution=<code>` opens a whole institution. |
| `/institutions`, `/institutions/:code` | Directory grouped by backend arm, searchable bodies, functions, holders, related bodies, Markdown explanations and legal references. |
| `/constitution` | Constitution overview, followed by backend-related chapter, article and clause links. |
| `/content?slug=<slug>` | Selectable formatted Markdown, resolved images, related content and legal foundations. Subject-table/code queries are also supported. |
| `/library` | The content library in the selected interface language. |
| `/compare` | Backend-defined hierarchy, missing-rung explanations, nearest places and top performers, manual choices, bars and a normalized radar comparison. |

The graph uses backend edges to calculate its layers, not office names or a hard-coded government hierarchy. It initially fits the selected graph; pinch and pan explore it, zoom buttons scale around the viewport centre, Fit shows the structure and Reset focuses on an office holder. Selecting a level hides other levels and retains only recorded edges between the visible nodes. The horizontal bottom selector remains available when a level is empty. The initial scope prefers the selected place’s populated level, otherwise the first populated backend level; category and institution changes reset that default. A missing performance measure is explicitly unavailable, never a zero score. The node sheet exposes reference records.

## Evidence and current limits

Development holders, speeches and explanatory content remain labelled. The app does not turn sample data into verified public facts. Legal foundation cards show review status and link to a full provision when the backend records its code; missing Acts/provisions remain explicit. Content images are already resolved by the API. API-owned names, descriptions and metric units can remain in English where the backend has no translation; interface labels support English and Swahili.

Some older detail screens still consume open generated insight sections through the existing helpers. New governance, content and comparison sections isolate that parsing in named contracts under `presentation/governance/parse/`. Nested generated contracts remain a Dryv limitation.

Loading skeletons have list, article, compact and tree layouts, true shimmer and reduced-motion support. Errors offer retry without exposing internal transport messages. Widget tests cover constrained loading/error layouts, stationary navigation, missing scores, absent categories and bounded graph layout. Device screenshots and live data checks are recorded by the continuation task; passing analysis and widget tests alone does not prove every map, gallery or device configuration has been visually checked.

## Follow-up mobile checks

Comparison percentages are calculated once from the two values. A zero baseline explicitly makes relative percentage change undefined; two zero values remain recorded zeros rather than missing figures. The test suite covers this distinction and rejects the hundredfold display regression found in the web formatter.

Geographic kind matching compares the full final code segment: a `sub-county` is never mistaken for a `county`. The existing ranking scope remains the recorded containing constituency or county, named explicitly under Home when different from the selected place. Old device preferences with the mistaken scope are repaired at launch. Search uses the chosen language, and safe date labels tolerate incomplete periods.

Fullscreen maps retain zoom/location controls and own their controller lifecycle. Galleries support empty collections, clamp out-of-range starting indexes and show the image count even without captions. Statistics rows now use the existing sparkline component where a series is recorded. Real photographs and complete translated data remain dependent on available, attributable backend content.

## Tree navigation regression

All product destinations now share one `ShellRoute`. A typed `SelfFramedGoRoute` marks pages with their own Scaffold so the shell does not add duplicate chrome. Previously the tree was outside the shell and its leader destination re-entered a shell already underneath it; a regression reproduced the exact Navigator duplicate-page-key assertion even after custom fade pages received unique keys. Keeping one shell fixes that topology defect. Custom fade pages also explicitly use `GoRouterState.pageKey`, including repeated pushes to the same destination. Node sheets return their destination and finish their reverse transition before the parent navigates.

The regression drives a rendered tree node through its real detail sheet to View leader, pushes the same leader again, returns and reopens it. Separate checks verify unique Navigator page keys, default populated scope, removal of unrelated levels without invented edges, bounded zoom and fit reset. Device back gestures and screenshots remain part of root-agent runtime verification.

# Public Mzizi web application

This Next.js application is the public civic explorer on port 3300. It consumes the NestJS product API through generated operation clients under `lib/api/`; authored presentation lives in `app/`, `components/site/` and `lib/site/`. It does not own canonical governance classifications, source acquisition or database writes.

## Governance and explanatory reading

- `/institutions` searches and filters the directory by the arms and kinds returned by the API. `/institutions/[code]` presents responsibilities, holders, relationships, explanatory text and legal foundations.
- `/leaders` renders connected, collapsible branches from the governance operation's nodes and edges. Category tabs, institution choices, scope labels and connection meanings come from the server. Select a node for its reference values and related records; select a scope to filter other levels out; only existing same-level connections remain.
- `/constitution` opens the stored constitutional overview and chapters. Legal links can open a provision with `?provision=<code>`. Child provisions are linked through the content operation.
- `/content` lists explanatory content by category and tag; `/content/[slug]` renders Markdown and GFM tables using `react-markdown`, with raw HTML disabled. The backend resolves media references. Development text is labelled.
- `/compare?place=<feature UUID>` offers the nearest and top ranked peers returned by the API, an upward level selector, and a side-by-side table. Missing figures stay missing rather than becoming zero or a low rank.

The dynamic nested sections of generated responses are validated at `lib/site/governance/parse/documents.ts` into named contracts before reaching components. The API still owns the metrics, relationships and classifications. Unknown node kinds fail explicitly rather than being misclassified.

## Running and checking

Run from the repository root:

```bash
bun run dev:stack -- web
bun run typecheck --only web
bun run build --only web
```

The API must be available on port 8700 for data-backed screens. Avoid building and serving development output concurrently: both currently use `.next`. The coordinating process should restart the development server after a production build if needed.

## Data limits

The local development database contains invented holders and explanatory development text; it is not a verified register of current public officials. Available performance measures describe recorded votes or projects and are not overall leader ratings. Legal effects carry their review status. Some Acts are recorded only as statements, and some institution and place records lack legal links or measurements. Missing translations are not silently presented as completed localisation.

See [the governance and content design](../../../.docs/design/data/GOVERNANCE_AND_CONTENT.md) for backend operations, and [the root command guide](../../../scripts/README.md) for service ownership.

## Responsive exploration and preferences

`/explore` links the existing public features with short explanations. `/profile` exposes browser-local language/theme preferences, saved regions and shortcuts into their leadership and comparison views. Small browser screens have five persistent destinations: Home, Explore, a stationary decorated Rankings trophy, Search and Profile; larger screens keep the desktop header, with Leadership directly discoverable.

The leadership canvas has zoom in/out, fit and reset controls, drag/scroll panning, and keyboard arrow navigation (`+`/`-` zoom, `0` reset). Its bottom level switcher starts with the selected place's populated scope or the first populated scope supplied by the backend. All levels remains available. Filtering removes cross-level edges rather than creating unsupported relationships. Selected details scroll into view and link to the actual leader/institution record. Current tenure filtering is owned by the backend; unknown dates do not become a verified-tenure claim.

These controls have typed filtering and server-rendered markup regression tests. The latest controls have not received browser screenshot QA because the browser tool was unavailable in the continuation session; HTTP/build checks are not visual verification.
